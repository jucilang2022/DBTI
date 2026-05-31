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

interface AIResponse {
  analysis?: {
    typeId: string
    matchScore: number
    matchReason: string
    roast: string
    recommendations: string[]
  }
}

/**
 * 优先调 AI 判断类型+生成内容，失败则走本地算法兜底。
 *
 * 返回：
 *   result — 最终的结果（AI 或本地）
 *   aiAnalysis — AI 生成的内容（如果有）
 *   fromAI — 结果是否来自 AI
 */
export async function analyzeWithAI(
  quizAnswers: QuizAnswer[],
  directorQuestions: QuizQuestion[],
): Promise<{
  result: QuizResult
  aiAnalysis: AIAnalysis | null
  fromAI: boolean
}> {
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
      }),
    })

    if (!response.ok) {
      console.warn('AI analysis unavailable, falling back to local')
      return { result: runLocal(quizAnswers), aiAnalysis: null, fromAI: false }
    }

    const data = (await response.json()) as AIResponse
    if (!data.analysis?.typeId) {
      return { result: runLocal(quizAnswers), aiAnalysis: null, fromAI: false }
    }

    // 2. AI 成功 — 构造结果
    const analysis = data.analysis
    const matchedType = DBTI_TYPES.find((t) => t.id === analysis.typeId)
    if (!matchedType) {
      return { result: runLocal(quizAnswers), aiAnalysis: null, fromAI: false }
    }

    const localFallback = runLocal(quizAnswers)

    const aiResult: QuizResult = {
      type: matchedType,
      typeCode: analysis.typeId,
      dimensions: localFallback.dimensions,
      choiceCounts: localFallback.choiceCounts,
      favoriteDirector: localFallback.favoriteDirector,
      knownCount: localFallback.knownCount,
      matchScore: Math.min(100, analysis.matchScore ?? localFallback.matchScore),
    }

    const aiAnalysis: AIAnalysis = {
      typeId: analysis.typeId,
      matchScore: aiResult.matchScore,
      matchReason: analysis.matchReason,
      roast: analysis.roast,
      recommendations: analysis.recommendations ?? [],
    }

    return { result: aiResult, aiAnalysis, fromAI: true }
  } catch (err) {
    console.warn('AI analysis error:', err)
    return { result: runLocal(quizAnswers), aiAnalysis: null, fromAI: false }
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
