import {
  canvasToPngBlob,
  drawShareCard,
  getShareCardPixelRatio,
  type ShareCardDrawParams,
} from '@/lib/share-card-draw'

export type { ShareCardDrawParams as ShareCardContent }

export interface ShortCopyInput {
  typeName: string
  typeCode?: string
  tagline: string
  url?: string
}

/** 复制用：简短口令，适合群聊 */
export function buildShortCopyText(input: ShortCopyInput): string {
  const code = input.typeCode?.trim().toUpperCase()
  const url = input.url ?? (typeof window !== 'undefined' ? window.location.href : 'https://dbti.fun')
  return [
    `我的 DBTI 是「${input.typeName}」${code ? ` ${code}` : ''}`,
    `「${input.tagline}」`,
    `你也来试试 → ${url}`,
  ].join('\n')
}

/** 系统分享附带的短文案（详情在图片里） */
export function buildShortShareText(input: ShortCopyInput): string {
  const code = input.typeCode?.trim().toUpperCase()
  return [
    `我的 DBTI：${input.typeName}${code ? `（${code}）` : ''}`,
    input.tagline,
    '你也来试试 👇',
  ].join('\n')
}

export async function copyShareText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function renderExportCanvas(drawParams: ShareCardDrawParams): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  drawShareCard(canvas, drawParams, { pixelRatio: getShareCardPixelRatio(true) })
  return canvas
}

export function downloadShareCardPng(drawParams: ShareCardDrawParams, filename: string) {
  const canvas = renderExportCanvas(drawParams)
  if (!canvas) return
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

/** 系统分享：优先附带战报 PNG（可保存到相册），文案保持简短 */
export async function shareViaSystem(
  drawParams: ShareCardDrawParams,
  text: string,
  title = 'DBTI 电影人格测试',
): Promise<'shared' | 'aborted' | 'unavailable'> {
  if (!canUseNativeShare()) return 'unavailable'

  const url = typeof window !== 'undefined' ? window.location.href : 'https://dbti.fun'
  const exportCanvas = renderExportCanvas(drawParams)
  const blob = exportCanvas ? await canvasToPngBlob(exportCanvas) : null

  if (blob) {
    const file = new File([blob], `DBTI-${drawParams.type.nameEn.replace(/\s+/g, '-')}.png`, {
      type: 'image/png',
    })
    const withFile = { title, text, url, files: [file] }
    if (navigator.canShare?.(withFile)) {
      try {
        await navigator.share(withFile)
        return 'shared'
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return 'aborted'
      }
    }
  }

  const textOnly = { title, text, url }
  if (navigator.canShare && !navigator.canShare(textOnly)) return 'unavailable'

  try {
    await navigator.share(textOnly)
    return 'shared'
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'aborted'
    return 'unavailable'
  }
}
