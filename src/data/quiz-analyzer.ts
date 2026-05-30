import type { Answer, DBTIType, QuizResult, Director } from '@/types'
import { DBTI_TYPES, TRIGGER_TYPES, matchDBTIType, getDimensionLabels } from './dbti-types'

/**
 * DBTI 四维分析引擎。
 *
 * 每题按选项类别给四个维度加分：
 *   代表作    → P+1, C+1, O+1, M+1
 *   小众佳片  → N+1, C+1, -,   M+1
 *   低分但不是很低 → -,   G+1, A+1, M+1
 *   其他作品  → -,   -,   A+1, M+1
 *   没看过    → -,   -,   -,   S+1
 *
 * 优先级：触发式特殊人格 > 16型 MBTI 匹配
 */
export function analyzeQuiz(
  answers: Answer[],
  directors: Director[],
): QuizResult {
  // 四维得分
  const scores = { p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 }

  // 选项分布统计（用于触发检测）
  const choiceCounts: Record<string, number> = {
    famous: 0,
    controversial: 0,
    hidden: 0,
    other: 0,
    unknown: 0,
  }

  // 额外检测（怀旧老人）
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
        director.otherWork,
      ]
      const earliestYear = Math.min(...allWorks.map((w) => w.year))
      if (work.year === earliestYear) {
        earliestYearPicks++
      }
    }
  }

  // 第一步：检查触发条件
  const triggeredType = detectTrigger(choiceCounts, earliestYearPicks, scores)
  if (triggeredType) {
    return {
      type: triggeredType,
      dimensions: { ...scores },
      choiceCounts,
      favoriteDirector: lastKnownName,
      knownCount,
      matchScore: 60,
      earliestYearPicks,
      typeCode: triggeredType.id,
    }
  }

  // 第二步：MBTI 16型匹配
  const matchedType = matchDBTIType(scores)
  const code = [scores.p >= scores.n ? 'P' : 'N', scores.c >= scores.g ? 'C' : 'G', scores.o >= scores.a ? 'O' : 'A', scores.m > scores.s ? 'M' : 'S'].join('')

  // 计算匹配度（基于四个维度的明确程度）
  const dimClarity = [
    Math.abs(scores.p - scores.n),
    Math.abs(scores.c - scores.g),
    Math.abs(scores.o - scores.a),
    Math.abs(scores.m - scores.s),
  ]
  const maxPossibleClarity = 10 * 4 // 每题给单边最多10分 × 4维
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

/**
 * 检测触发式特殊人格（优先级从高到低）。
 */
function detectTrigger(
  counts: Record<string, number>,
  earliestYearPicks: number,
  scores: Record<string, number>,
): DBTIType | null {
  if (counts.unknown >= 7) return TRIGGER_TYPES.find((t) => t.id === 'NEWBIE')!
  if (counts.famous >= 9) return TRIGGER_TYPES.find((t) => t.id === 'CROWD')!
  if (earliestYearPicks >= 8) return TRIGGER_TYPES.find((t) => t.id === 'OLDPEOPLE')!
  if (counts.unknown >= 5) return TRIGGER_TYPES.find((t) => t.id === 'NBC')!
  return null
}

function getWorkByChoice(director: Director, choice: string) {
  switch (choice) {
    case 'famous': return director.famousWork
    case 'controversial': return director.controversialWork
    case 'hidden': return director.hiddenGem
    case 'other': return director.otherWork
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
