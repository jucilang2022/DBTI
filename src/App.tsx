import { useState, useEffect } from 'react'
import { StartScreen } from '@/components/StartScreen'
import { Quiz } from '@/components/Quiz'
import { Result } from '@/components/Result'
import type { QuizResult, Director } from '@/types'

type Phase = 'loading' | 'start' | 'quiz' | 'result'

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [directors, setDirectors] = useState<Director[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 动态加载导演数据
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

  const handleComplete = (quizResult: QuizResult) => {
    setResult(quizResult)
    setPhase('result')
  }

  const handleRestart = () => {
    setResult(null)
    setPhase('start')
  }

  // 加载中
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

  // 错误
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

  // 数据未就绪
  if (directors.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-zinc-500">暂无导演数据</p>
      </div>
    )
  }

  return (
    <>
      {phase === 'start' && <StartScreen onStart={handleStart} />}
      {phase === 'quiz' && <Quiz directors={directors} onComplete={handleComplete} />}
      {phase === 'result' && result && <Result result={result} onRestart={handleRestart} />}
    </>
  )
}
