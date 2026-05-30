import type { Answer, Director } from '@/types'
import { DBTI_TYPES, TRIGGER_TYPES } from '@/data/dbti-types'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import type { QuizResult } from '@/types'

interface AIAnalysisResponse {
  typeId: string
  matchScore: number
  matchReason: string
  roast: string
  recommendations: string[]
}

/**
 * 调用 AI 分析用户答题结果。
 *
 * 1. 先走本地算法得到基础结果（含触发式人格）
 * 2. 同时尝试调 AI API 获取个性化分析
 * 3. AI 成功则用 AI 结果覆盖；失败则回退到本地结果
 */
export async function analyzeWithAI(
  answers: Answer[],
  directors: Director[],
): Promise<{ result: QuizResult; aiAnalysis: AIAnalysisResponse | null }> {
  // 本地算法兜底
  const localResult = analyzeQuiz(answers, directors)

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        directors,
        types: [...DBTI_TYPES, ...TRIGGER_TYPES],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.warn('AI analysis unavailable:', err.error || err.message)
      return { result: localResult, aiAnalysis: null }
    }

    const data = await response.json()

    if (!data.success || !data.analysis) {
      return { result: localResult, aiAnalysis: null }
    }

    const analysis = data.analysis as AIAnalysisResponse

    // 把 AI 分析结果合并到本地结果中
    const allTypes = [...DBTI_TYPES, ...TRIGGER_TYPES]
    const aiType = allTypes.find((t) => t.id === analysis.typeId)

    if (aiType) {
      return {
        result: {
          ...localResult,
          type: aiType,
          matchScore: analysis.matchScore,
        },
        aiAnalysis: analysis,
      }
    }

    return { result: localResult, aiAnalysis: analysis }
  } catch (err) {
    console.warn('AI analysis error:', err)
    return { result: localResult, aiAnalysis: null }
  }
}
