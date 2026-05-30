import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import type { Director, AnswerChoice } from '@/types'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  director: Director
  questionIndex: number
  totalQuestions: number
  order: AnswerChoice[]
  onSelect: (choice: AnswerChoice) => void
}

const OPTION_LABELS: Record<AnswerChoice, { label: string; icon: string }> = {
  famous: { label: '代表作', icon: '⭐' },
  controversial: { label: '争议之作', icon: '🔥' },
  hidden: { label: '小众佳作', icon: '💎' },
  other: { label: '其他作品', icon: '🎬' },
  unknown: { label: '没看过任何一部', icon: '❓' },
}

function getChoiceColor(choice: AnswerChoice): string {
  switch (choice) {
    case 'famous':
      return 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/50'
    case 'controversial':
      return 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/50'
    case 'hidden':
      return 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/50'
    case 'other':
      return 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-500/50'
    case 'unknown':
      return 'border-zinc-600/30 bg-zinc-800/5 hover:bg-zinc-800/20 hover:border-zinc-500/50'
  }
}

export function QuestionCard({
  director,
  questionIndex,
  totalQuestions,
  order,
  onSelect,
}: QuestionCardProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <motion.div
      key={director.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
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

      {/* 导演卡片 */}
      <div className="mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
          style={{ backgroundColor: director.color + '20' }}
        >
          <span style={{ color: director.color }}>
            {director.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{director.name}</h2>
        <p className="text-sm text-zinc-400">{director.nameEn}</p>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{director.bio}</p>
      </div>

      {/* 选项 */}
      <div className="space-y-2.5">
        {order.map((choice, idx) => {
          const opt = OPTION_LABELS[choice]
          const work =
            choice === 'famous'
              ? director.famousWork
              : choice === 'controversial'
                ? director.controversialWork
                : choice === 'hidden'
                  ? director.hiddenGem
                  : choice === 'other'
                    ? director.otherWork
                    : null

          return (
            <motion.button
              key={choice}
              onClick={() => onSelect(choice)}
              className={cn(
                'w-full text-left p-4 rounded-2xl border transition-all duration-200 group',
                getChoiceColor(choice),
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">{opt.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white mb-0.5">
                    {opt.label}
                  </div>
                  {work ? (
                    <div className="text-xs text-zinc-400">
                      《{work.title}》（{work.year}）— {work.description}
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500">这部电影不太熟悉</div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
