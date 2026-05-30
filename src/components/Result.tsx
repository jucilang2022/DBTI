import { motion } from 'framer-motion'
import { Share2, RefreshCw, Sparkles, Film, Eye, Heart } from 'lucide-react'
import type { QuizResult } from '@/types'
import { getRarityLabel } from '@/data/quiz-analyzer'

interface ResultProps {
  result: QuizResult
  onRestart: () => void
}

export function Result({ result, onRestart }: ResultProps) {
  const { type, knownCount, matchScore } = result

  const shareText = `🎬 我的 DBTI 导演人格是：${type.name}（${type.nameEn}）！
「${type.tagline}」
匹配度：${matchScore}%
认识 ${knownCount}/${10} 位导演
来测测你的导演人格 👉`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'DBTI 导演人格测试',
        text: shareText,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* 顶部装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[150px] opacity-20"
          style={{ backgroundColor: type.color }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-15"
          style={{ backgroundColor: type.color }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-16">
        {/* 结果标签 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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

        {/* Tagline */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-lg text-zinc-300 italic">「{type.tagline}」</p>
        </motion.div>

        {/* 稀有度 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span className="text-sm text-zinc-500">
            {getRarityLabel(type.rarity)}
          </span>
        </motion.div>

        {/* 描述 */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">人格解析</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{type.description}</p>
        </motion.div>

        {/* 代表导演 */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Film className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">你的精神导演</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{type.spiritDirector}</p>
        </motion.div>

        {/* 推荐片单 */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
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

        {/* Quote */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <p className="text-xs text-zinc-500 italic leading-relaxed">{type.quote}</p>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{result.matchScore}%</div>
            <div className="text-xs text-zinc-500 mt-1">匹配度</div>
          </div>
          <div className="w-px h-10 bg-zinc-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{knownCount}/10</div>
            <div className="text-xs text-zinc-500 mt-1">认识导演</div>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-4 h-4" />
            分享结果
          </button>

          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重新测试
          </button>
        </motion.div>
      </div>
    </div>
  )
}
