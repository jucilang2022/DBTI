import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Film } from 'lucide-react'
import type { Director, Answer, AnswerChoice, QuizQuestion } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import type { QuizResult } from '@/types'

interface QuizProps {
  directors: Director[]
  onComplete: (result: QuizResult, questions: QuizQuestion[], answers: Answer[]) => void
}

const TOTAL_QUESTIONS = 10

export function Quiz({ directors, onComplete }: QuizProps) {
  const questions = useMemo(() => {
    const picked = pickRandom(directors, TOTAL_QUESTIONS)
    return picked.map((director) => ({
      director,
      order: shuffle<AnswerChoice>(['famous', 'controversial', 'hidden', 'other', 'unknown']),
    }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzingPhrases = useRef([
    '品味校准中...',
    '分析你的电影DNA...',
    '匹配中...',
    '生成人格报告...',
  ])
  const [phraseIndex, setPhraseIndex] = useState(0)

  const currentQuestion = questions[currentIndex]

  // 分析阶段：每 0.6s 切换一次提示词
  useEffect(() => {
    if (!isAnalyzing) return
    const timer = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % analyzingPhrases.current.length)
    }, 600)
    // 1.8s 后完成分析
    const done = setTimeout(() => {
      const result = analyzeQuiz(answers, directors)
      onComplete(result, questions, answers)
    }, 1800)
    return () => {
      clearInterval(timer)
      clearTimeout(done)
    }
  }, [isAnalyzing]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback(
    (choice: AnswerChoice) => {
      const newAnswers = [
        ...answers,
        { directorId: currentQuestion.director.id, choice },
      ]
      setAnswers(newAnswers)

      if (newAnswers.length === TOTAL_QUESTIONS) {
        setIsAnalyzing(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [answers, currentQuestion],
  )

  // 答题阶段
  if (!isAnalyzing && currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center py-12">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.director.id}
            director={currentQuestion.director}
            questionIndex={currentIndex}
            totalQuestions={TOTAL_QUESTIONS}
            order={currentQuestion.order}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      </div>
    )
  }

  // 分析加载页
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mx-auto mb-8 w-24 h-24">
          {/* 旋转光圈 */}
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
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-lg text-zinc-300 font-medium"
        >
          {analyzingPhrases.current[phraseIndex]}
        </motion.p>
        <p className="text-xs text-zinc-600 mt-2">正在分析你的 {TOTAL_QUESTIONS} 个选择...</p>
      </motion.div>
    </div>
  )
}
