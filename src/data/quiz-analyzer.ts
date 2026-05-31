import type { QuizAnswer, ChoiceQuestion, DirectorCompareQuestion, QuizResult } from '@/types'
import { DBTI_TYPES } from './dbti-types'

/**
 * DBTI 分析引擎 v4 — 归一化清晰度 + 合理分档。
 *
 * 核心改进：
 *   1. 清晰度按「实际有机会被测量的次数」归一化，而非总题数
 *      避免 M/S 维度数据少导致整体分被拖低
 *   2. matchScore 上限 100，分档更直观（60=过得去, 80=清晰, 90=非常清晰）
 *   3. 交叉验证沿用，但归一化计算让分数更合理
 */
export function analyzeQuiz(
  answers: QuizAnswer[],
  compareQuestions: DirectorCompareQuestion[],
  valueQuestions: ChoiceQuestion[],
  scenarioQuestions: ChoiceQuestion[],
  selfCognitionQuestions: ChoiceQuestion[],
): QuizResult {
  /* ---- 1. 初始化 ---- */
  const dims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }
  // 记录每个维度最大可能被激活的次数（用于归一化）
  const maxPerDim = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }
  // 分题型维度（用于交叉验证）
  const dirDims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0 }
  const behDims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  let knownCount = 0
  let lastKnownName = ''
  const choiceCounts: Record<string, number> = {
    famous: 0, controversial: 0, hidden: 0, other: 0, unknown: 0,
  }

  /* ---- 2. 处理各题型 ---- */
  for (const answer of answers) {
    switch (answer.questionType) {
      /* ======== 导演作品题 ======== */
      case 'director_work': {
        const c = answer.choice
        if (!c || c === 'unknown') {
          choiceCounts.unknown = (choiceCounts.unknown ?? 0) + 1
          continue
        }
        knownCount++
        choiceCounts[c] = (choiceCounts[c] ?? 0) + 1

        switch (c) {
          case 'famous':
            dims.p += 1; dirDims.p += 1; maxPerDim.p += 1
            dims.c += 1; dirDims.c += 1; maxPerDim.c += 1
            dims.o += 1; dirDims.o += 1; maxPerDim.o += 1
            break
          case 'hidden':
            dims.n += 1; dirDims.n += 1; maxPerDim.n += 1
            dims.c += 1; dirDims.c += 1; maxPerDim.c += 1
            dims.a += 1; dirDims.a += 1; maxPerDim.a += 1
            break
          case 'controversial':
            dims.g += 1; dirDims.g += 1; maxPerDim.g += 1
            dims.a += 1; dirDims.a += 1; maxPerDim.a += 1
            break
          case 'other':
            dims.a += 1; dirDims.a += 1; maxPerDim.a += 1
            break
        }
        break
      }

      /* ======== 导演对比题 ======== */
      case 'director_compare': {
        const q = compareQuestions.find((cq) => cq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const sel = q.directors[answer.selectedIndex]
        if (sel) {
          for (const [dim, val] of Object.entries(sel.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) {
              dims[key] += val; maxPerDim[key] += val
            }
            if (key in behDims) behDims[key] += val
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
        const opt = q.options[answer.selectedIndex]
        if (opt) {
          for (const [dim, val] of Object.entries(opt.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) {
              dims[key] += val; maxPerDim[key] += val
            }
            if (key in behDims) behDims[key] += val
          }
        }
        break
      }
    }
  }

  /* ---- 3. 交叉验证：导演题 vs 行为题 ---- */
  const dirCode = computeTypeCode(dirDims)
  const behCode = computeTypeCode(behDims)

  // 如果某维度的dir数据或beh数据为零，该维度不计入一致性
  let agreementCount = 0
  let validDimCount = 0
  for (let i = 0; i < 4; i++) {
    // 检查该维度在两边都有数据
    const dirSide = dirCode[i]
    const behSide = behCode[i]
    if (dirSide === '-' || behSide === '-') continue
    if (dirSide === behSide) agreementCount++
    validDimCount++
  }
  const agreementRatio = validDimCount > 0 ? agreementCount / validDimCount : 0.75

  /* ---- 4. 计算类型编码（含边界情况） ---- */
  const overallCode = computeTypeCode(dims)

  // 全选 unknown 或几乎没数据 → 影坛白纸
  if (knownCount === 0) {
    return {
      type: {
        id: 'NEWBIE',
        name: '影坛白纸',
        nameEn: 'Cinema Rookie',
        tags: [],
        tagline: '勇敢承认自己没看过，也是一种态度。',
        description:
          '你在这 16 道题里几乎都没看过/答不上来。说实话，你能坚持做完已经很了不起了！你的电影知识储备像一张白纸——但也正因为是白纸，你可以画出任何东西。建议收藏这个测试，刷完 50 部经典再回来测一次。',
        spiritDirector: '（建议从张艺谋开始补起）',
        quote: '"这个导演……是拍什么的来着？"',
        recommendations: ['《霸王别姬》', '《千与千寻》', '《肖申克的救赎》', '《功夫》'],
        color: '#6b7280',
        rarity: 'common',
      },
      typeCode: '----',
      dimensions: { ...dims },
      choiceCounts,
      favoriteDirector: '未知',
      knownCount: 0,
      matchScore: 20,
    }
  }

  const matchedType = DBTI_TYPES.find((t) => t.id === overallCode) ?? DBTI_TYPES[0]

  /* ---- 5. 归一化清晰度 ---- */
  const pairs: [string, string][] = [['p','n'], ['c','g'], ['o','a'], ['m','s']]
  const normalizedClarity = pairs.map(([a, b]) => {
    const total = (maxPerDim[a as keyof typeof maxPerDim] ?? 0) + (maxPerDim[b as keyof typeof maxPerDim] ?? 0)
    if (total === 0) return 0.5  // 没有数据 → 中性（不贡献也不惩罚）
    const diff = Math.abs((dims[a as keyof typeof dims] ?? 0) - (dims[b as keyof typeof dims] ?? 0))
    return diff / total  // 0~1, 1=完全偏向一边
  })
  const avgClarity = normalizedClarity.reduce((a, b) => a + b, 0) / 4

  /* ---- 6. 匹配度评分 ---- */
  // ----- 清晰度分（0-50) -----
  // 用 avgClarity × 70 + 15 做映射，确保合理基线：
  //   avgClarity ≈ 5%  (混合型) → 19 分
  //   avgClarity ≈ 25% (中等清晰) → 33 分
  //   avgClarity ≈ 40% (清晰) → 43 分
  //   avgClarity ≈ 60% (极清晰) → 50 分（封顶）
  const clarityScore = Math.min(50, Math.round(avgClarity * 70 + 15))

  // ----- 覆盖率分（0-25）-----
  const coverageScore = Math.min(25, Math.round((knownCount / Math.max(answers.length, 1)) * 25))

  // ----- 一致性分（0-25）-----
  const consistencyScore = Math.round(agreementRatio * 25)

  const matchScore = Math.min(100, clarityScore + coverageScore + consistencyScore)

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

/** 根据维度分数计算 4 位编码 */
function computeTypeCode(dims: Record<string, number>): string {
  const hasP = (dims.p ?? 0) !== 0 || (dims.n ?? 0) !== 0
  const hasC = (dims.c ?? 0) !== 0 || (dims.g ?? 0) !== 0
  const hasO = (dims.o ?? 0) !== 0 || (dims.a ?? 0) !== 0
  const hasM = (dims.m ?? 0) !== 0 || (dims.s ?? 0) !== 0

  const d1 = hasP ? ((dims.p ?? 0) >= (dims.n ?? 0) ? 'P' : 'N') : '-'
  const d2 = hasC ? ((dims.c ?? 0) >= (dims.g ?? 0) ? 'C' : 'G') : '-'
  const d3 = hasO ? ((dims.o ?? 0) >= (dims.a ?? 0) ? 'O' : 'A') : '-'
  const d4 = hasM ? ((dims.m ?? 0) > (dims.s ?? 0) ? 'M' : 'S') : '-'
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
