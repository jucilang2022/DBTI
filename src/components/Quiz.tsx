import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Film, Brain } from 'lucide-react'
import type { Director, AnswerChoice, QuizQuestion, AIAnalysis, QuizAnswer } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { DirectorCompareCard } from './DirectorCompareCard'
import { ScenarioCard } from './ScenarioCard'
import { SelfCognitionCard } from './SelfCognitionCard'
import { analyzeWithAI } from '@/api/analyze'
import type { QuizResult } from '@/types'
import { PageShell } from '@/components/ui/layout'
import { valueQuestions as allValueQuestions } from '@/data/value-questions'
import { compareQuestions as allCompareQuestions } from '@/data/director_compare_questions'
import { scenarioQuestions as allScenarioQuestions } from '@/data/scenario_questions'
import { selfCognitionQuestions as allSelfCognitionQuestions } from '@/data/self_cognition_questions'

interface QuizProps {
  directors: Director[]
  onBack: () => void
  onComplete: (result: QuizResult, questions: QuizQuestion[], answers: QuizAnswer[], aiAnalysis: AIAnalysis | null) => void
}

const DIRECTOR_WORK_COUNT = 4
const DIRECTOR_COMPARE_COUNT = 2
const VALUE_COUNT = 3
const SCENARIO_COUNT = 4
const SELF_COUNT = 3
const TOTAL_QUESTIONS = DIRECTOR_WORK_COUNT + DIRECTOR_COMPARE_COUNT + VALUE_COUNT + SCENARIO_COUNT + SELF_COUNT

type QuizItem =
  | { kind: 'director_work'; director: Director; order: AnswerChoice[] }
  | { kind: 'director_compare'; question: typeof allCompareQuestions[number] }
  | { kind: 'value'; question: typeof allValueQuestions[number] }
  | { kind: 'scenario'; question: typeof allScenarioQuestions[number] }
  | { kind: 'self_cognition'; question: typeof allSelfCognitionQuestions[number] }

const ANALYZING_PHRASES = [
  '品味校准中...',
  '分析你的电影DNA...',
  'AI 正在脑补你的形象...',
  '匹配中...',
  'AI 正在写锐评...',
  '生成人格报告...',
]

