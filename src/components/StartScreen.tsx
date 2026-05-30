import { motion } from 'framer-motion'
import { Film, Sparkles } from 'lucide-react'

interface StartScreenProps {
  onStart: () => void
}

const floatingMasks = [
  { emoji: '🎬', x: '15%', y: '20%', delay: 0 },
  { emoji: '🎥', x: '80%', y: '15%', delay: 0.5 },
  { emoji: '🎞️', x: '85%', y: '75%', delay: 1 },
  { emoji: '🍿', x: '10%', y: '70%', delay: 0.3 },
  { emoji: '⭐', x: '50%', y: '10%', delay: 0.8 },
]

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex flex-col items-center justify-center px-6">
      {/* 背景光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
      </div>

      {/* 浮动 emoji */}
      {floatingMasks.map((item) => (
        <motion.div
          key={item.emoji}
          className="absolute text-3xl opacity-30 pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Film className="w-4 h-4" />
          导演版人格测试
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
          <span className="text-white">DBTI</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-300 to-rose-400">
            .test
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed mb-4">
          10 道题，找到你的导演人格
        </p>

        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed mb-10">
          从张艺谋到诺兰，从库布里克到是枝裕和——<br />
          每一道题都在揭示你的电影品味 DNA。
        </p>

        <motion.button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold text-lg shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-shadow"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
          开始测试
        </motion.button>

        <p className="mt-6 text-xs text-zinc-600">
          约需 3-5 分钟 · 共 10 题
        </p>
      </motion.div>
    </div>
  )
}
