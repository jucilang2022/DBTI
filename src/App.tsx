import { useState, useEffect } from 'react'
import { StartScreen } from '@/components/StartScreen'
import { Quiz } from '@/components/Quiz'
import { Result } from '@/components/Result'
import { HistoryPage } from '@/components/HistoryPage'
import { TypeExplorer } from '@/components/TypeExplorer'
import type { QuizResult, Director, Answer, QuizQuestion } from '@/types'

type Phase = 'loading' | 'start' | 'quiz' | 'result' | 'history' | 'explore'

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [directors, setDirectors] = useState<Director[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [quizData, setQuizData] = useState<{
    questions: QuizQuestion[]
    answers: Answer[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import('@/data/directors')
      .then((mod) => {
        setDirectors(mod.directors)
        setPhase('start')
      })
      .catch(() => {
        setError('导演数据库加载失败，请刷新重试')
      })
  }, [])

  const handleStart = () => {
    setPhase('quiz')
  }

  const handleHistory = () => {
    setPhase('history')
  }

  const handleExplore = () => {
    setPhase('explore')
  }

  const handleComplete = (
    quizResult: QuizResult,
    questions: QuizQuestion[],
    answers: Answer[],
  ) => {
    setResult(quizResult)
    setQuizData({ questions, answers })
    setPhase('result')
  }

  const handleRestart = () => {
    setResult(null)
    setQuizData(null)
    setPhase('start')
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-500">加载导演数据库...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    )
  }

  if (directors.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-zinc-500">暂无导演数据</p>
      </div>
    )
  }

  return (
    <>
      {phase === 'start' && <StartScreen onStart={handleStart} onHistory={handleHistory} onExplore={handleExplore} />}
      {phase === 'history' && <HistoryPage onBack={() => setPhase('start')} />}
      {phase === 'explore' && <TypeExplorer onBack={() => setPhase('start')} />}
      {phase === 'quiz' && <Quiz directors={directors} onComplete={handleComplete} />}
      {phase === 'result' && result && quizData && (
        <Result
          result={result}
          questions={quizData.questions}
          answers={quizData.answers}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
