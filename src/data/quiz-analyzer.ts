import type { Answer, DBTIType, QuizResult, Director } from '@/types'
import { DBTI_TYPES, matchDBTIType } from './dbti-types'

/**
 * 分析用户的 10 个答案，生成 DBTI 结果。
 *
 * 逻辑：
 * 1. 统计所有选中作品（famous/controversial/hidden/other）的 vibe 标签频率
 * 2. 用 vibe 频率匹配最契合的 DBTI 人格类型
 * 3. 生成附加分析数据
 */
export function analyzeQuiz(
  answers: Answer[],
  directors: Director[],
): QuizResult {
  const vibeCounts: Record<string, number> = {}
  let knownCount = 0
  let lastKnownName = ''

  for (const answer of answers) {
    const director = directors.find((d) => d.id === answer.directorId)
    if (!director) continue

    if (answer.choice === 'unknown') continue

    knownCount++
    lastKnownName = director.name

    const work = getWorkByChoice(director, answer.choice)
    if (work) {
      for (const vibe of work.vibes) {
        vibeCounts[vibe] = (vibeCounts[vibe] ?? 0) + 1
      }
    }
  }

  const matchedType = matchDBTIType(vibeCounts)

  // 特殊判定：如果用户大部分选了「没看过」
  if (knownCount <= 2) {
    const noviceType = DBTI_TYPES.find((t) => t.id === 'PURE')!
    return {
      type: noviceType,
      dimensions: {},
      favoriteDirector: lastKnownName || '未知',
      knownCount,
      matchScore: 20,
    }
  }

  // 计算匹配度（基于 vibe 覆盖率）
  const matchScore = calculateMatchScore(vibeCounts, matchedType)

  return {
    type: matchedType,
    dimensions: vibeCounts,
    favoriteDirector: lastKnownName,
    knownCount,
    matchScore,
  }
}

function getWorkByChoice(director: Director, choice: string) {
  switch (choice) {
    case 'famous':
      return director.famousWork
    case 'controversial':
      return director.controversialWork
    case 'hidden':
      return director.hiddenGem
    case 'other':
      return director.otherWork
    default:
      return null
  }
}

function calculateMatchScore(
  vibeCounts: Record<string, number>,
  type: DBTIType,
): number {
  const total = Object.values(vibeCounts).reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  let matchedVibes = 0
  for (const tag of type.tags) {
    matchedVibes += vibeCounts[tag] ?? 0
  }

  return Math.round((matchedVibes / total) * 100)
}

/** 根据已知导演数和类型返回稀有度描述 */
export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: '🌟 常见型 — 每三个影迷就有一个是你',
    uncommon: '🔮 进阶型 — 你有自己的想法！',
    rare: '🏆 稀有型 — 你是百里挑一的影迷',
    legendary: '👑 传说型 — 电影之神保佑你',
  }
  return labels[rarity] ?? ''
}
