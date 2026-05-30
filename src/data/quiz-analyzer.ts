import type { Answer, DBTIType, QuizResult, Director } from '@/types'
import { DBTI_TYPES, TRIGGER_TYPES, matchDBTIType } from './dbti-types'

/**
 * 分析用户的 10 个答案，生成 DBTI 结果。
 *
 * 算法策略：
 * 1. 统计选项分布 + 检测"最早作品"选择模式
 * 2. 按优先级检查触发式特殊人格
 * 3. 未触发则走 vibe 标签匹配
 */
export function analyzeQuiz(
  answers: Answer[],
  directors: Director[],
): QuizResult {
  const vibeCounts: Record<string, number> = {}
  let knownCount = 0
  let lastKnownName = ''

  // 选项分布统计
  const choiceCounts: Record<string, number> = {
    famous: 0,
    controversial: 0,
    hidden: 0,
    other: 0,
    unknown: 0,
  }

  // 「怀旧老人」检测：用户选的是否是该导演最早的作品
  let earliestYearPicks = 0

  for (const answer of answers) {
    choiceCounts[answer.choice]++
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

      // 检测是否选了该导演最早的作品
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

  // 第一步：检查特殊触发条件（按优先级）
  const triggeredType = detectTrigger(choiceCounts, earliestYearPicks)
  if (triggeredType) {
    return buildResult(triggeredType, vibeCounts, choiceCounts, lastKnownName, knownCount, earliestYearPicks)
  }

  // 第二步：常规 vibe 匹配
  const matchedType = matchDBTIType(vibeCounts)

  // 兜底：认识的导演太少
  if (knownCount <= 2) {
    const fallback = DBTI_TYPES.find((t) => t.id === 'POET')!
    return buildResult(fallback, vibeCounts, choiceCounts, lastKnownName, knownCount, earliestYearPicks, 25)
  }

  return buildResult(matchedType, vibeCounts, choiceCounts, lastKnownName, knownCount, earliestYearPicks)
}

/**
 * 检测触发式特殊人格（按优先级）
 *
 * 优先级从高到低：
 * 1. unknown ≥ 7 → 影坛白纸 (NEWBIE)
 * 2. famous ≥ 9 → 跟风大队 (CROWD)
 * 3. hidden ≥ 6 → 小众姐/哥 (HIDDEN_SNIFFER)
 * 4. earliest ≥ 8 → 怀旧老人 (OLDPEOPLE)
 * 5. controversial ≥ 6 → 吃瓜群众 (DRAMA)
 * 6. famous ≥ 7 → 大众点评 (MAINSTREAM)
 * 7. unknown ≥ 5 → 牛逼克拉斯 (NBC)
 */
function detectTrigger(
  counts: Record<string, number>,
  earliestYearPicks: number,
): DBTIType | null {
  // Tier 1: 强信号
  if (counts.unknown >= 7) {
    return TRIGGER_TYPES.find((t) => t.id === 'NEWBIE')!
  }
  if (counts.famous >= 9) {
    return TRIGGER_TYPES.find((t) => t.id === 'CROWD')!
  }

  // Tier 2: 中等信号
  if (counts.hidden >= 6) {
    return TRIGGER_TYPES.find((t) => t.id === 'HIDDEN_SNIFFER')!
  }
  if (earliestYearPicks >= 8) {
    return TRIGGER_TYPES.find((t) => t.id === 'OLDPEOPLE')!
  }
  if (counts.controversial >= 6) {
    return TRIGGER_TYPES.find((t) => t.id === 'DRAMA')!
  }

  // Tier 3: 弱信号
  if (counts.famous >= 7) {
    return TRIGGER_TYPES.find((t) => t.id === 'MAINSTREAM')!
  }
  if (counts.unknown >= 5) {
    return TRIGGER_TYPES.find((t) => t.id === 'NBC')!
  }

  return null
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

function buildResult(
  type: DBTIType,
  vibeCounts: Record<string, number>,
  choiceCounts: Record<string, number>,
  favoriteDirector: string,
  knownCount: number,
  earliestYearPicks?: number,
  overrideScore?: number,
): QuizResult {
  const matchScore = overrideScore ?? calculateMatchScore(vibeCounts, type)
  return {
    type,
    dimensions: vibeCounts,
    choiceCounts,
    favoriteDirector,
    knownCount,
    matchScore,
    earliestYearPicks: earliestYearPicks ?? 0,
  }
}

function calculateMatchScore(
  vibeCounts: Record<string, number>,
  type: DBTIType,
): number {
  const total = Object.values(vibeCounts).reduce((a, b) => a + b, 0)
  if (total === 0) return 30

  let matchedVibes = 0
  for (const tag of type.tags) {
    matchedVibes += vibeCounts[tag] ?? 0
  }

  return Math.round((matchedVibes / total) * 100)
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
