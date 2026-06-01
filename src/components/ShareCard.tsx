import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Copy, Download, Share2 } from 'lucide-react'
import type { DBTIType } from '@/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'
import { drawShareCard } from '@/lib/share-card-draw'
import {
  buildShareText,
  canUseNativeShare,
  copyShareText,
  downloadShareCardPng,
  shareViaSystem,
} from '@/lib/share-actions'

interface ShareCardProps {
  open: boolean
  onClose: () => void
  type: DBTIType
  matchScore: number
  knownCount: number
  totalQuestions: number
  dimensions?: Record<string, number>
  matchReason?: string
  roast?: string
  spiritDirector?: string
  typeCode?: string
}

export function ShareCard({
  open, onClose, type, matchScore, knownCount, totalQuestions,
  dimensions, matchReason, roast, spiritDirector, typeCode,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [shareHint, setShareHint] = useState<string | null>(null)
  const nativeShare = canUseNativeShare()

  const drawParams = useMemo(
    () => ({
      type,
      matchScore,
      knownCount,
      totalQuestions,
      dimensions,
      matchReason,
      roast,
      spiritDirector,
      typeCode,
    }),
    [
      type, matchScore, knownCount, totalQuestions,
      dimensions, matchReason, roast, spiritDirector, typeCode,
    ],
  )

  const shareText = useMemo(
    () =>
      buildShareText({
        typeName: type.name,
        typeNameEn: type.nameEn,
        typeCode,
        tagline: type.tagline,
        matchScore,
        knownCount,
        totalQuestions,
        spiritDirector: spiritDirector || type.spiritDirector,
        quote: type.quote,
        recommendations: type.recommendations,
        matchReason,
        roast,
      }),
    [
      type, typeCode, matchScore, knownCount, totalQuestions,
      spiritDirector, matchReason, roast,
    ],
  )

  useEffect(() => {
    if (!open || !canvasRef.current) return
    drawShareCard(canvasRef.current, drawParams)
  }, [open, drawParams])

  const downloadImage = () => {
    downloadShareCardPng(
      drawParams,
      `DBTI-${type.nameEn.replace(/\s+/g, '-')}.png`,
    )
  }

  const handleCopy = async () => {
    const ok = await copyShareText(shareText)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSystemShare = async () => {
    setShareHint(null)
    const result = await shareViaSystem(drawParams, shareText)
    if (result === 'shared') return
    if (result === 'aborted') return
    setShareHint('当前环境不支持系统分享，请用保存图片或复制战报')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 px-3 sm:px-4 py-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md min-w-0 rounded-3xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-x-hidden overflow-y-auto"
            style={{ boxShadow: `0 0 60px ${type.color}22` }}
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: type.color + '22' }}
                >
                  <Share2 className="w-4 h-4" style={{ color: type.color }} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">分享战报</span>
                  <span className="text-[10px] text-zinc-500">各浏览器操作统一在此完成</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div
              className="mb-3 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl border relative -mx-0.5 px-0.5"
              style={{ borderColor: type.color + '40' }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-30"
                style={{
                  background: `radial-gradient(ellipse at top right, ${type.color}44, transparent 55%)`,
                }}
              />
              <canvas
                ref={canvasRef}
                className="relative z-0 block h-auto w-full max-w-full"
              />
            </div>
            <p className="text-[10px] text-zinc-600 text-center -mt-1 mb-3">
              预览可上下滑动 · 保存的图片仍为高清完整尺寸
            </p>

            <p className="text-[11px] text-zinc-500 text-center mb-4 leading-relaxed px-1">
              <Sparkles className="w-3 h-3 text-purple-400 inline-block mr-1 -mt-0.5" />
              保存为 3x 高清图；微信 / 微博建议用「保存图片」
            </p>

            <div className={cn('grid gap-3', nativeShare ? 'grid-cols-3' : 'grid-cols-2')}>
              <button onClick={downloadImage} className={cn(buttonClasses.primary, 'w-full px-3 py-3 text-xs sm:text-sm')}>
                <Download className="w-4 h-4" />
                保存图片
              </button>
              <button onClick={handleCopy} className={cn(buttonClasses.secondary, 'w-full px-3 py-3 text-xs sm:text-sm')}>
                <Copy className="w-4 h-4" />
                {copied ? '已复制' : '复制战报'}
              </button>
              {nativeShare && (
                <button
                  onClick={handleSystemShare}
                  className={cn(buttonClasses.secondary, 'w-full px-3 py-3 text-xs sm:text-sm')}
                >
                  <Share2 className="w-4 h-4" />
                  系统分享
                </button>
              )}
            </div>

            {shareHint && (
              <p className="text-[11px] text-amber-400/90 text-center mt-3">{shareHint}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
