import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Share2, Download } from 'lucide-react'
import type { DBTIType } from '@/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'
import { drawShareCard } from '@/lib/share-card-draw'
import {
  buildShortCopyText,
  buildShortShareText,
  copyShareText,
  downloadShareCardPng,
  getShareBlockReason,
  isHttpOnlySite,
  shareUnavailableMessage,
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

  const shortCopyInput = useMemo(
    () => ({
      typeName: type.name,
      typeCode,
      tagline: type.tagline,
    }),
    [type.name, type.tagline, typeCode],
  )

  const copyText = useMemo(() => buildShortCopyText(shortCopyInput), [shortCopyInput])
  const shareText = useMemo(() => buildShortShareText(shortCopyInput), [shortCopyInput])

  const httpOnlySite = isHttpOnlySite()

  useEffect(() => {
    if (!open || !canvasRef.current) return
    drawShareCard(canvasRef.current, drawParams)
  }, [open, drawParams])

  useEffect(() => {
    if (!open) return
    setShareHint(httpOnlySite ? shareUnavailableMessage('insecure') : null)
  }, [open, httpOnlySite])

  const handleCopy = async () => {
    const ok = await copyShareText(copyText)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveImage = () => {
    downloadShareCardPng(
      drawParams,
      `DBTI-${type.nameEn.replace(/\s+/g, '-')}.png`,
    )
  }

  const handleShare = async () => {
    setShareHint(null)
    const block = getShareBlockReason()
    if (block) {
      setShareHint(shareUnavailableMessage(block))
      return
    }
    const result = await shareViaSystem(drawParams, shareText)
    if (result === 'shared' || result === 'aborted') return
    if (result === 'insecure' || result === 'unsupported' || result === 'failed') {
      setShareHint(shareUnavailableMessage(result))
    }
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
                  <span className="text-[10px] text-zinc-500">
                    {httpOnlySite ? 'HTTP 站点 · 保存图片或复制' : '系统分享 · 复制短文案'}
                  </span>
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

            {httpOnlySite ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSaveImage}
                    className={cn(buttonClasses.primary, 'w-full px-4 py-3 text-sm')}
                  >
                    <Download className="w-4 h-4" />
                    保存图片
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(buttonClasses.secondary, 'w-full px-4 py-3 text-sm')}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                {shareHint && (
                  <p className="text-[11px] text-amber-400/90 text-center mt-3 leading-relaxed px-1">
                    {shareHint}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-[10px] text-zinc-600 text-center mb-4 leading-relaxed px-1">
                  「分享」调起系统菜单（存相册 / 微信等）·「复制」仅复制短文案
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleShare}
                    className={cn(buttonClasses.primary, 'w-full px-4 py-3 text-sm')}
                  >
                    <Share2 className="w-4 h-4" />
                    分享
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(buttonClasses.secondary, 'w-full px-4 py-3 text-sm')}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                {shareHint && (
                  <p className="text-[11px] text-amber-400/90 text-center mt-3 leading-relaxed">
                    {shareHint}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
