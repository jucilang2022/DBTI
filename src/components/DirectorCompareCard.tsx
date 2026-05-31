import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import type { DirectorCompareQuestion } from '@/types'

interface DirectorCompareCardProps {
  question: DirectorCompareQuestion
  questionIndex: number
  totalQuestions: number
  onSelect: (selectedIndex: number) => void
}

const CARD_COLORS = [
  'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/50',
  'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/50',
  'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50',
  'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/50',
]

const AVATAR_COLORS = [
  'bg-amber-500/20 text-amber-400',
  'bg-purple-500/20 text-purple-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-rose-500/20 text-rose-400',
]

export function DirectorCompareCard({
  question,
  questionIndex,
  totalQuestions,
  onSelect,
}: DirectorCompareCardProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-zinc-500 font-medium">
            第 {questionIndex + 1} / {totalQuestions} 题
          </span>
          <span className="text-xs text-zinc-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 题干 */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 mb-4">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            导演对比
          </span>
        </div>
        <h2 className="text-xl font-bold leading-snug text-white">
          {question.question}
        </h2>
      </div>

      {/* 导演卡片选项 */}
      <div className="grid grid-cols-1 gap-3">
        {question.directors.map((director, idx) => (
          <motion.button
            key={director.id}
            onClick={() => onSelect(idx)}
            className={`w-full text-left px-5 py-4 rounded-2xl border-2 shadow-lg shadow-black/10 transition-all duration-200 group ${CARD_COLORS[idx]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[idx]}`}
              >
                {director.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white leading-tight">
                  {director.name}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {director.nameEn}
                </div>
                <div className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  {director.style}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
