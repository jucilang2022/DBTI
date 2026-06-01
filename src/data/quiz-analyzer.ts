import type { QuizAnswer, ChoiceQuestion, DirectorCompareQuestion, QuizResult } from '@/types'
import { DBTI_TYPES } from './dbti-types'

type DimKey = 'p' | 'n' | 'c' | 'g' | 'o' | 'a' | 'm' | 's'
type DimMap = Record<DimKey, number>

const EMPTY_DIMS = (): DimMap => ({ p: 0, n: 0, c: 0, g: 0, o: 0, a: 0, m: 0, s: 0 })

/**
 * 题型权重：行为题（价值观/情景/自我认知）对最终类型判定影响更大，
 * 导演作品题降权以避免「选 4 次代表作 → 锁死 PCOM」的堆叠效应。
 */
export const QUESTION_TYPE_WEIGHTS: Record<QuizAnswer['questionType'], number> = {
  director_work: 0.5,
  director_compare: 1.1,
  value: 1.45,
  scenario: 1.4,
  self_cognition: 1.4,
}

/**
 * DBTI 分析引擎 v5 — 题型加权 + 归一化维度匹配。
 *
 * 1. 各题型按权重累加维度分，行为题话语权高于导演作品题
 * 2. 类型判定：对 16 型逐一计算「归一化维度契合度」，取得分最高者
 *    （每维贡献 -1~+1，避免 C/A 信号因题量堆叠而碾压 G/O）
 * 3. matchScore 仍基于清晰度 / 覆盖率 / 一致性
 */
export function analyzeQuiz(
  answers: QuizAnswer[],
  compareQuestions: DirectorCompareQuestion[],
  valueQuestions: ChoiceQuestion[],
  scenarioQuestions: ChoiceQuestion[],
  selfCognitionQuestions: ChoiceQuestion[],
): QuizResult {
  const dims = EMPTY_DIMS()
  const maxPerDim = EMPTY_DIMS()
  const dirDims = EMPTY_DIMS()
  const behDims = EMPTY_DIMS()

  let knownCount = 0
  const choiceCounts: Record<string, number> = {
    famous: 0, controversial: 0, hidden: 0, other: 0, unknown: 0,
  }

  for (const answer of answers) {
    switch (answer.questionType) {
      case 'director_work': {
        const c = answer.choice
        if (!c || c === 'unknown') {
          choiceCounts.unknown = (choiceCounts.unknown ?? 0) + 1
          // 没看过该导演 → 贡献 S（随性轻度）维度，确保影迷层级不虚高
          const w = QUESTION_TYPE_WEIGHTS.director_work
          applyDimDelta(dims, { s: 1 }, w, maxPerDim)
          applyDimDelta(dirDims, { s: 1 }, w)
          applyDimDelta(behDims, { s: 1 }, w)
          continue
        }
        knownCount++
        choiceCounts[c] = (choiceCounts[c] ?? 0) + 1

        const w = QUESTION_TYPE_WEIGHTS.director_work
        const delta: Partial<DimMap> =
          c === 'famous' ? { p: 0.85, o: 0.8, c: 0.7 }
          : c === 'hidden' ? { n: 1, c: 0.65, a: 0.9 }
          : c === 'controversial' ? { g: 1, a: 0.55, p: 0.4 }
          : { a: 0.85, p: 0.3 }

        applyDimDelta(dims, delta, w, maxPerDim)
        applyDimDelta(dirDims, delta, w)
        break
      }

      case 'director_compare': {
        const q = compareQuestions.find((cq) => cq.id === answer.questionId)
        if (!q) continue
        knownCount++
        const sel = q.directors[answer.selectedIndex]
        if (sel) {
          const w = QUESTION_TYPE_WEIGHTS.director_compare
          applyDimDelta(dims, sel.dims, w, maxPerDim)
          applyDimDelta(behDims, sel.dims, w)
        }
        break
      }

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
          const w = QUESTION_TYPE_WEIGHTS[answer.questionType]
          applyDimDelta(dims, opt.dims, w, maxPerDim)
          applyDimDelta(behDims, opt.dims, w)
        }
        break
      }
    }
  }

  /* ---- 知识偏差调整 ---- */
  // 如果用户对导演的了解度偏低，强制向 S 方向偏移
  // 避免「没看过几位导演却拿到骨灰级迷影」的矛盾
  const knownRatio = answers.length > 0 ? knownCount / answers.length : 0
  if (knownRatio < 0.4) {
    const penalty = Math.round((0.4 - knownRatio) * 10) // max ~4 points toward S
    dims.s += penalty
    behDims.s += penalty
  }

  const dirCode = deriveTypeCode(dirDims)
  const behCode = deriveTypeCode(behDims)

  let agreementCount = 0
  let validDimCount = 0
  for (let i = 0; i < 4; i++) {
    if (dirCode[i] === '-' || behCode[i] === '-') continue
    if (dirCode[i] === behCode[i]) agreementCount++
    validDimCount++
  }
  const agreementRatio = validDimCount > 0 ? agreementCount / validDimCount : 0.75

  const { type: matchedType, typeCode: overallCode } = matchBestType(dims, behDims)

  const pairs: [DimKey, DimKey][] = [['p', 'n'], ['c', 'g'], ['o', 'a'], ['m', 's']]
  const normalizedClarity = pairs.map(([a, b]) => {
    const total = (maxPerDim[a] ?? 0) + (maxPerDim[b] ?? 0)
    if (total === 0) return 0.5
    const diff = Math.abs((dims[a] ?? 0) - (dims[b] ?? 0))
    return diff / total
  })
  const avgClarity = normalizedClarity.reduce((a, b) => a + b, 0) / 4

  // 覆盖度扣分：unknown 答案越多，可信度越低
  const unknownRatio = answers.length > 0
    ? (choiceCounts.unknown ?? 0) / answers.length
    : 0

  const clarityScore = Math.min(50, Math.round(avgClarity * 70 + 15))
  const coverageScore = Math.min(25, Math.round((knownCount / Math.max(answers.length, 1)) * 25))
  const consistencyScore = Math.round(agreementRatio * 25)
  const unknownPenalty = Math.round(unknownRatio * 15)
  const matchScore = Math.min(100, Math.max(0, clarityScore + coverageScore + consistencyScore - unknownPenalty))

  return {
    type: matchedType,
    typeCode: overallCode,
    dimensions: { ...dims },
    choiceCounts,
    knownCount,
    matchScore,
  }
}

