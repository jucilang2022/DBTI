import type { Answer, QuizResult, Director } from '@/types'
import { DBTI_TYPES } from './dbti-types'

type ChoiceCounts = {
  famous: number
  controversial: number
  hidden: number
  other: number
  unknown: number
}

type CountVector = [number, number, number, number, number]

const TYPE_PROTOTYPES: Record<string, CountVector> = {
  PCOM: [6, 1, 1, 1, 1],
  PCOS: [4, 1, 0, 0, 5],
  PCAM: [4, 1, 1, 3, 1],
  PCAS: [2, 1, 0, 2, 5],
  PGOM: [4, 0, 4, 1, 1],
  PGOS: [2, 0, 3, 0, 5],
  PGAM: [2, 0, 4, 3, 1],
  PGAS: [1, 0, 3, 1, 5],
  NCOM: [1, 6, 1, 1, 1],
  NCOS: [1, 4, 0, 0, 5],
  NCAM: [1, 4, 1, 3, 1],
  NCAS: [0, 2, 0, 2, 6],
  NGOM: [0, 3, 5, 1, 1],
  NGOS: [0, 2, 3, 0, 5],
  NGAM: [0, 2, 4, 3, 1],
  NGAS: [0, 1, 3, 1, 5],
}

const TYPE_BALANCE_BIAS: Record<string, number> = {
  PCOM: 4.116,
  PCOS: -5.09,
  PCAM: 8.781,
  PCAS: 0.194,
  PGOM: 2.85,
  PGOS: -5.222,
  PGAM: 5.871,
  PGAS: -4.876,
  NCOM: 2.812,
  NCOS: -5.128,
  NCAM: 8.867,
  NCAS: -7.247,
  NGOM: 2.894,
  NGOS: -5.648,
  NGAM: 4.881,
  NGAS: -4.931,
}

/**
 * DBTI 分析引擎。
 *
 * 每题按选项类别给四个维度加分：
 *   代表作    → P+1, C+1, O+1, M+1
 *   特色佳作  → N+1, C+1, -,   M+1
 *   争议之作 → -,   G+1, A+1, M+1
 *   其他作品  → -,   -,   A+1, M+1
 *   没看过    → -,   -,   -,   S+1
 *
 * 根据五类选择数量匹配 16 型 DBTI。
 * 每个类型有一个语义原型，并叠加固定 balance bias，避免某些类型过易/过难出现。
 */
export function analyzeQuiz(
  answers: Answer[],
  directors: Director[],
): QuizResult {
  // 四维得分
  const scores = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  const choiceCounts: ChoiceCounts = {
    famous: 0,
    controversial: 0,
    hidden: 0,
    other: 0,
    unknown: 0,
  }

  let earliestYearPicks = 0
  let knownCount = 0
  let lastKnownName = ''

  for (const answer of answers) {
    choiceCounts[answer.choice]++
    const director = directors.find((d) => d.id === answer.directorId)
    if (!director) continue

    if (answer.choice === 'unknown') {
      scores.s += 1
      continue
    }

    knownCount++
    lastKnownName = director.name

    // 按选项类别记分
    switch (answer.choice) {
      case 'famous':
        scores.p += 1; scores.c += 1; scores.o += 1; scores.m += 1
        break
      case 'hidden':
        scores.n += 1; scores.c += 1; scores.m += 1
        break
      case 'controversial':
        scores.g += 1; scores.a += 1; scores.m += 1
        break
      case 'other':
        scores.a += 1; scores.m += 1
        break
    }

    // 怀旧老人检测：选了最早的作品
    const work = getWorkByChoice(director, answer.choice)
    if (work) {
      const allWorks = [
        director.famousWork,
        director.controversialWork,
        director.hiddenGem,
      ]
      const earliestYear = Math.min(...allWorks.map((w) => w.year))
      if (work.year === earliestYear) {
        earliestYearPicks++
      }
    }
  }

  const code = matchBalancedType(choiceCounts)
  const matchedType = DBTI_TYPES.find((t) => t.id === code) ?? DBTI_TYPES[0]

  // 计算匹配度（基于四个维度的明确程度）
  const dimClarity = [
    Math.abs(scores.p - scores.n),
    Math.abs(scores.c - scores.g),
    Math.abs(scores.o - scores.a),
    Math.abs(scores.m - scores.s),
  ]
  const claritySum = dimClarity.reduce((a, b) => a + b, 0)
  const matchScore = Math.min(95, Math.round((claritySum / 20) * 70 + (knownCount / 10) * 25))

  return {
    type: matchedType,
    dimensions: { ...scores },
    choiceCounts,
    favoriteDirector: lastKnownName,
    knownCount,
    matchScore,
    earliestYearPicks,
    typeCode: code,
  }
}

function getWorkByChoice(director: Director, choice: string) {
  switch (choice) {
    case 'famous': return director.famousWork
    case 'controversial': return director.controversialWork
    case 'hidden': return director.hiddenGem
    default: return null
  }
}

function matchBalancedType(counts: ChoiceCounts): string {
  const userVector: CountVector = [
    counts.famous,
    counts.hidden,
    counts.controversial,
    counts.other,
    counts.unknown,
  ]

  let bestType = DBTI_TYPES[0].id
  let bestDistance = Number.POSITIVE_INFINITY

  for (const type of DBTI_TYPES) {
    const prototype = TYPE_PROTOTYPES[type.id]
    if (!prototype) continue

    const distance = prototype.reduce((sum, expected, index) => {
      const diff = userVector[index] - expected
      return sum + diff * diff
    }, TYPE_BALANCE_BIAS[type.id] ?? 0)

    if (distance < bestDistance) {
      bestType = type.id
      bestDistance = distance
    }
  }

  return bestType
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
