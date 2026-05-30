import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Flame, Gem, Clapperboard, Film } from 'lucide-react'
import type { Director } from '@/types'

interface DirectorDetailProps {
  director: Director | null
  onClose: () => void
}

export function DirectorDetail({ director, onClose }: DirectorDetailProps) {
  if (!director) return null

  const works = [
    { key: '代表作', icon: <Star className="w-4 h-4" />, work: director.famousWork, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: '争议之作', icon: <Flame className="w-4 h-4" />, work: director.controversialWork, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { key: '小众佳作', icon: <Gem className="w-4 h-4" />, work: director.hiddenGem, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: '其他作品', icon: <Clapperboard className="w-4 h-4" />, work: director.otherWork, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <AnimatePresence>
      {director && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 px-0 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900 z-10 flex items-center justify-between p-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                  style={{ backgroundColor: director.color + '20', color: director.color }}
                >
                  {director.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{director.name}</div>
                  <div className="text-xs text-zinc-500">{director.nameEn}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Bio */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">简介</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{director.bio}</p>
              </div>

              {/* Works */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clapperboard className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">代表作</span>
                </div>
                <div className="space-y-3">
                  {works.map(({ key, icon, work, color, bg }) => (
                    <div key={key} className={`${bg} rounded-xl p-4 border border-transparent`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={color}>{icon}</span>
                        <span className={`text-xs font-semibold ${color}`}>{key}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        《{work.title}》（{work.year}）
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{work.description}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {work.vibes.map((v) => (
                          <span
                            key={v}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
