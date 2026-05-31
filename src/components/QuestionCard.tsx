import { motion } from 'framer-motion'
import type { Director, AnswerChoice } from '@/types'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  director: Director
  questionIndex: number
  totalQuestions: number
  order: AnswerChoice[]
  onSelect: (choice: AnswerChoice) => void
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

function getOptionEmoji(choice: AnswerChoice): string {
  switch (choice) {
    case 'famous':
      return '⭐'
    case 'controversial':
      return '🎯'
    case 'hidden':
      return '💎'
    case 'other':
      return '🎬'
    case 'unknown':
      return '❓'
  }
}

function getOptionText(director: Director, choice: AnswerChoice): { title: string; description: string } {
  switch (choice) {
    case 'famous':
      return {
        title: `《${director.famousWork.title}》（${director.famousWork.year}）`,
        description: director.famousWork.description,
      }
    case 'controversial':
      return {
        title: `《${director.controversialWork.title}》（${director.controversialWork.year}）`,
        description: director.controversialWork.description,
      }
    case 'hidden':
      return {
        title: `《${director.hiddenGem.title}》（${director.hiddenGem.year}）`,
        description: director.hiddenGem.description,
      }
    case 'other':
      return {
        title: '其他作品',
        description: '对该导演有更喜欢的作品',
      }
    case 'unknown':
      return {
        title: '没看过任何一部',
        description: '对该导演不太熟悉',
      }
  }
}

export function QuestionCard({
  director,
  questionIndex,
  totalQuestions,
  order,
  onSelect,
}: QuestionCardProps) {
  const progress = (questionIndex / totalQuestions) * 100

  return (
    <motion.div
      key={director.id}
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
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            导演作品
          </span>
        </div>
        <h2 className="text-lg font-bold leading-snug text-white mb-5">
          从 {director.name} 的作品中选出你最喜欢的一部？
        </h2>
        <div className="mb-4">
          <p className="text-sm text-zinc-400">{director.nameEn}</p>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">{director.bio}</p>
      </div>

      {/* 选项 */}
      <div className="space-y-5">
        {order.map((choice, idx) => {
          const option = getOptionText(director, choice)

          return (
            <motion.button
              key={choice}
              onClick={() => onSelect(choice)}
              className={cn(
                'w-full text-left px-4 py-3.5 rounded-2xl border-2 shadow-lg shadow-black/10 transition-colors duration-200 group',
                getChoiceColor(choice),
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, type: 'tween', duration: 0.22, ease: 'easeOut' }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold leading-snug text-white">
                  <span className="shrink-0">{getOptionEmoji(choice)}</span>
                  <span>{option.title}</span>
                </div>
                <div className="pl-24 text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                  - {option.description}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