function applyDimDelta(
  target: DimMap,
  delta: Record<string, number>,
  weight: number,
  maxTarget?: DimMap,
) {
  for (const [key, val] of Object.entries(delta)) {
    if (!(key in target)) continue
    const k = key as DimKey
    const weighted = val * weight
    target[k] += weighted
    if (maxTarget) {
      maxTarget[k] += Math.abs(val) * weight
    }
  }
}

/** 单维归一化差值：[-1, 1]，无数据时为 0 */
function normalizedMargin(pos: number, neg: number): number {
  const total = pos + neg
  if (total <= 0) return 0
  return (pos - neg) / total
}

/**
 * 计算某类型与当前维度剖面的契合度。
 * 优先采用行为题（12 题）在各维上的归一化差值；行为题无信号时回退到全量加权分。
 */
export function scoreTypeAlignment(
  dims: DimMap,
  typeId: string,
  behDims?: DimMap,
): number {
  const axes: [DimKey, DimKey, string][] = [
    ['p', 'n', typeId[0]],
    ['c', 'g', typeId[1]],
    ['o', 'a', typeId[2]],
    ['m', 's', typeId[3]],
  ]

  let sum = 0
  let wins = 0
  for (const [posKey, negKey, letter] of axes) {
    const margin = axisMargin(dims, behDims, posKey, negKey)
    const aligned = letter === posKey.toUpperCase() ? margin : -margin
    sum += aligned
    if (aligned > 0) wins++
  }

  return sum + wins * 0.001
}

function axisMargin(full: DimMap, beh: DimMap | undefined, posKey: DimKey, negKey: DimKey): number {
  if (beh) {
    const behTotal = (beh[posKey] ?? 0) + (beh[negKey] ?? 0)
    if (behTotal > 0) {
      return normalizedMargin(beh[posKey] ?? 0, beh[negKey] ?? 0)
    }
  }
  return normalizedMargin(full[posKey] ?? 0, full[negKey] ?? 0)
}

/** 从加权维度分中匹配最佳 16 型（类型判定以行为题为主） */
export function matchBestType(
  dims: DimMap,
  behDims?: DimMap,
): { type: (typeof DBTI_TYPES)[number]; typeCode: string } {
  let bestType = DBTI_TYPES[0]
  let bestScore = -Infinity

  for (const type of DBTI_TYPES) {
    const score = scoreTypeAlignment(dims, type.id, behDims)
    if (score > bestScore) {
      bestScore = score
      bestType = type
    }
  }

  return { type: bestType, typeCode: bestType.id }
}

/** 根据维度分数推导 4 位编码（用于交叉验证、剖面展示） */
export function deriveTypeCode(dims: DimMap | Record<string, number>): string {
  const d = dims as DimMap
  const d1 = pickLetter(d.p, d.n, 'P', 'N')
  const d2 = pickLetter(d.c, d.g, 'C', 'G')
  const d3 = pickLetter(d.o, d.a, 'O', 'A')
  const d4 = pickLetter(d.m, d.s, 'M', 'S')
  return `${d1}${d2}${d3}${d4}`
}

function pickLetter(pos: number, neg: number, posLetter: string, negLetter: string): string {
  if (pos === 0 && neg === 0) return '-'
  return pos >= neg ? posLetter : negLetter
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
