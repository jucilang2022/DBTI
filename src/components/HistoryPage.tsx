import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, BarChart3, Trash2, Film, ArrowLeft, ChevronRight } from 'lucide-react'
import { DBTI_TYPES } from '@/data/dbti-types'
import { Card, PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'
import type { AIAnalysis, Answer, QuizQuestion, QuizResult } from '@/types'

interface HistoryEntry {
  id?: string
  typeId: string
  typeName: string
  matchScore: number
  knownCount: number
  timestamp: string
  result?: QuizResult
  questions?: QuizQuestion[]
  answers?: Answer[]
  aiAnalysis?: AIAnalysis | null
}

interface HistoryPageProps {
  onBack: () => void
  onSelectResult: (entry: Required<Pick<HistoryEntry, 'id' | 'result' | 'questions' | 'answers'>> & Pick<HistoryEntry, 'aiAnalysis'>) => void
}

export function HistoryPage({ onBack, onSelectResult }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem('dbti_history')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const clearHistory = () => {
    localStorage.removeItem('dbti_history')
    setHistory([])
  }

  // 统计
  const totalTests = history.length
  const typeCounts: Record<string, number> = {}
  const avgMatches: Record<string, number[]> = {}
  for (const h of history) {
    typeCounts[h.typeId] = (typeCounts[h.typeId] ?? 0) + 1
    if (!avgMatches[h.typeId]) avgMatches[h.typeId] = []
    avgMatches[h.typeId].push(h.matchScore)
  }

  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]
  const topTypeInfo = topType ? DBTI_TYPES.find((t) => t.id === topType[0]) : null

  return (
    <PageShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className={buttonClasses.ghost}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </button>
          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
        </div>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-1"
        >
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-400" />
            我的测试记录
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            共 {totalTests} 次测试
          </p>
        </motion.div>

        {/* 统计摘要 */}
        {totalTests > 0 && (
          <Card
            className="p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-white">数据概览</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-zinc-800/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{totalTests}</div>
                <div className="text-xs text-zinc-500 mt-1">测试次数</div>
              </div>
              <div className="bg-zinc-800/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {topTypeInfo ? (
                    <span style={{ color: topTypeInfo.color }}>{topTypeInfo.name}</span>
                  ) : '—'}
                </div>
                <div className="text-xs text-zinc-500 mt-1">最常出现</div>
              </div>
            </div>

            {/* 类型分布 */}
            <div className="space-y-3">
              {Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([typeId, count], i) => {
                  const info = DBTI_TYPES.find((t) => t.id === typeId)
                  if (!info) return null
                  const pct = (count / totalTests) * 100
                  return (
                    <div key={typeId}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: info.color }} className="font-medium">
                          {info.name}
                        </span>
                        <span className="text-zinc-500">{count} 次</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: info.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </Card>
        )}

        {/* 历史列表 */}
        {history.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Film className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
            <p className="text-zinc-500 text-sm">还没有测试记录</p>
            <p className="text-zinc-600 text-xs mt-1">完成一次 DBTI 测试后会出现在这里</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => {
              const info = DBTI_TYPES.find((t) => t.id === entry.typeId)
              const hasDetail = Boolean(entry.id && entry.result && entry.questions && entry.answers)
              const date = new Date(entry.timestamp)
              const dateStr = date.toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <motion.button
                  key={`${entry.timestamp}-${i}`}
                  onClick={() => {
                    if (hasDetail) {
                      onSelectResult({
                        id: entry.id!,
                        result: entry.result!,
                        questions: entry.questions!,
                        answers: entry.answers!,
                        aiAnalysis: entry.aiAnalysis ?? null,
                      })
                    }
                  }}
                  disabled={!hasDetail}
                  className="w-full bg-zinc-900/60 rounded-2xl border border-zinc-800 p-5 text-left transition-colors enabled:hover:bg-zinc-900 disabled:cursor-default"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-6">
                      <div
                        className="w-16 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold tracking-wider"
                        style={{
                          backgroundColor: (info?.color ?? '#666') + '20',
                          color: info?.color ?? '#666',
                        }}
                      >
                        {entry.typeId}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white">
                          {entry.typeName}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {dateStr} · 认识 {entry.knownCount}/10 位
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-white">{entry.matchScore}%</div>
                      <div className="text-[11px] text-zinc-600 mt-0.5">匹配度</div>
                    </div>
                    {hasDetail && <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />}
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}