export function Quiz({ directors, onBack, onComplete }: QuizProps) {
  /* ---- 创建混合题目列表 ---- */
  const items = useMemo(() => {
    // 4 道导演作品题
    const pickedDirectors = pickRandom(directors, DIRECTOR_WORK_COUNT)
    const directorItems: QuizItem[] = pickedDirectors.map((director) => {
      const order: AnswerChoice[] = [
        ...shuffle<AnswerChoice>(['famous', 'controversial', 'hidden']),
        'other',
        'unknown',
      ]
      return { kind: 'director_work' as const, director, order }
    })

    // 2 道导演对比题
    const compareItems: QuizItem[] = pickRandom(allCompareQuestions, DIRECTOR_COMPARE_COUNT).map((q) => ({
      kind: 'director_compare' as const,
      question: q,
    }))

    // 3 道价值观题（从4道中随机选3）
    const valueItems: QuizItem[] = pickRandom(allValueQuestions, VALUE_COUNT).map((q) => ({
      kind: 'value' as const,
      question: q,
    }))

    // 4 道情景题（从7道中随机选4）
    const scenarioItems: QuizItem[] = pickRandom(allScenarioQuestions, SCENARIO_COUNT).map((q) => ({
      kind: 'scenario' as const,
      question: q,
    }))

    // 3 道自我认知题（从5道中随机选3）
    const selfItems: QuizItem[] = pickRandom(allSelfCognitionQuestions, SELF_COUNT).map((q) => ({
      kind: 'self_cognition' as const,
      question: q,
    }))

    // 合并除第一题外的所有题，打乱
    const rest = shuffle([
      ...directorItems.slice(1),
      ...compareItems,
      ...valueItems,
      ...scenarioItems,
      ...selfItems,
    ])

    // 第一题用导演题或价值观题
    const firstItem = directorItems[0]
    return [firstItem, ...rest]
  }, [])

  // 从 items 中提取 questions（导演作品题，给 onComplete 用）
  const questions = useMemo(() => {
    return items
      .filter((item): item is QuizItem & { kind: 'director_work' } => item.kind === 'director_work')
      .map((item) => ({ director: item.director, order: item.order }))
  }, [items])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisPhase, setAnalysisPhase] = useState<'local' | 'ai' | 'done'>('local')
  const [phraseIndex, setPhraseIndex] = useState(0)

  const currentItem = items[currentIndex]

  /* ---- 通用答题处理 ---- */
  const handleSelect = useCallback(
    (selectedIndex: number) => {
      if (!currentItem) return

      let newAnswer: QuizAnswer

      switch (currentItem.kind) {
        case 'director_work': {
          // selectedIndex maps to order array for director_work
          const choice = currentItem.order[selectedIndex]
          newAnswer = {
            questionType: 'director_work',
            questionId: currentItem.director.id,
            selectedIndex,
            directorId: currentItem.director.id,
            choice,
          }
          break
        }
        default:
          newAnswer = {
            questionType: currentItem.kind,
            questionId: currentItem.question.id,
            selectedIndex,
          }
      }

      const newAnswers = [...quizAnswers, newAnswer]
      setQuizAnswers(newAnswers)

      if (newAnswers.length >= TOTAL_QUESTIONS) {
        setIsAnalyzing(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentItem, quizAnswers],
  )

  /* ---- 兼容 QuestionCard 的回调 ---- */
  const handleDirectorChoice = useCallback(
    (choice: AnswerChoice) => {
      if (currentItem?.kind !== 'director_work') return
      const idx = currentItem.order.indexOf(choice)
      if (idx === -1) return
      handleSelect(idx)
    },
    [currentItem, handleSelect],
  )

  /* ---- 分析阶段动画 ---- */
  useEffect(() => {
    if (!isAnalyzing) return

    const timer = setInterval(() => {
      setPhraseIndex((i) => {
        if (analysisPhase === 'ai' && i < 4) return 4
        if (analysisPhase === 'local' && i >= 4) return 0
        return (i + 1) % ANALYZING_PHRASES.length
      })
    }, 600)

    const localDone = setTimeout(async () => {
      setAnalysisPhase('ai')

      setTimeout(async () => {
        const { result, aiAnalysis } = await analyzeWithAI(
          quizAnswers,
          directors,
          allCompareQuestions,
          allValueQuestions,
          allScenarioQuestions,
          allSelfCognitionQuestions,
        )
        setAnalysisPhase('done')
        setTimeout(() => {
          onComplete(result, questions, quizAnswers, aiAnalysis)
        }, 500)
      }, 4000)
    }, 1200)

    return () => {
      clearInterval(timer)
      clearTimeout(localDone)
    }
  }, [isAnalyzing]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- 答题阶段 ---- */
  if (!isAnalyzing && currentItem) {
    return (
      <PageShell contentClassName="pt-8 pb-14 sm:pt-12">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>

        <AnimatePresence mode="wait">
          {currentItem.kind === 'director_work' ? (
            <QuestionCard
              key={`d-${currentItem.director.id}`}
              director={currentItem.director}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              order={currentItem.order}
              onSelect={handleDirectorChoice}
            />
          ) : currentItem.kind === 'director_compare' ? (
            <DirectorCompareCard
              key={`dc-${currentItem.question.id}`}
              question={currentItem.question}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              onSelect={handleSelect}
            />
          ) : currentItem.kind === 'value' ? (
            <ScenarioCard
              key={`v-${currentItem.question.id}`}
              question={currentItem.question}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              onSelect={handleSelect}
            />
          ) : currentItem.kind === 'scenario' ? (
            <ScenarioCard
              key={`sc-${currentItem.question.id}`}
              question={currentItem.question}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              onSelect={handleSelect}
            />
          ) : (
            <SelfCognitionCard
              key={`self-${currentItem.question.id}`}
              question={currentItem.question}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              onSelect={handleSelect}
            />
          )}
        </AnimatePresence>
      </PageShell>
    )
  }

  /* ---- 分析加载页 ---- */
  const showAIBadge = analysisPhase === 'ai' || analysisPhase === 'done'

  return (
    <PageShell centered>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mx-auto mb-8 w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-amber-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
          {showAIBadge && (
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-transparent border-t-emerald-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            {analysisPhase === 'ai' ? (
              <Brain className="w-7 h-7 text-emerald-400" />
            ) : (
              <Film className="w-8 h-8 text-purple-400" />
            )}
          </div>
        </div>

        {showAIBadge && (
          <motion.div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Brain className="w-3 h-3" />
            AI 分析中
          </motion.div>
        )}

        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-lg text-zinc-300 font-medium"
        >
          {ANALYZING_PHRASES[phraseIndex % ANALYZING_PHRASES.length]}
        </motion.p>
        <p className="text-xs text-zinc-600 mt-2">
          {analysisPhase === 'local' ? '本地算法分析中...' : 'AI 正在生成个性化锐评...'}
        </p>
      </motion.div>
    </PageShell>
  )
}
