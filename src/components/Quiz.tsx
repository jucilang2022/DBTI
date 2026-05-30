import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Director, Answer, AnswerChoice } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { analyzeQuiz } from '@/data/quiz-analyzer'
import type { QuizResult } from '@/types'

interface QuizProps {
  directors: Director[]
  onComplete: (result: QuizResult) => void
}

const TOTAL_QUESTIONS = 10

export function Quiz({ directors, onComplete }: QuizProps) {
  // 从题库中随机抽取 10 位导演（保证不重复）
  const questions = useMemo(() => {
    const picked = pickRandom(directors, TOTAL_QUESTIONS)
    return picked.map((director) => ({
      director,
      order: shuffle<AnswerChoice>(['famous', 'controversial', 'hidden', 'other', 'unknown']),
    }))
    // 只在 mount 时生成一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])


  const currentQuestion = questions[currentIndex]

  const handleSelect = useCallback(
    (choice: AnswerChoice) => {
      const newAnswers = [
        ...answers,
        {
          directorId: currentQuestion.director.id,
          choice,
        },
      ]
      setAnswers(newAnswers)

      if (newAnswers.length === TOTAL_QUESTIONS) {
        // 完成所有题目，触发分析
        const result = analyzeQuiz(newAnswers, directors)
        onComplete(result)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [answers, currentQuestion, directors, onComplete],
  )

  if (!currentQuestion) return null

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
