import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Film, Brain } from 'lucide-react'
import type { Director, AnswerChoice, QuizQuestion, AIAnalysis, QuizAnswer } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { DirectorCompareCard } from './DirectorCompareCard'
import { ValueCard } from './ValueCard'
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

interface AnalysisPayload {
  answers: QuizAnswer[]
  questions: QuizQuestion[]
}

const ANALYZING_PHRASES = [
  '品味校准中...',
  '分析你的电影DNA...',
  'AI 正在脑补你的形象...',
  '匹配中...',
  'AI 正在写锐评...',
  '生成人格报告...',
]

export function Quiz({ directors, onBack, onComplete }: QuizProps) {
  /* ---- 创建混合题目列表（状态化，支持换题） ---- */
  const [items, setItems] = useState<QuizItem[]>(() => {
    const directorItems: QuizItem[] = pickRandom(directors, DIRECTOR_WORK_COUNT).map((director) => {
      const order: AnswerChoice[] = [
        ...shuffle<AnswerChoice>(['famous', 'controversial', 'hidden']),
        'other',
        'unknown',
      ]
      return { kind: 'director_work' as const, director, order }
    })

    const compareItems: QuizItem[] = pickRandom(allCompareQuestions, DIRECTOR_COMPARE_COUNT).map((q) => ({
      kind: 'director_compare' as const,
      question: q,
    }))

    const valueItems: QuizItem[] = pickRandom(allValueQuestions, VALUE_COUNT).map((q) => ({
      kind: 'value' as const,
      question: q,
    }))

    const scenarioItems: QuizItem[] = pickRandom(allScenarioQuestions, SCENARIO_COUNT).map((q) => ({
      kind: 'scenario' as const,
      question: q,
    }))

    const selfItems: QuizItem[] = pickRandom(allSelfCognitionQuestions, SELF_COUNT).map((q) => ({
      kind: 'self_cognition' as const,
      question: q,
    }))

    return shuffle([
      ...directorItems,
      ...compareItems,
      ...valueItems,
      ...scenarioItems,
      ...selfItems,
    ])
  })

  const questions = useMemo(() => {
    return items
      .filter((item): item is QuizItem & { kind: 'director_work' } => item.kind === 'director_work')
      .map((item) => ({ director: item.director, order: item.order }))
  }, [items])

  /* ---- 追踪已使用/可用导演，用于跳过换题 ---- */
  const poolDirectors = useMemo(() => {
    const usedIds = new Set<string>()
    for (const item of items) {
      if (item.kind === 'director_work') usedIds.add(item.director.id)
    }
    return directors.filter((d) => !usedIds.has(d.id))
  }, [items, directors])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])
  const [analysisPayload, setAnalysisPayload] = useState<AnalysisPayload | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisPhase, setAnalysisPhase] = useState<'loading' | 'ai' | 'done'>('loading')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const analysisPhaseRef = useRef(analysisPhase)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    analysisPhaseRef.current = analysisPhase
  }, [analysisPhase])

  const currentItem = items[currentIndex]

  const handleBack = () => {
    if (quizAnswers.length === 0) {
      onBack()
      return
    }
    const confirmed = window.confirm('确定返回首页吗？当前答题进度将不会保存。')
    if (confirmed) onBack()
  }

  const handleSelect = useCallback(
    (selectedIndex: number) => {
      if (!currentItem) return

      let newAnswer: QuizAnswer

      switch (currentItem.kind) {
        case 'director_work': {
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

      if (newAnswers.length >= TOTAL_QUESTIONS) {
        setQuizAnswers(newAnswers)
        setAnalysisPayload({ answers: newAnswers, questions })
        setIsAnalyzing(true)
      } else {
        setQuizAnswers(newAnswers)
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentItem, quizAnswers, questions],
  )

  const handleDirectorChoice = useCallback(
    (choice: AnswerChoice) => {
      if (currentItem?.kind !== 'director_work') return
      const idx = currentItem.order.indexOf(choice)
      if (idx === -1) return
      handleSelect(idx)
    },
    [currentItem, handleSelect],
  )

  /* ---- 换一道题：从剩余导演池中随机替换当前导演 ---- */
  const handleSkip = useCallback(() => {
    if (currentItem?.kind !== 'director_work') return
    if (poolDirectors.length === 0) return

    const newDirector = poolDirectors[Math.floor(Math.random() * poolDirectors.length)]
    const newOrder: AnswerChoice[] = [
      ...shuffle<AnswerChoice>(['famous', 'controversial', 'hidden']),
      'other',
      'unknown',
    ]

    setItems((prev) => {
      const next = [...prev]
      next[currentIndex] = { kind: 'director_work', director: newDirector, order: newOrder }
      return next
    })
  }, [currentItem, poolDirectors, currentIndex])

  useEffect(() => {
    if (!analysisPayload) return

    let cancelled = false
    const abortController = new AbortController()

    const phraseTimer = setInterval(() => {
      setPhraseIndex((i) => {
        if (analysisPhaseRef.current === 'ai' && i < 4) return 4
        if (analysisPhaseRef.current === 'loading' && i >= 4) return 0
        return (i + 1) % ANALYZING_PHRASES.length
      })
    }, 600)

    let maxWaitTimer: ReturnType<typeof window.setTimeout> | undefined

    const startTimer = window.setTimeout(async () => {
      if (cancelled) return
      setAnalysisPhase('ai')

      maxWaitTimer = window.setTimeout(() => {
        if (!cancelled) setAnalysisPhase('done')
      }, 12000)

      try {
        const { result, aiAnalysis } = await analyzeWithAI(
          analysisPayload.answers,
          analysisPayload.questions,
          abortController.signal,
        )

        if (cancelled) return

        window.clearTimeout(maxWaitTimer)
        setAnalysisPhase('done')

        window.setTimeout(() => {
          if (!cancelled) {
            onCompleteRef.current(result, analysisPayload.questions, analysisPayload.answers, aiAnalysis)
          }
        }, 300)
      } catch {
        // AbortError — effect 已 cleanup，忽略即可
      }
    }, 800)

    return () => {
      cancelled = true
      abortController.abort()
      clearInterval(phraseTimer)
      window.clearTimeout(startTimer)
      if (maxWaitTimer) window.clearTimeout(maxWaitTimer)
    }
  }, [analysisPayload])

  if (!isAnalyzing && currentItem) {
    return (
      <PageShell contentClassName="pt-8 pb-14 sm:pt-12">
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>

        <div className="min-h-[420px] relative">
        <AnimatePresence mode="wait">
          {currentItem.kind === 'director_work' ? (
            <QuestionCard
              key={`d-${currentItem.director.id}`}
              director={currentItem.director}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              order={currentItem.order}
              onSelect={handleDirectorChoice}
              onSkip={handleSkip}
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
            <ValueCard
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
        </div>
      </PageShell>
    )
  }

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
          {analysisPhase === 'loading' ? 'AI 正在思考你的电影人格...' : 'AI 正在生成个性化锐评...'}
        </p>
      </motion.div>
    </PageShell>
  )
}
