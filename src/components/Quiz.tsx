import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Film, Brain } from 'lucide-react'
import type { Director, Answer, AnswerChoice, QuizQuestion, AIAnalysis, ValueQuestion, ValueAnswer } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { ValueQuestionCard } from './ValueQuestionCard'
import { analyzeWithAI } from '@/api/analyze'
import type { QuizResult } from '@/types'
import { PageShell } from '@/components/ui/layout'
import { valueQuestions as allValueQuestions } from '@/data/value-questions'

interface QuizProps {
  directors: Director[]
  onBack: () => void
  onComplete: (result: QuizResult, questions: QuizQuestion[], answers: Answer[], aiAnalysis: AIAnalysis | null) => void
}

const DIRECTOR_COUNT = 8
const VALUE_COUNT = allValueQuestions.length
const TOTAL_QUESTIONS = DIRECTOR_COUNT + VALUE_COUNT

type QuizItem =
  | { kind: 'director'; director: Director; order: AnswerChoice[] }
  | { kind: 'value'; question: ValueQuestion }

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
    const picked = pickRandom(directors, DIRECTOR_COUNT)
    const directorItems: QuizItem[] = picked.map((director) => {
      const order: AnswerChoice[] = [
        ...shuffle<AnswerChoice>(['famous', 'controversial', 'hidden']),
        'other',
        'unknown',
      ]
      return { kind: 'director' as const, director, order }
    })
    const valueItems: QuizItem[] = allValueQuestions.map((q) => ({
      kind: 'value' as const,
      question: q,
    }))

    // 合并打乱，但保证第一题是导演题（体验更好）
    const combined = shuffle(directorItems.slice(1).concat(valueItems))
    return [directorItems[0], ...combined]
  }, [])

  // 从 items 中提取 questions（给 onComplete 用）
  const questions = useMemo(() => {
    return items
      .filter((item): item is QuizItem & { kind: 'director' } => item.kind === 'director')
      .map((item) => ({ director: item.director, order: item.order }))
  }, [items])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [directorAnswers, setDirectorAnswers] = useState<Answer[]>([])
  const [valueAnswers, setValueAnswers] = useState<ValueAnswer[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisPhase, setAnalysisPhase] = useState<'local' | 'ai' | 'done'>('local')
  const [phraseIndex, setPhraseIndex] = useState(0)

  const currentItem = items[currentIndex]

  /* ---- 答题处理 ---- */
  const handleDirectorSelect = useCallback(
    (choice: AnswerChoice) => {
      if (currentItem?.kind !== 'director') return
      const newAnswers = [
        ...directorAnswers,
        { directorId: currentItem.director.id, choice },
      ]
      setDirectorAnswers(newAnswers)

      if (newAnswers.length + valueAnswers.length >= TOTAL_QUESTIONS) {
        // 所有题答完
        setIsAnalyzing(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentItem, directorAnswers, valueAnswers],
  )

  const handleValueSelect = useCallback(
    (optionIndex: number) => {
      if (currentItem?.kind !== 'value') return
      const newAnswers = [
        ...valueAnswers,
        { questionId: currentItem.question.id, selectedIndex: optionIndex },
      ]
      setValueAnswers(newAnswers)

      if (directorAnswers.length + newAnswers.length >= TOTAL_QUESTIONS) {
        setIsAnalyzing(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentItem, directorAnswers, valueAnswers],
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
          directorAnswers,
          valueAnswers,
          directors,
          allValueQuestions,
        )
        setAnalysisPhase('done')
        setTimeout(() => {
          onComplete(result, questions, directorAnswers, aiAnalysis)
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
          {currentItem.kind === 'director' ? (
            <QuestionCard
              key={`d-${currentItem.director.id}`}
              director={currentItem.director}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              order={currentItem.order}
              onSelect={handleDirectorSelect}
            />
          ) : (
            <ValueQuestionCard
              key={`v-${currentItem.question.id}`}
              question={currentItem.question}
              questionIndex={currentIndex}
              totalQuestions={TOTAL_QUESTIONS}
              onSelect={handleValueSelect}
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
