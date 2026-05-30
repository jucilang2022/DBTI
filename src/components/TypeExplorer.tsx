import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, Sparkles, Film } from 'lucide-react'
import { DBTI_TYPES } from '@/data/dbti-types'
import { cn } from '@/lib/utils'

interface TypeExplorerProps {
  onBack: () => void
}

export function TypeExplorer({ onBack }: TypeExplorerProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-lg mx-auto px-6 pt-12 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </button>
          <div className="flex items-center gap-2 text-zinc-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">{DBTI_TYPES.length} 种人格</span>
          </div>
        </div>

        <motion.h1
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          DBTI 人格全览
        </motion.h1>
        <motion.p
          className="text-sm text-zinc-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          12 种导演人格，你是哪一种？
        </motion.p>

        {/* 所有类型 */}
        <div className="space-y-3">
          {DBTI_TYPES.map((type, i) => {
            const isOpen = expanded === type.id
            return (
              <motion.div
                key={type.id}
                className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : type.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: type.color + '20', color: type.color }}
                    >
                      {type.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{type.name}</div>
                      <div className="text-[11px] text-zinc-500">{type.nameEn}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        type.rarity === 'legendary' && 'bg-yellow-500/10 text-yellow-300',
                        type.rarity === 'rare' && 'bg-purple-500/10 text-purple-300',
                        type.rarity === 'uncommon' && 'bg-blue-500/10 text-blue-300',
                        type.rarity === 'common' && 'bg-zinc-700/30 text-zinc-400',
                      )}
                    >
                      {type.rarity === 'legendary' && '👑'}
                      {type.rarity === 'rare' && '🏆'}
                      {type.rarity === 'uncommon' && '🔮'}
                      {type.rarity === 'common' && '🌟'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-zinc-500 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-zinc-800 pt-4">
                        <p className="text-lg text-zinc-300 italic text-center">「{type.tagline}」</p>
                        <p className="text-sm text-zinc-300 leading-relaxed">{type.description}</p>

                        <div className="flex items-center gap-2">
                          <Film className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-xs text-zinc-500">精神导演</span>
                        </div>
                        <p className="text-sm text-zinc-300">{type.spiritDirector}</p>

                        <div className="flex flex-wrap gap-1.5">
                          {type.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-full text-[10px] font-medium"
                              style={{
                                backgroundColor: type.color + '15',
                                color: type.color,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-xs text-zinc-500 italic pt-2 border-t border-zinc-800">
                          {type.quote}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
