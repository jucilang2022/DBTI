import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Copy, Download } from 'lucide-react'
import type { DBTIType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'

interface ShareCardProps {
  open: boolean
  onClose: () => void
  type: DBTIType
  matchScore: number
  knownCount: number
  totalQuestions: number
  dimensions?: Record<string, number>
  matchReason?: string
  spiritDirector?: string
}

const DIM_PAIRS = [
  { key: 'P', label: '大众', color: '#f59e0b', pair: 'N', pairLabel: '特色', pairColor: '#a21caf' },
  { key: 'C', label: '经典', color: '#38bdf8', pair: 'G', pairLabel: '邪典', pairColor: '#ef4444' },
  { key: 'O', label: '正统', color: '#34d399', pair: 'A', pairLabel: '独到', pairColor: '#8b5cf6' },
  { key: 'M', label: '核心', color: '#e879f9', pair: 'S', pairLabel: '随性', pairColor: '#6b7280' },
]

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function ShareCard({
  open, onClose, type, matchScore, knownCount, totalQuestions,
  dimensions, matchReason, spiritDirector,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  // 生成分享图片
  useEffect(() => {
    if (!open || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 600
    const h = 520
    canvas.width = w
    canvas.height = h
    const c = type.color

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#0a0a0f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // 装饰光晕
    const glow1 = ctx.createRadialGradient(w * 0.85, h * 0.12, 0, w * 0.85, h * 0.12, 160)
    glow1.addColorStop(0, c + '25')
    glow1.addColorStop(1, 'transparent')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, w, h)

    const glow2 = ctx.createRadialGradient(w * 0.1, h * 0.88, 0, w * 0.1, h * 0.88, 120)
    glow2.addColorStop(0, c + '15')
    glow2.addColorStop(1, 'transparent')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, w, h)

    // 顶部装饰线
    ctx.fillStyle = c
    ctx.fillRect(0, 0, w, 4)

    // ===== 标题 =====
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px system-ui, sans-serif'
    ctx.fillText('🎬 DBTI · 电影人格测试', 30, 42)

    // ===== 类型名 =====
    ctx.fillStyle = c
    ctx.font = 'bold 40px system-ui, sans-serif'
    ctx.fillText(type.name, 30, 105)

    ctx.fillStyle = '#a1a1aa'
    ctx.font = '16px system-ui, sans-serif'
    ctx.fillText(type.nameEn, 30, 130)

    // ===== Tagline =====
    ctx.fillStyle = '#71717a'
    ctx.font = 'italic 13px system-ui, sans-serif'
    const tagline = `「${type.tagline}」`
    ctx.fillText(tagline, 30, 160)

    // ===== 分隔线 =====
    ctx.strokeStyle = c + '30'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(30, 180)
    ctx.lineTo(w - 30, 180)
    ctx.stroke()

    // ===== 四维维度条 =====
    const barStartY = 200
    const barH = 18
    const barGap = 28
    const maxVal = Math.max(
      ...DIM_PAIRS.flatMap((p) => (dimensions?.[p.key] ?? 0) + (dimensions?.[p.pair] ?? 0)),
      4,
    )

    DIM_PAIRS.forEach((pair, i) => {
      const y = barStartY + i * barGap
      const lv = dimensions?.[pair.key] ?? 0
      const rv = dimensions?.[pair.pair] ?? 0
      const lpct = (lv / maxVal) * 100
      const rpct = (rv / maxVal) * 100

      // 左标签
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px system-ui, sans-serif'
      ctx.fillText(pair.label, 30, y + 12)

      // 左条
      drawRoundRect(ctx, 72, y, Math.max(lpct, 2), barH, 4)
      ctx.fillStyle = pair.color
      ctx.fill()

      // 右条
      drawRoundRect(ctx, 530 - Math.max(rpct, 2), y, Math.max(rpct, 2), barH, 4)
      ctx.fillStyle = pair.pairColor
      ctx.fill()

      // 右标签
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(pair.pairLabel, 570, y + 12)
      ctx.textAlign = 'left'
    })

    // ===== 匹配度 + 统计 =====
    const statsY = 320
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px system-ui, sans-serif'
    ctx.fillText(`${matchScore}%`, 30, statsY)
    ctx.fillStyle = '#71717a'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText('置信度', 30, statsY + 16)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px system-ui, sans-serif'
    ctx.fillText(`${knownCount}/${totalQuestions}`, 140, statsY)
    ctx.fillStyle = '#71717a'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText('有效回答', 140, statsY + 16)

    // ===== AI 分析摘要 =====
    if (matchReason) {
      const maxChars = 60
      const snippet = matchReason.length > maxChars ? matchReason.slice(0, maxChars) + '...' : matchReason
      ctx.fillStyle = '#52525b'
      ctx.font = '11px system-ui, sans-serif'
      ctx.fillText('💬 ' + snippet, 30, statsY + 52)
    }

    // ===== 精神导演 =====
    const sd = spiritDirector || type.spiritDirector
    ctx.fillStyle = '#52525b'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText(`✨ 精神导演：${sd}`, 30, statsY + 76)

    // ===== 底部 =====
    ctx.fillStyle = '#3f3f46'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText('dbti.fun · 来测测你的电影人格', 30, h - 20)
  }, [open, type, matchScore, knownCount, totalQuestions, dimensions, matchReason, spiritDirector])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `DBTI-${type.nameEn.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyShareText = async () => {
    const text = [
      '🎬 DBTI · 电影人格测试结果',
      '',
      `🧑‍🎨 类型：${type.name}（${type.nameEn}）`,
      `📝 「${type.tagline}」`,
      `🎯 置信度：${matchScore}%`,
      `🎭 有效回答：${knownCount}/${totalQuestions}`,
      `✨ 精神导演：${spiritDirector || type.spiritDirector}`,
      matchReason ? `💬 ${matchReason}` : '',
      '',
      '🔗 dbti.fun · 来测测你的电影人格',
    ].filter(Boolean).join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
            <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-5">
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                style={{ aspectRatio: '600/520' }}
              />
            </div>

            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadImage} className={cn(buttonClasses.primary, 'w-full px-4 py-3 text-sm')}>
                <Download className="w-4 h-4" />
                保存图片
              </button>
              <button onClick={copyShareText} className={cn(buttonClasses.secondary, 'w-full px-4 py-3 text-sm')}>
                <Copy className="w-4 h-4" />
                {copied ? '已复制 ✓' : '复制文本'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
