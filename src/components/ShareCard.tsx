import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import type { DBTIType } from '@/types'
import { useEffect, useRef } from 'react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'

interface ShareCardProps {
  open: boolean
  onClose: () => void
  type: DBTIType
  matchScore: number
  knownCount: number
}

export function ShareCard({ open, onClose, type, matchScore, knownCount }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 生成分享图片
  useEffect(() => {
    if (!open || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 600
    const h = 400
    canvas.width = w
    canvas.height = h

    // 背景
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#0a0a0f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // 装饰圆
    ctx.beginPath()
    ctx.arc(w * 0.85, h * 0.15, 120, 0, Math.PI * 2)
    ctx.fillStyle = type.color + '15'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(w * 0.1, h * 0.85, 80, 0, Math.PI * 2)
    ctx.fillStyle = type.color + '10'
    ctx.fill()

    // 标题
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.fillText('🎬 DBTI · 导演人格测试', 30, 50)

    // 分隔线
    ctx.strokeStyle = type.color + '40'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(30, 65)
    ctx.lineTo(w - 30, 65)
    ctx.stroke()

    // 类型名
    ctx.fillStyle = type.color
    ctx.font = 'bold 42px system-ui, sans-serif'
    ctx.fillText(type.name, 30, 140)
    ctx.fillStyle = '#a1a1aa'
    ctx.font = '18px system-ui, sans-serif'
    ctx.fillText(type.nameEn, 30, 175)

    // Tagline
    ctx.fillStyle = '#71717a'
    ctx.font = 'italic 14px system-ui, sans-serif'
    ctx.fillText(`「${type.tagline}」`, 30, 215)

    // 统计
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px system-ui, sans-serif'
    ctx.fillText(`${matchScore}%`, 30, 280)
    ctx.fillStyle = '#71717a'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText('匹配度', 30, 298)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px system-ui, sans-serif'
    ctx.fillText(`${knownCount}/10`, 130, 280)
    ctx.fillStyle = '#71717a'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText('认识导演', 130, 298)

    // 精神导演
    ctx.fillStyle = '#52525b'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText(`✨ 精神导演：${type.spiritDirector}`, 30, 335)

    // 底部
    ctx.fillStyle = '#3f3f46'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText('dbti.test · 测测你的导演人格', 30, 375)
  }, [open, type, matchScore, knownCount])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `DBTI-${type.nameEn.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">分享卡片</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Canvas 预览 */}
            <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-6">
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                style={{ aspectRatio: '3/2' }}
              />
            </div>

            <button
              onClick={downloadImage}
              className={cn(buttonClasses.primary, 'w-full')}
            >
              保存图片
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
