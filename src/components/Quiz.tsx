import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Film, Brain } from 'lucide-react'
import type { Director, Answer, AnswerChoice, QuizQuestion } from '@/types'
import { pickRandom, shuffle } from '@/lib/utils'
import { QuestionCard } from './QuestionCard'
import { analyzeWithAI } from '@/api/analyze'
import type { QuizResult } from '@/types'

interface QuizProps {
  directors: Director[]
  onComplete: (result: QuizResult, questions: QuizQuestion[], answers: Answer[], aiAnalysis: unknown) => void
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
  const [analysisPhase, setAnalysisPhase] = useState<'local' | 'ai' | 'done'>('local')
  const analyzingPhrases = useRef([
    '品味校准中...',
    '分析你的电影DNA...',
    'AI 正在脑补你的形象...',
    '匹配中...',
    'AI 正在写锐评...',
    '生成人格报告...',
  ])
  const [phraseIndex, setPhraseIndex] = useState(0)

  const currentQuestion = questions[currentIndex]

  // 分析阶段：切换提示词 + 完成后调 AI
  useEffect(() => {
    if (!isAnalyzing) return

    // 切换提示词
    const timer = setInterval(() => {
      setPhraseIndex((i) => {
        // 进入 AI 阶段后切换另一组词
        if (analysisPhase === 'ai' && i < 4) return 4
        if (analysisPhase === 'local' && i >= 4) return 0
        return (i + 1) % analyzingPhrases.current.length
      })
    }, 600)

    // 先本地分析（显示 1.2s），再 AI 分析（最多 5s）
    const localDone = setTimeout(async () => {
      setAnalysisPhase('ai')

      const aiTimer = setTimeout(async () => {
        const { result, aiAnalysis } = await analyzeWithAI(answers, directors)
        setAnalysisPhase('done')
        // 留 0.5s 展示完成动画
        setTimeout(() => {
          onComplete(result, questions, answers, aiAnalysis)
        }, 500)
      }, 4000) // 最多等 4s AI 响应

      // 如果 AI 超过时间还没回来，用本地结果
      // 但实际上 analyzeWithAI 内部有超时保护
    }, 1200)

    return () => {
      clearInterval(timer)
      clearTimeout(localDone)
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
  const showAIBadge = analysisPhase === 'ai' || analysisPhase === 'done'

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
          {/* AI 阶段额外光圈 */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium mb-4"
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
          {analyzingPhrases.current[phraseIndex % analyzingPhrases.current.length]}
        </motion.p>
        <p className="text-xs text-zinc-600 mt-2">
          {analysisPhase === 'local' ? '本地算法分析中...' : 'AI 正在生成个性化锐评...'}
        </p>
      </motion.div>
    </div>
  )
}
