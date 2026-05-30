import { motion } from 'framer-motion'

interface TasteBarProps {
  dimensions: Record<string, number>
}

const VIBE_LABELS: Record<string, { label: string; color: string }> = {
  诗意: { label: '诗意', color: '#e879f9' },
  唯美: { label: '唯美', color: '#f0abfc' },
  文艺: { label: '文艺', color: '#c084fc' },
  叙事: { label: '叙事', color: '#38bdf8' },
  结构: { label: '结构', color: '#22d3ee' },
  情节: { label: '情节', color: '#2dd4bf' },
  视觉: { label: '视觉', color: '#fbbf24' },
  镜头: { label: '镜头', color: '#f59e0b' },
  构图: { label: '构图', color: '#d97706' },
  现实: { label: '现实', color: '#a8a29e' },
  社会: { label: '社会', color: '#78716c' },
  记录: { label: '记录', color: '#737373' },
  情感: { label: '情感', color: '#fb7185' },
  温情: { label: '温情', color: '#fda4af' },
  共鸣: { label: '共鸣', color: '#f43f5e' },
  商业: { label: '商业', color: '#34d399' },
  大众: { label: '大众', color: '#4ade80' },
  类型: { label: '类型', color: '#22c55e' },
  娱乐: { label: '娱乐', color: '#a3e635' },
  动作: { label: '动作', color: '#f97316' },
  悬疑: { label: '悬疑', color: '#64748b' },
  科幻: { label: '科幻', color: '#06b6d4' },
  心理: { label: '心理', color: '#8b5cf6' },
  戏剧: { label: '戏剧', color: '#a855f7' },
  史诗: { label: '史诗', color: '#d946ef' },
  古典: { label: '古典', color: '#b45309' },
  传统: { label: '传统', color: '#92400e' },
  大师: { label: '大师', color: '#fcd34d' },
  反叛: { label: '反叛', color: '#ef4444' },
  突破: { label: '突破', color: '#dc2626' },
  颠覆: { label: '颠覆', color: '#b91c1c' },
  荒诞: { label: '荒诞', color: '#7c3aed' },
  黑色: { label: '黑色', color: '#3f3f46' },
  讽刺: { label: '讽刺', color: '#881337' },
  暴力: { label: '暴力', color: '#9f1239' },
  小众: { label: '小众', color: '#a21caf' },
  冷门: { label: '冷门', color: '#6b21a8' },
  遗珠: { label: '遗珠', color: '#86198f' },
  浪漫: { label: '浪漫', color: '#f472b6' },
  幽默: { label: '幽默', color: '#fde047' },
}

export function TasteBar({ dimensions }: TasteBarProps) {
  const entries = Object.entries(dimensions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  if (entries.length === 0) return null

  const maxCount = Math.max(...entries.map(([, c]) => c), 1)

  return (
    <div className="space-y-2.5">
      {entries.map(([vibe, count], i) => {
        const meta = VIBE_LABELS[vibe] ?? { label: vibe, color: '#a8a29e' }
        const pct = (count / maxCount) * 100
        return (
          <div key={vibe}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-400">{meta.label}</span>
              <span className="text-xs text-zinc-600">{count}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: meta.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
