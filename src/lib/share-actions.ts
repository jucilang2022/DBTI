import {
  canvasToPngBlob,
  drawShareCard,
  getShareCardPixelRatio,
  type ShareCardDrawParams,
} from '@/lib/share-card-draw'

export type { ShareCardDrawParams as ShareCardContent }

export type ShareResult = 'shared' | 'aborted' | 'insecure' | 'unsupported' | 'failed'

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

function isShareAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

/**
 * Web Share API 仅在「安全上下文」可用：localhost、HTTPS。
 * 生产环境若是 http:// 域名，会与 localhost 表现不一致。
 */
export function getShareBlockReason(): 'insecure' | 'unsupported' | null {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'unsupported'
  if (typeof navigator.share !== 'function') {
    return window.isSecureContext ? 'unsupported' : 'insecure'
  }
  if (!window.isSecureContext) return 'insecure'
  return null
}

/** @deprecated 请用 getShareBlockReason() */
export function canUseNativeShare(): boolean {
  return getShareBlockReason() === null
}

/** 是否为本地开发（localhost 算安全上下文，与线上 HTTP 不同） */
export function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
}

/** 线上纯 HTTP（如 http://39.107.99.162）无法使用 Web Share API */
export function isHttpOnlySite(): boolean {
  return getShareBlockReason() === 'insecure' && !isLocalDevHost()
}

export function shareUnavailableMessage(reason: 'insecure' | 'unsupported' | 'failed'): string {
  switch (reason) {
    case 'insecure':
      if (isLocalDevHost()) {
        return '当前是 HTTP 访问，系统分享需要 HTTPS（localhost 开发环境除外）。'
      }
      return '当前为 IP/HTTP 访问，浏览器不允许系统分享。请用下方「保存图片」后手动发微信，或配置 HTTPS 域名。'
    case 'unsupported':
      return '当前浏览器不支持系统分享，请用手机 Safari / Chrome 打开，或使用「复制」。'
    case 'failed':
      return '系统分享未成功，可换自带浏览器重试，或使用「复制」。'
  }
}

async function tryShare(data: ShareData): Promise<'shared' | 'aborted' | 'skip'> {
  try {
    await navigator.share(data)
    return 'shared'
  } catch (err) {
    if (isShareAbort(err)) return 'aborted'
    return 'skip'
  }
}

/** 仅调起系统分享（Web Share API），不触发下载 */
export async function shareViaSystem(
  drawParams: ShareCardDrawParams,
  text: string,
  title = 'DBTI 电影人格测试',
): Promise<ShareResult> {
  const block = getShareBlockReason()
  if (block) return block

  const url = typeof window !== 'undefined' ? window.location.href : 'https://dbti.fun'

  const blob = await (async () => {
    try {
      const exportCanvas = renderExportCanvas(drawParams)
      return exportCanvas ? await canvasToPngBlob(exportCanvas) : null
    } catch {
      return null
    }
  })()

  if (blob) {
    const file = new File([blob], `DBTI-${drawParams.type.nameEn.replace(/\s+/g, '-')}.png`, {
      type: 'image/png',
    })
    const fileAttempts: ShareData[] = [
      { files: [file], title, text, url },
      { files: [file], title, text },
      { files: [file] },
    ]
    for (const data of fileAttempts) {
      const r = await tryShare(data)
      if (r === 'shared' || r === 'aborted') return r
    }
  }

  const textAttempts: ShareData[] = [
    { title, text, url },
    { title, text: `${text}\n${url}` },
    { text: `${text}\n${url}` },
    { url, title },
  ]
  for (const data of textAttempts) {
    const r = await tryShare(data)
    if (r === 'shared' || r === 'aborted') return r
  }

  return 'failed'
}
