import type { QuizAnswer, ChoiceQuestion, DirectorCompareQuestion, QuizResult } from '@/types'
import { DBTI_TYPES } from './dbti-types'

/**
 * DBTI 分析引擎 v3 — 分类型加权 + 一致性检测。
 *
 * 核心改进：
 *   1. M/S 维度不再从导演作品题获取，改为纯行为维度（价值观/情景题）
 *      避免「认识导演 = 核心影迷」的伪相关
 *   2. 各题型权重收敛：避免某类题型主导结果
 *   3. 交叉验证：比较导演题 vs 非导演题得出的类型是否一致
 *      不一致时降低 matchScore
 */
export function analyzeQuiz(
  answers: QuizAnswer[],
  compareQuestions: DirectorCompareQuestion[],
  valueQuestions: ChoiceQuestion[],
  scenarioQuestions: ChoiceQuestion[],
  selfCognitionQuestions: ChoiceQuestion[],
): QuizResult {
  /* ---- 全局维度累加 ---- */
  const dims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  /* ---- 分题型维度（用于交叉验证） ---- */
  const dirDims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0 }
  const behaviorDims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  let knownCount = 0
  let lastKnownName = ''
  const choiceCounts: Record<string, number> = {
    famous: 0, controversial: 0, hidden: 0, other: 0, unknown: 0,
  }

  for (const answer of answers) {
    switch (answer.questionType) {
      /* ======== 导演作品题 ======== */
      case 'director_work': {
        const c = answer.choice
        if (!c || c === 'unknown') {
          // unknown 不贡献信号
          choiceCounts.unknown = (choiceCounts.unknown ?? 0) + 1
          continue
        }

        knownCount++
        choiceCounts[c] = (choiceCounts[c] ?? 0) + 1

        // 注意：M/S 不从这里获取
        switch (c) {
          case 'famous':
            dims.p += 1; dirDims.p += 1
            dims.c += 1; dirDims.c += 1
            dims.o += 1; dirDims.o += 1
            break
          case 'hidden':
            dims.n += 1; dirDims.n += 1
            dims.c += 1; dirDims.c += 1
            dims.a += 1; dirDims.a += 1
            break
          case 'controversial':
            dims.g += 1; dirDims.g += 1
            dims.a += 1; dirDims.a += 1
            break
          case 'other':
            dims.a += 1; dirDims.a += 1
            break
        }

        // 记录最后认识的导演名字（当前暂未使用）
        break
      }

      /* ======== 导演对比题 ======== */
      case 'director_compare': {
        const q = compareQuestions.find((cq) => cq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const selectedDirector = q.directors[answer.selectedIndex]
        if (selectedDirector) {
          for (const [dim, val] of Object.entries(selectedDirector.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) {
              dims[key] += val
              // 对比题归入行为维度（不涉及具体作品知识）
              if (key in behaviorDims) behaviorDims[key] += val
            }
          }
        }
        break
      }

      /* ======== 价值观/情景/自我认知 ======== */
      case 'value':
      case 'scenario':
      case 'self_cognition': {
        const pool = answer.questionType === 'value' ? valueQuestions
          : answer.questionType === 'scenario' ? scenarioQuestions
          : selfCognitionQuestions
        const q = pool.find((pq) => pq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const option = q.options[answer.selectedIndex]
        if (option) {
          for (const [dim, val] of Object.entries(option.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) dims[key] += val
            if (key in behaviorDims) behaviorDims[key] += val
          }
        }
        break
      }
    }
  }

  /* ---- 计算两个独立类型编码（用于交叉验证） ---- */
  const dirCode = computeTypeCode(dirDims)
  const behaviorCode = computeTypeCode(behaviorDims)
  const overallCode = computeTypeCode(dims)

  // 交叉验证：导演题 vs 行为题的一致性
  let agreementCount = 0
  for (let i = 0; i < 4; i++) {
    if (dirCode[i] === behaviorCode[i]) agreementCount++
  }
  const agreementRatio = Math.min(1, (dirCode !== '----' ? agreementCount : 4) / 4)

  /* ---- 匹配 DBTI 类型 ---- */
  const matchedType = DBTI_TYPES.find((t) => t.id === overallCode) ?? DBTI_TYPES[0]

  /* ---- 匹配度评分（多维） ---- */
  const clarity = [
    Math.abs(dims.p - dims.n),
    Math.abs(dims.c - dims.g),
    Math.abs(dims.o - dims.a),
    Math.abs(dims.m - dims.s),
  ]
  const claritySum = clarity.reduce((a, b) => a + b, 0)
  const totalQuestions = answers.length

  // 维度清晰度分（0-50）
  const clarityScore = Math.min(50, Math.round((claritySum / Math.max(totalQuestions * 1.5, 1)) * 50))

  // 覆盖率分（0-25）：有多少题是有效回答
  const coverageScore = Math.min(25, Math.round((knownCount / Math.max(totalQuestions, 1)) * 25))

  // 一致性分（0-20）：导演题和行为题的结论是否一致
  const consistencyScore = Math.round(agreementRatio * 20)

  const matchScore = Math.min(95, clarityScore + coverageScore + consistencyScore)

  return {
    type: matchedType,
    typeCode: overallCode,
    dimensions: { ...dims },
    choiceCounts,
    favoriteDirector: lastKnownName || '未知',
    knownCount,
    matchScore,
  }
}

/** 根据维度分数计算 4 位编码（兼容只有部分维度的情况） */
function computeTypeCode(dims: Record<string, number>): string {
  const d1 = (dims.p ?? 0) >= (dims.n ?? 0) ? 'P' : 'N'
  const d2 = (dims.c ?? 0) >= (dims.g ?? 0) ? 'C' : 'G'
  const d3 = (dims.o ?? 0) >= (dims.a ?? 0) ? 'O' : 'A'
  const d4 = (dims.m ?? 0) > (dims.s ?? 0) ? 'M' : 'S'
  // 如果 M/S 都没有数据，M/S 无明确倾向时返回中性标记
  if ((dims.m ?? 0) === 0 && (dims.s ?? 0) === 0) {
    return `${d1}${d2}${d3}-`
  }
  return `${d1}${d2}${d3}${d4}`
}

export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: '🌟 满大街都是，你没什么特别的',
    uncommon: '🔮 有点品味，但不多',
    rare: '🏆 你确实有点东西',
    legendary: '👑 膜拜大佬（或者你在装逼）',
  }
  return labels[rarity] ?? ''
}
