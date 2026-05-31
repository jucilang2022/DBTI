import type { Answer, Director } from '@/types'
import { DBTI_TYPES } from '@/data/dbti-types'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import type { QuizResult } from '@/types'

interface AIAnalysisResponse {
  typeId: string
  matchScore: number
  matchReason: string
  roast: string
  recommendations: string[]
}

function getChoiceLabel(choice: Answer['choice']): string {
  switch (choice) {
    case 'famous':
      return '代表作'
    case 'controversial':
      return '争议之作'
    case 'hidden':
      return '特色佳作'
    case 'other':
      return '其他作品'
    case 'unknown':
      return '没看过'
  }
}

function getSelectedWork(director: Director, choice: Answer['choice']) {
  switch (choice) {
    case 'famous':
      return director.famousWork
    case 'controversial':
      return director.controversialWork
    case 'hidden':
      return director.hiddenGem
    default:
      return null
  }
}

/**
 * 调用 AI 分析用户答题结果。
 *
 * 1. 先走本地算法得到基础结果
 * 2. 同时尝试调 AI API 获取个性化分析
 * 3. AI 成功则展示个性化文案；类型和四维结果始终以本地算法为准
 */
export async function analyzeWithAI(
  answers: Answer[],
  directors: Director[],
): Promise<{ result: QuizResult; aiAnalysis: AIAnalysisResponse | null }> {
  // 本地算法兜底
  const localResult = analyzeQuiz(answers, directors)
  const answersForAnalysis = answers.map((answer, index) => {
    const director = directors.find((item) => item.id === answer.directorId)
    const selectedWork = director ? getSelectedWork(director, answer.choice) : null

    return {
      index: index + 1,
      directorId: answer.directorId,
      directorName: director?.name ?? answer.directorId,
      choice: answer.choice,
      choiceLabel: getChoiceLabel(answer.choice),
      selectedWork: selectedWork
        ? {
            title: selectedWork.title,
            year: selectedWork.year,
            description: selectedWork.description,
            vibes: selectedWork.vibes,
          }
        : null,
      note:
        answer.choice === 'other'
          ? '用户选择了其他作品，表示有自己的偏好；这不是没看过，也不是某部固定电影。'
          : answer.choice === 'unknown'
            ? '用户选择了没看过任何一部。'
            : undefined,
    }
  })
  const directorsForAnalysis = directors.map((director) => ({
    id: director.id,
    name: director.name,
    nameEn: director.nameEn,
    bio: director.bio,
    color: director.color,
    famousWork: director.famousWork,
    controversialWork: director.controversialWork,
    hiddenGem: director.hiddenGem,
  }))

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: answersForAnalysis,
        directors: directorsForAnalysis,
        types: DBTI_TYPES,
        localResult: {
          typeId: localResult.type.id,
          typeName: localResult.type.name,
          typeCode: localResult.typeCode,
          matchScore: localResult.matchScore,
          dimensions: localResult.dimensions,
          choiceCounts: localResult.choiceCounts,
          knownCount: localResult.knownCount,
        },
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

    if (analysis.typeId !== localResult.type.id) {
      console.warn('AI type mismatch, keeping local result:', {
        localTypeId: localResult.type.id,
        aiTypeId: analysis.typeId,
      })
      return { result: localResult, aiAnalysis: null }
    }

    return { result: localResult, aiAnalysis: analysis }
  } catch (err) {
    console.warn('AI analysis error:', err)
    return { result: localResult, aiAnalysis: null }
  }
}
