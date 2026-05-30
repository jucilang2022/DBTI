import type { Answer, DBTIType, QuizResult, Director } from '@/types'
import { DBTI_TYPES, TRIGGER_TYPES, matchDBTIType } from './dbti-types'

/**
 * 分析用户的 10 个答案，生成 DBTI 结果。
 *
 * 逻辑：
 * 1. 统计选项分布（famous / controversial / hidden / other / unknown）
 * 2. 检查是否触发「特殊人格」条件（如 ≥7 个 unknown → 影坛白纸）
 * 3. 未触发则统计 vibe 标签频率，匹配最契合的 12 型 DBTI
 * 4. 生成附加分析数据
 */
export function analyzeQuiz(
  answers: Answer[],
  directors: Director[],
): QuizResult {
  const vibeCounts: Record<string, number> = {}
  let knownCount = 0
  let lastKnownName = ''

  // 选项分布统计
  const choiceCounts = {
    famous: 0,
    controversial: 0,
    hidden: 0,
    other: 0,
    unknown: 0,
  }

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
    }
  }

  // 第一步：检查特殊触发条件
  const triggeredType = detectTrigger(choiceCounts)
  if (triggeredType) {
    return buildResult(triggeredType, vibeCounts, lastKnownName, knownCount, choiceCounts)
  }

  // 第二步：常规 vibe 匹配
  const matchedType = matchDBTIType(vibeCounts)

  // 特殊兜底：已知导演数量极少
  if (knownCount <= 2) {
    const noviceType = DBTI_TYPES.find((t) => t.id === 'POET')!
    return buildResult(noviceType, vibeCounts, lastKnownName, knownCount, choiceCounts, 20)
  }

  return buildResult(matchedType, vibeCounts, lastKnownName, knownCount, choiceCounts)
}

/**
 * 检测是否触发特殊人格。
 * 优先检查：unknown ≥ 7 → 影坛白纸
 *           hidden ≥ 6 → 小众装逼犯
 *           controversial ≥ 6 → 吃瓜群众
 *           famous ≥ 6 → 大众点评
 */
function detectTrigger(
  counts: Record<string, number>,
): DBTIType | null {
  if (counts.unknown >= 7) {
    return TRIGGER_TYPES.find((t) => t.id === 'NEWBIE')!
  }
  if (counts.hidden >= 6) {
    return TRIGGER_TYPES.find((t) => t.id === 'HIDDEN_SNIFFER')!
  }
  if (counts.controversial >= 6) {
    return TRIGGER_TYPES.find((t) => t.id === 'DRAMA')!
  }
  if (counts.famous >= 7) {
    return TRIGGER_TYPES.find((t) => t.id === 'MAINSTREAM')!
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
  favoriteDirector: string,
  knownCount: number,
  choiceCounts: Record<string, number>,
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

/** 返回稀有度描述 */
export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: '🌟 满大街都是，你没什么特别的',
    uncommon: '🔮 有点品味，但不多',
    rare: '🏆 你确实有点东西',
    legendary: '👑 膜拜大佬（或者你在装逼）',
  }
  return labels[rarity] ?? ''
}
