import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, RefreshCw, Sparkles, Film, Eye, Heart,
  ChevronDown, Star, Flame, Gem, Clapperboard, HelpCircle,
} from 'lucide-react'
import type { QuizResult, Answer, QuizQuestion, AnswerChoice } from '@/types'
import { getRarityLabel } from '@/data/quiz-analyzer'
import { cn } from '@/lib/utils'

interface ResultProps {
  result: QuizResult
  questions: QuizQuestion[]
  answers: Answer[]
  onRestart: () => void
}

const CHOICE_META: Record<AnswerChoice, { label: string; icon: React.ReactNode; color: string }> = {
  famous: { label: '代表作', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  controversial: { label: '争议之作', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-rose-400' },
  hidden: { label: '小众佳作', icon: <Gem className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  other: { label: '其他作品', icon: <Clapperboard className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  unknown: { label: '没看过', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-zinc-500' },
}

function getWorkByChoice(q: QuizQuestion, choice: AnswerChoice) {
  switch (choice) {
    case 'famous': return q.director.famousWork
    case 'controversial': return q.director.controversialWork
    case 'hidden': return q.director.hiddenGem
    case 'other': return q.director.otherWork
    default: return null
  }
}

export function Result({ result, questions, answers, onRestart }: ResultProps) {
  const { type, knownCount, matchScore } = result
  const [showReview, setShowReview] = useState(false)

  const renderShareCard = () => {
    const lines = [
      '🎬 DBTI 导演人格测试结果',
      '',
      `🧑‍🎨 你的类型：${type.name}（${type.nameEn}）`,
      `📝 「${type.tagline}」`,
      `🎯 匹配度：${matchScore}%`,
      `🎭 认识 ${knownCount}/10 位导演`,
      '',
      `✨ 精神导演：${type.spiritDirector}`,
      '',
      '来测测你的导演人格 👇',
      window.location.href,
    ]
    return lines.join('\n')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'DBTI 导演人格测试',
        text: renderShareCard(),
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(renderShareCard())
    }
  }

  const answerPairs: { q: QuizQuestion; a: Answer }[] = questions.map((q, i) => ({
    q,
    a: answers[i],
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* 背景光晕 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[150px] opacity-20"
          style={{ backgroundColor: type.color }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-15"
          style={{ backgroundColor: type.color }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-24">
        {/* === 主标题 === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6"
            style={{
              backgroundColor: type.color + '15',
              borderColor: type.color + '30',
              color: type.color,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
            你的 DBTI 是
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span style={{ color: type.color }}>{type.name}</span>
          </motion.h1>

          <motion.p
            className="text-lg text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {type.nameEn}
          </motion.p>
        </motion.div>

        {/* === Tagline + 稀有度 === */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-lg text-zinc-300 italic mb-3">「{type.tagline}」</p>
          <span className="text-sm text-zinc-500">{getRarityLabel(type.rarity)}</span>
        </motion.div>

        {/* === 人格解析 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">人格解析</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{type.description}</p>
        </motion.div>

        {/* === 精神导演 + 推荐片单（合并） === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Film className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">你的精神导演</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{type.spiritDirector}</p>

          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">推荐片单</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {type.recommendations.map((rec) => (
              <span
                key={rec}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: type.color + '15',
                  color: type.color,
                  borderColor: type.color + '25',
                  borderWidth: 1,
                }}
              >
                {rec}
              </span>
            ))}
          </div>
        </motion.div>

        {/* === Quote === */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-xs text-zinc-500 italic leading-relaxed">{type.quote}</p>
        </motion.div>

        {/* === 统计 === */}
        <motion.div
          className="flex items-center justify-center gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{result.matchScore}%</div>
            <div className="text-xs text-zinc-500 mt-1">匹配度</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{knownCount}/10</div>
            <div className="text-xs text-zinc-500 mt-1">认识导演</div>
          </div>
        </motion.div>

        {/* === 答案回顾（折叠） === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-white">回顾你的选择</span>
              <span className="text-xs text-zinc-500 ml-1">({knownCount} 位认识)</span>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-zinc-400 transition-transform duration-300',
                showReview && 'rotate-180',
              )}
            />
          </button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3 border-t border-zinc-800 pt-4">
                  {answerPairs.map(({ q, a }) => {
                    const meta = CHOICE_META[a.choice]
                    const work = getWorkByChoice(q, a.choice)
                    return (
                      <div
                        key={q.director.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: q.director.color + '20', color: q.director.color }}
                        >
                          {q.director.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">
                              {q.director.name}
                            </span>
                            <span className={cn('text-xs flex items-center gap-1 shrink-0', meta.color)}>
                              {meta.icon}
                              {meta.label}
                            </span>
                          </div>
                          {work && (
                            <div className="text-xs text-zinc-500 mt-0.5 truncate">
                              《{work.title}》（{work.year}）
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === 分享结果 === */}
        <motion.button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <Share2 className="w-4 h-4" />
          分享结果
        </motion.button>

        {/* === 重新测试 === */}
        <motion.button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
        >
          <RefreshCw className="w-4 h-4" />
          重新测试
        </motion.button>
      </div>
    </div>
  )
}
