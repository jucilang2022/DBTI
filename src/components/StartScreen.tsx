import { motion } from 'framer-motion'
import { Film, Sparkles, Clock, Book } from 'lucide-react'
import { PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'

interface StartScreenProps {
  onStart: () => void
  onHistory: () => void
  onExplore: () => void
}

const floatingMasks = [
  { emoji: '🎬', x: '15%', y: '20%', delay: 0 },
  { emoji: '🎥', x: '80%', y: '15%', delay: 0.5 },
  { emoji: '🎞️', x: '85%', y: '75%', delay: 1 },
  { emoji: '🍿', x: '10%', y: '70%', delay: 0.3 },
  { emoji: '⭐', x: '50%', y: '10%', delay: 0.8 },
]

export function StartScreen({ onStart, onHistory, onExplore }: StartScreenProps) {
  return (
    <PageShell
      centered
      overflowHidden
      className="relative"
      contentClassName="py-16"
      background={
        <>
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
        </>
      }
    >

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="space-y-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Film className="w-4 h-4" />
            导演版人格测试
          </motion.div>

          <div className="space-y-5">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-300 to-rose-400">
                DBTI
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
                10 道题，找到你的导演人格
              </p>

              <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                有些电影你一眼认出，有些导演你还没遇见。<br />
                你的选择，慢慢拼出一份专属于你的画像。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <motion.button
            onClick={onStart}
            className={cn(buttonClasses.primary, 'group relative px-9 py-3.5 text-base hover:shadow-purple-900/50')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            开始测试
          </motion.button>

          <p className="text-xs text-zinc-600">
            约需 1 分钟 · 共 10 题
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <motion.button
            onClick={onHistory}
            className={cn(buttonClasses.secondary, 'px-5 py-3 text-xs text-zinc-500 hover:text-zinc-300')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock className="w-3.5 h-3.5" />
            历史记录
          </motion.button>

          <motion.button
            onClick={onExplore}
            className={cn(buttonClasses.secondary, 'px-5 py-3 text-xs text-zinc-500 hover:text-zinc-300')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Book className="w-3.5 h-3.5" />
            全部人格
          </motion.button>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-zinc-700">
          注：数据仅保存在本地浏览器，不上传云端；结果仅供娱乐参考。
        </p>
      </motion.div>
    </PageShell>
  )
}
