import {
  canvasToPngBlob,
  drawShareCard,
  getShareCardPixelRatio,
  type ShareCardDrawParams,
} from '@/lib/share-card-draw'

export type { ShareCardDrawParams as ShareCardContent }

export interface ShareTextInput {
  typeName: string
  typeNameEn: string
  typeCode?: string
  tagline: string
  matchScore: number
  knownCount: number
  totalQuestions: number
  spiritDirector: string
  quote?: string
  recommendations?: string[]
  matchReason?: string
  roast?: string
  url?: string
}

export function buildShareText(input: ShareTextInput): string {
  const code = input.typeCode?.toUpperCase()
  const url = input.url ?? (typeof window !== 'undefined' ? window.location.href : 'https://dbti.fun')
  return [
    '🎬 DBTI · 电影人格战报',
    '',
    `🧑‍🎨 ${input.typeName}（${input.typeNameEn}）${code ? ` · ${code}` : ''}`,
    `📝 「${input.tagline}」`,
    `🎯 置信度 ${input.matchScore}% · 有效作答 ${input.knownCount}/${input.totalQuestions}`,
    `✨ 精神导演：${input.spiritDirector}`,
    input.quote ? `💭 ${input.quote}` : '',
    input.recommendations?.length
      ? `🍿 片单：${input.recommendations.slice(0, 3).join(' · ')}`
      : '',
    input.matchReason ? `🤖 ${input.matchReason}` : '',
    input.roast ? `🔥 ${input.roast}` : '',
    '',
    '🔗 dbti.fun · 来测测你的电影人格',
    url,
  ]
    .filter(Boolean)
    .join('\n')
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

/** 统一系统分享：优先带 PNG，不支持则退回纯文本+链接 */
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
