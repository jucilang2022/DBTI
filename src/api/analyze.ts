import type { QuizAnswer, QuizQuestion, AnswerChoice } from '@/types'
import { DBTI_TYPES } from '@/data/dbti-types'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import { compareQuestions } from '@/data/director_compare_questions'
import { valueQuestions } from '@/data/value-questions'
import { scenarioQuestions } from '@/data/scenario_questions'
import { selfCognitionQuestions } from '@/data/self_cognition_questions'
import type { QuizResult, AIAnalysis } from '@/types'

/**
 * 为 AI 构建完整的答题记录（含题面、选项文本、用户选择）
 */
function buildQuestionPayload(
  quizAnswers: QuizAnswer[],
  directorQuestions: QuizQuestion[],
): unknown[] {
  const payload: unknown[] = []

  for (const answer of quizAnswers) {
    switch (answer.questionType) {
      case 'director_work': {
        const q = directorQuestions.find((dq) => dq.director.id === answer.directorId)
        if (!q) continue
        const d = q.director
        const choiceMap: Record<AnswerChoice, string> = {
          famous: `代表作：⭐《${d.famousWork.title}》${d.famousWork.year} —— ${d.famousWork.description}`,
          controversial: `争议之作：🎯《${d.controversialWork.title}》${d.controversialWork.year} —— ${d.controversialWork.description}`,
          hidden: `特色佳作：💎《${d.hiddenGem.title}》${d.hiddenGem.year} —— ${d.hiddenGem.description}`,
          other: '其他作品：🎬 有自己更喜欢的作品',
          unknown: '没看过任何一部：❓ 对此导演不太熟悉',
        }
        const options = q.order.map((c) => choiceMap[c])
        payload.push({
          type: '导演作品',
          question: `从 ${d.name}（${d.nameEn}）的作品中选出你最喜欢的一部？`,
          options,
          selected: q.order.indexOf(answer.choice ?? 'unknown'),
        })
        break
      }
      case 'director_compare': {
        const q = compareQuestions.find((cq) => cq.id === answer.questionId)
        if (!q) continue
        const options = q.directors.map((d) => `${d.name}（${d.nameEn}）—— ${d.style}`)
        payload.push({
          type: '导演对比',
          question: q.question,
          options,
          selected: answer.selectedIndex,
        })
        break
      }
      case 'value': {
        const q = valueQuestions.find((vq) => vq.id === answer.questionId)
        if (!q) continue
        payload.push({
          type: '价值观选择',
          question: q.question,
          options: q.options.map((o) => o.text),
          selected: answer.selectedIndex,
        })
        break
      }
      case 'scenario': {
        const q = scenarioQuestions.find((sq) => sq.id === answer.questionId)
        if (!q) continue
        payload.push({
          type: '情景选择',
          question: q.question,
          options: q.options.map((o) => o.text),
          selected: answer.selectedIndex,
        })
        break
      }
      case 'self_cognition': {
        const q = selfCognitionQuestions.find((scq) => scq.id === answer.questionId)
        if (!q) continue
        payload.push({
          type: '自我认知',
          question: q.question,
          options: q.options.map((o) => o.text),
          selected: answer.selectedIndex,
        })
        break
      }
    }
  }

  return payload
}

function formatDimScore(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

/** 为 AI 生成本地维度剖面摘要，帮助文案与算法判定一致 */
function buildDimensionSummary(
  dims: Record<string, number>,
  typeCode: string,
): string {
  const axes = [
    { pos: 'p', neg: 'n', posLabel: 'P 大众', negLabel: 'N 特色' },
    { pos: 'c', neg: 'g', posLabel: 'C 经典', negLabel: 'G 邪典' },
    { pos: 'o', neg: 'a', posLabel: 'O 正统', negLabel: 'A 独到' },
    { pos: 'm', neg: 's', posLabel: 'M 迷影', negLabel: 'S 随性' },
  ] as const

  return axes.map((axis, i) => {
    const pv = dims[axis.pos] ?? 0
    const nv = dims[axis.neg] ?? 0
    const letter = typeCode[i] ?? '-'
    const winner = pv >= nv ? axis.posLabel : axis.negLabel
    return `- 第${i + 1}维 → ${letter}（${winner}）：${formatDimScore(pv)} vs ${formatDimScore(nv)}`
  }).join('\n')
}

interface AIResponse {
  analysis?: {
    typeId: string
    matchReason: string
    roast: string
    recommendations: string[]
  }
}

/**
 * 本地算法判定 DBTI 类型；AI 仅负责根据答题记录生成解读文案。
 * AI 不可用时，仍展示本地类型，只是没有 AI 文案。
 */
export async function analyzeWithAI(
  quizAnswers: QuizAnswer[],
  directorQuestions: QuizQuestion[],
  signal?: AbortSignal,
): Promise<{
  result: QuizResult
  aiAnalysis: AIAnalysis | null
  fromAI: boolean
}> {
  const localResult = runLocal(quizAnswers)

  // 1. 尝试 AI
  try {
    const questionPayload = buildQuestionPayload(quizAnswers, directorQuestions)
    const typesPayload = DBTI_TYPES.map((t) => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      tags: t.tags,
      spiritDirector: t.spiritDirector,
      description: t.description,
      quote: t.quote,
    }))

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionAnswers: questionPayload,
        types: typesPayload,
        localTypeId: localResult.typeCode,
        localTypeName: localResult.type.name,
        dimensionSummary: buildDimensionSummary(
          localResult.dimensions,
          localResult.typeCode ?? localResult.type.id,
        ),
      }),
      signal,
    })

    if (!response.ok) {
      console.warn('AI analysis unavailable, falling back to local')
      return { result: localResult, aiAnalysis: null, fromAI: false }
    }

    const data = (await response.json()) as AIResponse
    if (!data.analysis?.matchReason) {
      return { result: localResult, aiAnalysis: null, fromAI: false }
    }

    // 2. AI 成功 — 类型始终来自本地算法，AI 只提供解读文案
    const analysis = data.analysis

    const aiAnalysis: AIAnalysis = {
      typeId: localResult.typeCode ?? localResult.type.id,
      matchScore: localResult.matchScore,
      matchReason: analysis.matchReason,
      roast: analysis.roast,
      recommendations: analysis.recommendations ?? [],
    }

    return { result: localResult, aiAnalysis, fromAI: true }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err
    }
    console.warn('AI analysis error:', err)
    return { result: localResult, aiAnalysis: null, fromAI: false }
  }
}

/** 本地算法兜底 */
function runLocal(quizAnswers: QuizAnswer[]): QuizResult {
  return analyzeQuiz(
    quizAnswers,
    compareQuestions,
    valueQuestions,
    scenarioQuestions,
    selfCognitionQuestions,
  )
}
