import { useState, useEffect } from 'react'
import { StartScreen } from '@/components/StartScreen'
import { Quiz } from '@/components/Quiz'
import { Result } from '@/components/Result'
import { HistoryPage } from '@/components/HistoryPage'
import { TypeExplorer } from '@/components/TypeExplorer'
import type { QuizResult, Director, Answer, QuizQuestion, AIAnalysis, QuizAnswer } from '@/types'
import { Button, PageShell } from '@/components/ui/layout'

type Phase = 'loading' | 'start' | 'quiz' | 'result' | 'history' | 'explore'

interface StoredResultEntry {
  id: string
  result: QuizResult
  questions: QuizQuestion[]
  answers: Answer[]
  aiAnalysis?: AIAnalysis | null
}

interface QuizDataState {
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  aiAnalysis: AIAnalysis | null
  resultId: string
}

function createResultId(): string {
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function'
        ? Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
        : Math.random().toString(36).slice(2)

  return `${Date.now()}-${uuid}`
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [directors, setDirectors] = useState<Director[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [quizData, setQuizData] = useState<QuizDataState | null>(null)
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
    answers: QuizAnswer[],
    aiAnalysis: AIAnalysis | null,
  ) => {
    setResult(quizResult)
    setQuizData({
      questions,
      answers,
      aiAnalysis,
      resultId: createResultId(),
    })
    setPhase('result')
  }

  const handleRestart = () => {
    setResult(null)
    setQuizData(null)
    setPhase('start')
  }

  const handleSelectHistoryResult = (entry: StoredResultEntry) => {
    // 将 localStorage 中存储的旧 Answer[] 转为 QuizAnswer[]
    const convertedAnswers: QuizAnswer[] = entry.answers.map((a) => ({
      questionType: 'director_work' as const,
      questionId: a.directorId,
      selectedIndex: 0,
      directorId: a.directorId,
      choice: a.choice,
    }))
    setResult(entry.result)
    setQuizData({
      questions: entry.questions,
      answers: convertedAnswers,
      aiAnalysis: entry.aiAnalysis ?? null,
      resultId: entry.id,
    })
    setPhase('result')
  }

  if (phase === 'loading') {
    return (
      <PageShell centered>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-500">加载导演数据库...</p>
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell centered>
        <div className="text-center space-y-5">
          <p className="text-rose-400">{error}</p>
          <Button onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </div>
      </PageShell>
    )
  }

  if (directors.length === 0) {
    return (
      <PageShell centered>
        <p className="text-zinc-500">暂无导演数据</p>
      </PageShell>
    )
  }

  return (
    <>
      {phase === 'start' && <StartScreen onStart={handleStart} onHistory={handleHistory} onExplore={handleExplore} />}
      {phase === 'history' && <HistoryPage onBack={() => setPhase('start')} onSelectResult={handleSelectHistoryResult} />}
      {phase === 'explore' && <TypeExplorer onBack={() => setPhase('start')} />}
      {phase === 'quiz' && <Quiz directors={directors} onBack={() => setPhase('start')} onComplete={handleComplete} />}
      {phase === 'result' && result && quizData && (
        <Result
          result={result}
          questions={quizData.questions}
          answers={quizData.answers}
          aiAnalysis={quizData.aiAnalysis}
          resultId={quizData.resultId}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
