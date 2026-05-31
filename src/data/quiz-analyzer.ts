import type { Director, QuizAnswer, ChoiceQuestion, DirectorCompareQuestion, QuizResult } from '@/types'
import { DBTI_TYPES } from './dbti-types'

/**
 * DBTI 分析引擎 — 通用维度映射版。
 *
 * 接收 5 种题型的回答数据，分别处理：
 *   - director_work：按选项类别（choice）映射到维度
 *   - director_compare：从所选导演的 dims 累加
 *   - value / scenario / self_cognition：从所选选项的 dims 累加
 */
export function analyzeQuiz(
  answers: QuizAnswer[],
  directors: Director[],
  compareQuestions: DirectorCompareQuestion[],
  valueQuestions: ChoiceQuestion[],
  scenarioQuestions: ChoiceQuestion[],
  selfCognitionQuestions: ChoiceQuestion[],
): QuizResult {
  /* ---- 1. 初始化维度分数 ---- */
  const dims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  /* ---- 2. 处理各题型 ---- */
  let knownCount = 0
  let lastKnownName = ''
  const choiceCounts: Record<string, number> = {
    famous: 0, controversial: 0, hidden: 0, other: 0, unknown: 0,
  }

  for (const answer of answers) {
    switch (answer.questionType) {
      case 'director_work': {
        const director = directors.find((d) => d.id === answer.directorId)
        if (!director) continue

        const c = answer.choice
        if (!c || c === 'unknown') {
          dims.s += 1
          choiceCounts.unknown = (choiceCounts.unknown ?? 0) + 1
          continue
        }

        knownCount++
        lastKnownName = director.name
        choiceCounts[c] = (choiceCounts[c] ?? 0) + 1

        switch (c) {
          case 'famous':
            dims.p += 1; dims.c += 1; dims.o += 1; dims.m += 1
            break
          case 'hidden':
            dims.n += 1; dims.c += 1; dims.m += 1
            break
          case 'controversial':
            dims.g += 1; dims.a += 1; dims.m += 1
            break
          case 'other':
            dims.a += 1; dims.m += 1
            break
        }
        break
      }

      case 'director_compare': {
        const q = compareQuestions.find((cq) => cq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const selectedDirector = q.directors[answer.selectedIndex]
        if (selectedDirector) {
          for (const [dim, val] of Object.entries(selectedDirector.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) dims[key] += val
          }
        }
        break
      }

      case 'value': {
        const q = valueQuestions.find((vq) => vq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const option = q.options[answer.selectedIndex]
        if (option) {
          for (const [dim, val] of Object.entries(option.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) dims[key] += val
          }
        }
        break
      }

      case 'scenario': {
        const q = scenarioQuestions.find((sq) => sq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const option = q.options[answer.selectedIndex]
        if (option) {
          for (const [dim, val] of Object.entries(option.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) dims[key] += val
          }
        }
        break
      }

      case 'self_cognition': {
        const q = selfCognitionQuestions.find((scq) => scq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const option = q.options[answer.selectedIndex]
        if (option) {
          for (const [dim, val] of Object.entries(option.dims)) {
            const key = dim as keyof typeof dims
            if (key in dims) dims[key] += val
          }
        }
        break
      }
    }
  }

  /* ---- 3. 计算最终类型编码 ---- */
  const code = computeTypeCode(dims)
  const matchedType = DBTI_TYPES.find((t) => t.id === code) ?? DBTI_TYPES[0]

  /* ---- 4. 匹配度评分 ---- */
  const clarity = [
    Math.abs(dims.p - dims.n),
    Math.abs(dims.c - dims.g),
    Math.abs(dims.o - dims.a),
    Math.abs(dims.m - dims.s),
  ]
  const claritySum = clarity.reduce((a, b) => a + b, 0)
  const totalQuestions = answers.length
  const matchScore = Math.min(
    95,
    Math.round(
      (claritySum / Math.max(totalQuestions * 2, 1)) * 70 +
      (knownCount / Math.max(totalQuestions, 1)) * 25,
    ),
  )

  return {
    type: matchedType,
    typeCode: code,
    dimensions: { ...dims },
    choiceCounts,
    favoriteDirector: lastKnownName || '未知',
    knownCount,
    matchScore,
  }
}

/** 根据维度分数计算 4 位编码 */
function computeTypeCode(dims: Record<string, number>): string {
  const d1 = dims.p >= dims.n ? 'P' : 'N'
  const d2 = dims.c >= dims.g ? 'C' : 'G'
  const d3 = dims.o >= dims.a ? 'O' : 'A'
  const d4 = dims.m >= dims.s ? 'M' : 'S'
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
