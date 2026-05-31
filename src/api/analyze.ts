import type { QuizAnswer, Director, ChoiceQuestion, DirectorCompareQuestion } from '@/types'
import { DBTI_TYPES } from '@/data/dbti-types'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import type { QuizResult, AIAnalysis } from '@/types'

function getChoiceLabel(choice: string): string {
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
    default:
      return choice
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
  answers: QuizAnswer[],
  directors: Director[],
  compareQuestions: DirectorCompareQuestion[],
  valueQuestions: ChoiceQuestion[],
  scenarioQuestions: ChoiceQuestion[],
  selfCognitionQuestions: ChoiceQuestion[],
): Promise<{ result: QuizResult; aiAnalysis: AIAnalysis | null }> {
  // 本地算法兜底
  const localResult = analyzeQuiz(
    answers,
    directors,
    compareQuestions,
    valueQuestions,
    scenarioQuestions,
    selfCognitionQuestions,
  )

  // 为 AI 构建分析数据 - 筛选 director_work 类型的回答
  const answersForAnalysis = answers
    .filter((a) => a.questionType === 'director_work')
    .map((answer, index) => {
      const director = directors.find((item) => item.id === answer.directorId)
      const selectedWork = director && answer.choice
        ? getWorkByChoice(director, answer.choice)
        : null

      return {
        index: index + 1,
        directorId: answer.directorId,
        directorName: director?.name ?? answer.directorId,
        choice: answer.choice ?? 'unknown',
        choiceLabel: getChoiceLabel(answer.choice ?? 'unknown'),
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

  // 为 AI 构建价值观题分析数据
  const valueAnswersForAnalysis = answers
    .filter((a) => a.questionType === 'value')
    .map((answer, index) => {
      const q = valueQuestions.find((vq) => vq.id === answer.questionId)
      const selectedOption = q?.options[answer.selectedIndex]
      return {
        index: index + 1,
        type: '价值观题',
        question: q?.question ?? answer.questionId,
        selectedOption: selectedOption?.text ?? `选项 ${answer.selectedIndex}`,
      }
    })

  // 为 AI 构建情景题和认知题分析数据
  const scenarioCognitionForAnalysis = answers
    .filter((a) => a.questionType === 'scenario' || a.questionType === 'self_cognition')
    .map((answer, index) => {
      const pool = answer.questionType === 'scenario' ? scenarioQuestions : selfCognitionQuestions
      const q = pool.find((sq) => sq.id === answer.questionId)
      const selectedOption = q?.options[answer.selectedIndex]
      return {
        index: index + 1,
        type: answer.questionType === 'scenario' ? '情景题' : '自我认知题',
        question: q?.question ?? answer.questionId,
        selectedOption: selectedOption?.text ?? `选项 ${answer.selectedIndex}`,
      }
    })

  // 为 AI 构建导演对比题分析数据
  const compareForAnalysis = answers
    .filter((a) => a.questionType === 'director_compare')
    .map((answer, index) => {
      const q = compareQuestions.find((cq) => cq.id === answer.questionId)
      const selectedDirector = q?.directors[answer.selectedIndex]
      return {
        index: index + 1,
        type: '导演对比题',
        question: q?.question ?? answer.questionId,
        selectedOption: selectedDirector
          ? `${selectedDirector.name}（${selectedDirector.style}）`
          : `导演 ${answer.selectedIndex}`,
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
        valueAnswers: valueAnswersForAnalysis,
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
          valueQuestionCount: valueAnswersForAnalysis.length,
        },
        // 新增题型数据（供 AI 参考）
        scenarioCognitionAnswers: scenarioCognitionForAnalysis,
        compareAnswers: compareForAnalysis,
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

    const analysis = data.analysis as AIAnalysis

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

function getWorkByChoice(director: Director, choice: string) {
  switch (choice) {
    case 'famous': return director.famousWork
    case 'controversial': return director.controversialWork
    case 'hidden': return director.hiddenGem
    default: return null
  }
}
