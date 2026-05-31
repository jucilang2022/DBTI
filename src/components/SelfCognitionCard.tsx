import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChoiceQuestion } from '@/types'

interface SelfCognitionCardProps {
  question: ChoiceQuestion
  questionIndex: number
  totalQuestions: number
  onSelect: (optionIndex: number) => void
}

const OPTION_STYLES = [
  'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/50',
  'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/50',
  'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/50',
  'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50',
  'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-500/50',
]

export function SelfCognitionCard({
  question,
  questionIndex,
  totalQuestions,
  onSelect,
}: SelfCognitionCardProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 题干 */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 mb-4">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            自我认知
          </span>
        </div>
        <h2 className="text-xl font-bold leading-snug text-white">
          {question.question}
        </h2>
      </div>

      {/* 选项 */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelect(idx)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-2xl border-2 shadow-lg shadow-black/10 transition-all duration-200 group',
              OPTION_STYLES[idx % OPTION_STYLES.length],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs font-bold shrink-0 text-zinc-400 group-hover:text-white">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm leading-relaxed text-zinc-200 group-hover:text-white">
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
