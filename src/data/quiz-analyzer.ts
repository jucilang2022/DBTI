import type { Answer, ValueAnswer, QuizResult, Director, ValueQuestion } from '@/types'
import { DBTI_TYPES } from './dbti-types'

/**
 * DBTI 分析引擎（重写版 — 维度直算）。
 *
 * 不再使用原型向量 + bias 匹配，改为：
 *   1. 导演题 → 按选项类别累加四维分数
 *   2. 价值观题 → 直接按选项映射累加维度分数
 *   3. 合并各维度分数 → 取正负方向得到 4 位字母编码
 *
 * 数据来源更丰富（导演题 + 价值观题），每道题的信号更干净。
 */
export function analyzeQuiz(
  answers: Answer[],
  valueAnswers: ValueAnswer[],
  directors: Director[],
  valueQuestions: ValueQuestion[],
): QuizResult {
  /* ---- 1. 初始化维度分数 ---- */
  const dims = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  /* ---- 2. 处理导演题 ---- */
  let knownCount = 0
  let lastKnownName = ''
  let earliestYearPicks = 0

  for (const answer of answers) {
    const director = directors.find((d) => d.id === answer.directorId)
    if (!director) continue

    if (answer.choice === 'unknown') {
      dims.s += 1
      continue
    }

    knownCount++
    lastKnownName = director.name

    // 选项类别 → 维度映射（与之前保持一致）
    switch (answer.choice) {
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

    // 怀旧检测：选了该导演最早期的作品
    const work = getWorkByChoice(director, answer.choice)
    if (work) {
      const earliestYear = Math.min(
        director.famousWork.year,
        director.controversialWork.year,
        director.hiddenGem.year,
      )
      if (work.year === earliestYear) earliestYearPicks++
    }
  }

  /* ---- 3. 处理价值观题 ---- */
  for (const va of valueAnswers) {
    const q = valueQuestions.find((q) => q.id === va.questionId)
    if (!q) continue
    const option = q.options[va.selectedIndex]
    if (!option) continue

    for (const [dim, val] of Object.entries(option.dims)) {
      const key = dim as keyof typeof dims
      if (key in dims) {
        dims[key] += val
      }
    }
  }

  /* ---- 4. 计算最终类型编码 ---- */
  const code = computeTypeCode(dims)
  const matchedType = DBTI_TYPES.find((t) => t.id === code) ?? DBTI_TYPES[0]

  /* ---- 5. 匹配度评分 ---- */
  const clarity = [
    Math.abs(dims.p - dims.n),
    Math.abs(dims.c - dims.g),
    Math.abs(dims.o - dims.a),
    Math.abs(dims.m - dims.s),
  ]
  const claritySum = clarity.reduce((a, b) => a + b, 0)
  const totalQuestions = answers.length + valueAnswers.length
  const matchScore = Math.min(
    95,
    Math.round(
      (claritySum / Math.max(totalQuestions * 2, 1)) * 70 +
      (knownCount / Math.max(totalQuestions, 1)) * 25,
    ),
  )

  /* ---- 6. 选择分布统计 ---- */
  const choiceCounts: Record<string, number> = {
    famous: 0,
    controversial: 0,
    hidden: 0,
    other: 0,
    unknown: 0,
  }
  for (const a of answers) {
    choiceCounts[a.choice] = (choiceCounts[a.choice] ?? 0) + 1
  }

  return {
    type: matchedType,
    typeCode: code,
    dimensions: { ...dims },
    choiceCounts,
    favoriteDirector: lastKnownName || '未知',
    knownCount,
    matchScore,
    earliestYearPicks,
    valueAnswers,
    valueQuestionCount: valueAnswers.length,
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

function getWorkByChoice(director: Director, choice: string) {
  switch (choice) {
    case 'famous': return director.famousWork
    case 'controversial': return director.controversialWork
    case 'hidden': return director.hiddenGem
    default: return null
  }
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
