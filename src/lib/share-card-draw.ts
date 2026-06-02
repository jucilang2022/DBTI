import type { DBTIType } from '@/types'

export const SHARE_CARD_WIDTH = 600
/** 预览用默认比例；实际导出高度按内容计算 */
export const SHARE_CARD_HEIGHT = 800
const MIN_CARD_HEIGHT = 640
const TAGLINE_LINE_HEIGHT = 17
/** 字母芯片行底边（相对主卡面板顶部，y+86+28） */
const HERO_CHIP_ROW_BOTTOM = 114
/** tagline 与 NCAS、人格标签之间的等距留白 */
const HERO_TAGLINE_GAP = 16
const TAGLINE_BASELINE_OFFSET = 12
const TAG_CHIP_HEIGHT = 22
const SPIRIT_CHIP_HEIGHT = 22
const SPIRIT_BOTTOM_PAD = 16
/** 精神导演框 → 底栏文案 → 图片底边 */
const FOOTER_GAP_AFTER_SPIRIT = 12
const FOOTER_INNER_HEIGHT = 30
const IMAGE_BOTTOM_PAD = 12

/** 预览 2x起，导出 3x起，适配 Retina 避免模糊 */
export function getShareCardPixelRatio(forExport = false): number {
  if (typeof window === 'undefined') return forExport ? 3 : 2
  const dpr = window.devicePixelRatio || 1
  const floor = forExport ? 3 : 2
  return Math.min(3, Math.max(floor, Math.round(dpr)))
}

export interface DrawShareCardOptions {
  pixelRatio?: number
}

export interface ShareCardDrawParams {
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

/** 得分键为小写（与 quiz-analyzer 的 dimensions 一致）；letter 用于展示 */
const DIM_PAIRS = [
  { key: 'p', letter: 'P', label: '大众', color: '#f59e0b', pair: 'n', pairLetter: 'N', pairLabel: '特色', pairColor: '#a21caf' },
  { key: 'c', letter: 'C', label: '经典', color: '#38bdf8', pair: 'g', pairLetter: 'G', pairLabel: '邪典', pairColor: '#ef4444' },
  { key: 'o', letter: 'O', label: '正统', color: '#34d399', pair: 'a', pairLetter: 'A', pairLabel: '独到', pairColor: '#8b5cf6' },
  { key: 'm', letter: 'M', label: '核心', color: '#e879f9', pair: 's', pairLetter: 'S', pairLabel: '随性', pairColor: '#6b7280' },
] as const

const RARITY_META: Record<
  DBTIType['rarity'],
  { emoji: string; label: string; accent: string }
> = {
  common: { emoji: '🌟', label: '街访常见款', accent: '#a1a1aa' },
  uncommon: { emoji: '🔮', label: '有点品味款', accent: '#38bdf8' },
  rare: { emoji: '🏆', label: '影迷稀有款', accent: '#a78bfa' },
  legendary: { emoji: '👑', label: '传说级人格', accent: '#fbbf24' },
}

const PAD = 22

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.lineTo(x + w - rad, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad)
  ctx.lineTo(x + w, y + h - rad)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  ctx.lineTo(x + rad, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad)
  ctx.lineTo(x, y + rad)
  ctx.quadraticCurveTo(x, y, x + rad, y)
  ctx.closePath()
}

/** 中日文按字换行 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const char of text) {
    const next = line + char
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = char
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight))
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  stroke: string,
) {
  roundRect(ctx, x, y, w, h, 14)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: { bg: string; color: string; font?: string; padX?: number; padY?: number },
): number {
  const padX = opts.padX ?? 10
  const padY = opts.padY ?? 5
  ctx.font = opts.font ?? '600 11px system-ui, sans-serif'
  const tw = ctx.measureText(text).width
  const cw = tw + padX * 2
  const ch = 22
  roundRect(ctx, x, y, cw, ch, 11)
  ctx.fillStyle = opts.bg
  ctx.fill()
  ctx.fillStyle = opts.color
  ctx.fillText(text, x + padX, y + padY + 11)
  return cw
}

function drawFilmPerforations(ctx: CanvasRenderingContext2D, w: number, y: number, accent: string) {
  const count = 14
  const gap = (w - PAD * 2) / (count - 1)
  for (let i = 0; i < count; i++) {
    const cx = PAD + i * gap
    roundRect(ctx, cx - 5, y, 10, 8, 2)
    ctx.fillStyle = i % 2 === 0 ? accent + '55' : '#3f3f46'
    ctx.fill()
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string) {
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#14141f')
  bg.addColorStop(0.45, '#0f0f18')
  bg.addColorStop(1, '#08080c')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = accent + '12'
  ctx.lineWidth = 1
  for (let i = 0; i < w; i += 28) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 80, h)
    ctx.stroke()
  }

  const g1 = ctx.createRadialGradient(w * 0.9, h * 0.08, 0, w * 0.9, h * 0.08, 200)
  g1.addColorStop(0, accent + '28')
  g1.addColorStop(1, 'transparent')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, w, h)

  const g2 = ctx.createRadialGradient(w * 0.05, h * 0.98, 0, w * 0.05, h * 0.98, 120)
  g2.addColorStop(0, accent + '12')
  g2.addColorStop(1, 'transparent')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, 3)
}

function measureHeroHeight(ctx: CanvasRenderingContext2D, type: DBTIType): number {
  const innerW = SHARE_CARD_WIDTH - PAD * 2
  ctx.font = 'italic 12px system-ui, sans-serif'
  const tagLineCount = Math.min(wrapText(ctx, `「${type.tagline}」`, innerW - 28).length, 2)
  const tagsBlock = type.tags.length > 0 ? TAG_CHIP_HEIGHT : 0
  return (
    HERO_CHIP_ROW_BOTTOM +
    HERO_TAGLINE_GAP +
    TAGLINE_BASELINE_OFFSET +
    tagLineCount * TAGLINE_LINE_HEIGHT +
    HERO_TAGLINE_GAP +
    tagsBlock +
    16
  )
}

function measureSpiritHeight(
  ctx: CanvasRenderingContext2D,
  type: DBTIType,
  spiritDirector?: string,
): number {
  const innerW = SHARE_CARD_WIDTH - PAD * 2
  ctx.font = '600 12px system-ui, sans-serif'
  const sd = spiritDirector || type.spiritDirector
  const sdLineCount = Math.min(wrapText(ctx, sd, innerW - 28).length, 2)
  return 40 + sdLineCount * 16 + 12 + 10 + SPIRIT_CHIP_HEIGHT + SPIRIT_BOTTOM_PAD
}

function drawHero(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { type, typeCode } = params
  const c = type.color
  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const panelH = measureHeroHeight(ctx, type)

  drawPanel(ctx, PAD, y, innerW, panelH, c + '12', c + '35')

  const code = (typeCode || type.id).toUpperCase()
  ctx.save()
  ctx.font = '900 96px system-ui, sans-serif'
  ctx.fillStyle = c + '10'
  ctx.textAlign = 'right'
  ctx.fillText(code.slice(0, 4), w - PAD - 8, y + Math.min(panelH - 24, 130))
  ctx.restore()

  const rarity = RARITY_META[type.rarity]
  const badgeText = `${rarity.emoji} ${rarity.label}`
  ctx.font = '600 11px system-ui, sans-serif'
  const badgeW = ctx.measureText(badgeText).width + 20
  roundRect(ctx, w - PAD - 12 - badgeW, y + 12, badgeW, 24, 12)
  ctx.fillStyle = rarity.accent + '22'
  ctx.fill()
  ctx.strokeStyle = rarity.accent + '55'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = rarity.accent
  ctx.fillText(badgeText, w - PAD - 12 - badgeW + 10, y + 29)

  ctx.fillStyle = c
  ctx.font = 'bold 34px system-ui, sans-serif'
  ctx.fillText(type.name, PAD + 14, y + 52)

  ctx.fillStyle = '#d4d4d8'
  ctx.font = '600 13px system-ui, sans-serif'
  ctx.fillText(type.nameEn, PAD + 14, y + 74)

  if (code.length === 4) {
    const chipY = y + 86
    const chipGap = 6
    let chipX = PAD + 14
    for (let i = 0; i < 4; i++) {
      const letter = code[i]
      const pair = DIM_PAIRS[i]
      const isLeft = letter === pair.letter
      const chipColor = isLeft ? pair.color : pair.pairColor
      roundRect(ctx, chipX, chipY, 36, 28, 8)
      ctx.fillStyle = chipColor + '30'
      ctx.fill()
      ctx.strokeStyle = chipColor + '80'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = chipColor
      ctx.font = 'bold 16px ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(letter, chipX + 18, chipY + 20)
      ctx.textAlign = 'left'
      chipX += 36 + chipGap
    }
  }

  ctx.fillStyle = '#a1a1aa'
  ctx.font = 'italic 12px system-ui, sans-serif'
  const tagLines = wrapText(ctx, `「${type.tagline}」`, innerW - 28).slice(0, 2)
  const taglineY = y + HERO_CHIP_ROW_BOTTOM + HERO_TAGLINE_GAP + TAGLINE_BASELINE_OFFSET
  drawLines(ctx, tagLines, PAD + 14, taglineY, TAGLINE_LINE_HEIGHT)

  if (type.tags.length > 0) {
    let tx = PAD + 14
    const tagsY = taglineY + tagLines.length * TAGLINE_LINE_HEIGHT + HERO_TAGLINE_GAP - 4
    for (const tag of type.tags.slice(0, 4)) {
      const chipW = drawChip(ctx, tag, tx, tagsY, {
        bg: '#27272a',
        color: '#d4d4d8',
        font: '500 10px system-ui, sans-serif',
        padX: 8,
      })
      tx += chipW + 6
      if (tx > w - PAD - 40) break
    }
  }

  return y + panelH + 10
}

function drawStatRow(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { type, matchScore, knownCount, totalQuestions } = params
  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const colW = (innerW - 16) / 3
  const rowH = 58
  const stats = [
    { value: `${matchScore}%`, label: '匹配置信', sub: '算法认证' },
    { value: `${knownCount}/${totalQuestions}`, label: '有效作答', sub: '跳过不算' },
    { value: RARITY_META[type.rarity].emoji, label: '掉落稀有度', sub: RARITY_META[type.rarity].label },
  ]

  stats.forEach((s, i) => {
    const x = PAD + i * (colW + 8)
    drawPanel(ctx, x, y, colW, rowH, '#18181b', '#3f3f46')
    ctx.fillStyle = i < 2 ? '#fafafa' : RARITY_META[type.rarity].accent
    ctx.font = i < 2 ? 'bold 22px system-ui, sans-serif' : '22px system-ui, sans-serif'
    ctx.fillText(s.value, x + 12, y + 30)
    ctx.fillStyle = '#a1a1aa'
    ctx.font = '600 10px system-ui, sans-serif'
    ctx.fillText(s.label, x + 12, y + 44)
    ctx.fillStyle = '#52525b'
    ctx.font = '10px system-ui, sans-serif'
    const subW = ctx.measureText(s.sub).width
    ctx.fillText(s.sub, x + colW - 12 - subW, y + 44)
  })

  return y + rowH + 10
}

function drawDimensions(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { type, dimensions } = params
  const c = type.color
  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const rowH = 32
  const headerH = 36
  const bodyH = DIM_PAIRS.length * rowH + 12
  const panelH = headerH + bodyH

  drawPanel(ctx, PAD, y, innerW, panelH, '#141418', c + '28')

  ctx.fillStyle = '#fafafa'
  ctx.font = 'bold 12px system-ui, sans-serif'
  ctx.fillText('🧬 观影 DNA 四维 tug-of-war', PAD + 14, y + 24)
  ctx.fillStyle = '#71717a'
  ctx.font = '10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('左强右弱 = 更偏左侧人格', w - PAD - 14, y + 24)
  ctx.textAlign = 'left'

  const trackL = PAD + 52
  const trackR = w - PAD - 52
  const trackW = trackR - trackL
  const barH = 10

  DIM_PAIRS.forEach((pair, i) => {
    const rowY = y + headerH + 8 + i * rowH
    const lv = dimensions?.[pair.key] ?? 0
    const rv = dimensions?.[pair.pair] ?? 0
    const total = lv + rv || 1
    const leftW = (lv / total) * trackW

    ctx.fillStyle = '#e4e4e7'
    ctx.font = '600 10px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(pair.label, PAD + 14, rowY + 14)
    ctx.textAlign = 'right'
    ctx.fillText(pair.pairLabel, w - PAD - 14, rowY + 14)
    ctx.textAlign = 'left'

    roundRect(ctx, trackL, rowY + 4, trackW, barH, 5)
    ctx.fillStyle = '#27272a'
    ctx.fill()

    if (leftW > 2) {
      roundRect(ctx, trackL, rowY + 4, leftW, barH, 5)
      ctx.fillStyle = pair.color
      ctx.fill()
    }
    const rightW = trackW - leftW
    if (rightW > 2) {
      roundRect(ctx, trackL + leftW, rowY + 4, rightW, barH, 5)
      ctx.fillStyle = pair.pairColor
      ctx.fill()
    }

    const dominant = lv >= rv ? pair.letter : pair.pairLetter
    const domColor = lv >= rv ? pair.color : pair.pairColor
    const midX = trackL + leftW
    roundRect(ctx, midX - 11, rowY + 1, 22, 16, 6)
    ctx.fillStyle = '#09090b'
    ctx.fill()
    ctx.strokeStyle = domColor
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = domColor
    ctx.font = 'bold 9px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(dominant, midX, rowY + 12)
    ctx.textAlign = 'left'
  })

  return y + panelH + 10
}

function drawQuote(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { type } = params
  const c = type.color
  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const quote = type.quote.replace(/^["「]|["」]$/g, '')
  ctx.font = 'italic 12px system-ui, sans-serif'
  const lines = wrapText(ctx, quote, innerW - 48)
  const lineCount = Math.min(lines.length, 2)
  const panelH = 28 + lineCount * 18

  drawPanel(ctx, PAD, y, innerW, panelH, c + '0c', c + '25')

  ctx.fillStyle = c + '99'
  ctx.font = 'bold 18px Georgia, serif'
  ctx.fillText('"', PAD + 12, y + 26)
  ctx.fillStyle = '#d4d4d8'
  ctx.font = 'italic 12px system-ui, sans-serif'
  drawLines(ctx, lines.slice(0, 2), PAD + 28, y + 26, 18)
  ctx.fillStyle = '#52525b'
  ctx.font = '10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('— 你的观影口头禅', w - PAD - 14, y + panelH - 10)
  ctx.textAlign = 'left'

  return y + panelH + 10
}

function drawSpiritAndFilms(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { type, spiritDirector } = params
  const c = type.color
  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const panelH = measureSpiritHeight(ctx, type, spiritDirector)

  drawPanel(ctx, PAD, y, innerW, panelH, '#18181b', '#3f3f46')

  ctx.fillStyle = '#fafafa'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillText('🎬 精神导演团', PAD + 14, y + 22)

  const sd = spiritDirector || type.spiritDirector
  ctx.fillStyle = c
  ctx.font = '600 12px system-ui, sans-serif'
  const sdLines = wrapText(ctx, sd, innerW - 28).slice(0, 2)
  drawLines(ctx, sdLines, PAD + 14, y + 40, 16)

  const filmsLabelY = y + 40 + sdLines.length * 16 + 12
  ctx.fillStyle = '#71717a'
  ctx.font = '600 10px system-ui, sans-serif'
  ctx.fillText('入门片单', PAD + 14, filmsLabelY)

  let px = PAD + 14
  const pillY = filmsLabelY + 10
  for (const film of type.recommendations.slice(0, 3)) {
    const label = film.length > 12 ? film.slice(0, 11) + '…' : film
    const chipW = drawChip(ctx, label, px, pillY, {
      bg: c + '18',
      color: '#e4e4e7',
      font: '500 10px system-ui, sans-serif',
      padX: 8,
    })
    px += chipW + 6
    if (px > w - PAD - 20) break
  }

  return y + panelH + 10
}

const AI_TEXT_LINE_HEIGHT = 15
const AI_TEXT_MAX_WIDTH_OFFSET = 28

function layoutAiLines(
  ctx: CanvasRenderingContext2D,
  matchReason: string | undefined,
  roast: string | undefined,
  innerW: number,
) {
  ctx.font = '11px system-ui, sans-serif'
  const reasonLines = matchReason
    ? wrapText(ctx, matchReason, innerW - AI_TEXT_MAX_WIDTH_OFFSET)
    : []
  const roastLines = roast
    ? wrapText(ctx, roast, innerW - AI_TEXT_MAX_WIDTH_OFFSET)
    : []
  const hasRoast = roastLines.length > 0
  const panelH =
    34 +
    reasonLines.length * AI_TEXT_LINE_HEIGHT +
    (hasRoast ? 20 + roastLines.length * AI_TEXT_LINE_HEIGHT : 0)
  return { reasonLines, roastLines, hasRoast, panelH }
}

function drawAiBlock(
  ctx: CanvasRenderingContext2D,
  params: ShareCardDrawParams,
  y: number,
): number {
  const { matchReason, roast } = params
  if (!matchReason && !roast) return y

  const w = SHARE_CARD_WIDTH
  const innerW = w - PAD * 2
  const { reasonLines, roastLines, panelH } = layoutAiLines(
    ctx,
    matchReason,
    roast,
    innerW,
  )

  drawPanel(ctx, PAD, y, innerW, panelH, '#0c1a14', '#14532d55')

  ctx.fillStyle = '#6ee7b7'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillText('🤖 AI 现场锐评', PAD + 14, y + 22)

  let cursorY = y + 38
  ctx.fillStyle = '#d4d4d8'
  ctx.font = '11px system-ui, sans-serif'

  if (reasonLines.length) {
    drawLines(ctx, reasonLines, PAD + 14, cursorY, AI_TEXT_LINE_HEIGHT)
    cursorY += reasonLines.length * AI_TEXT_LINE_HEIGHT + 6
  }

  if (roastLines.length) {
    ctx.fillStyle = '#fda4af'
    ctx.font = '600 10px system-ui, sans-serif'
    ctx.fillText('毒舌一句', PAD + 14, cursorY)
    ctx.fillStyle = '#fecdd3'
    ctx.font = 'italic 11px system-ui, sans-serif'
    drawLines(ctx, roastLines, PAD + 14, cursorY + 14, AI_TEXT_LINE_HEIGHT)
  }

  return y + panelH + 10
}

function measureDimensionsHeight(): number {
  const headerH = 36
  const rowH = 32
  return headerH + DIM_PAIRS.length * rowH + 12
}

function measureQuoteHeight(ctx: CanvasRenderingContext2D, type: DBTIType): number {
  const innerW = SHARE_CARD_WIDTH - PAD * 2
  ctx.font = 'italic 12px system-ui, sans-serif'
  const quote = type.quote.replace(/^["「]|["」]$/g, '')
  const quoteLines = Math.min(wrapText(ctx, quote, innerW - 48).length, 2)
  return 28 + quoteLines * 18
}

function measureAiPanelHeight(ctx: CanvasRenderingContext2D, params: ShareCardDrawParams): number {
  const { matchReason, roast } = params
  if (!matchReason && !roast) return 0
  const innerW = SHARE_CARD_WIDTH - PAD * 2
  return layoutAiLines(ctx, matchReason, roast, innerW).panelH
}

/** 主内容区底边 Y（精神导演框结束后，不含底栏） */
function measureContentEnd(ctx: CanvasRenderingContext2D, params: ShareCardDrawParams): number {
  const { type, spiritDirector } = params
  let y = 54
  y += measureHeroHeight(ctx, type) + 10
  y += 58 + 10
  y += measureDimensionsHeight() + 10
  y += measureQuoteHeight(ctx, type) + 10
  const aiPanel = measureAiPanelHeight(ctx, params)
  if (aiPanel > 0) y += aiPanel + 10
  y += measureSpiritHeight(ctx, type, spiritDirector) + 10
  return y
}

function measureCardHeight(ctx: CanvasRenderingContext2D, params: ShareCardDrawParams): number {
  const contentEnd = measureContentEnd(ctx, params)
  const tightHeight =
    contentEnd + FOOTER_GAP_AFTER_SPIRIT + FOOTER_INNER_HEIGHT + IMAGE_BOTTOM_PAD
  return Math.max(MIN_CARD_HEIGHT, tightHeight)
}

/** 紧贴主内容绘制底栏，返回图片总高度 */
function drawFooter(ctx: CanvasRenderingContext2D, params: ShareCardDrawParams, startY: number): number {
  const { type } = params
  const c = type.color
  const w = SHARE_CARD_WIDTH

  const sepY = startY
  const textBaseline = startY + 20

  ctx.strokeStyle = c + '40'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, sepY)
  ctx.lineTo(w - PAD, sepY)
  ctx.stroke()

  ctx.fillStyle = '#fafafa'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.fillText('www.dbti.fun', PAD, textBaseline)
  ctx.fillStyle = '#71717a'
  ctx.font = '11px system-ui, sans-serif'
  ctx.fillText('来测测你的电影人格 · 看看谁和你撞型', PAD + 72, textBaseline)

  ctx.textAlign = 'right'
  ctx.fillStyle = c
  ctx.font = '600 11px system-ui, sans-serif'
  ctx.fillText(`#${type.id}`, w - PAD, textBaseline)
  ctx.textAlign = 'left'

  return textBaseline + IMAGE_BOTTOM_PAD
}

export function drawShareCard(
  canvas: HTMLCanvasElement,
  params: ShareCardDrawParams,
  options: DrawShareCardOptions = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = SHARE_CARD_WIDTH
  const logicalH = measureCardHeight(ctx, params)
  const pixelRatio = options.pixelRatio ?? getShareCardPixelRatio(false)

  canvas.width = Math.round(w * pixelRatio)
  canvas.height = Math.round(logicalH * pixelRatio)
  // 预览由 CSS 缩放至容器宽度，避免固定 600px 撑破手机弹窗
  canvas.style.width = '100%'
  canvas.style.height = 'auto'
  canvas.style.maxWidth = '100%'
  canvas.style.display = 'block'

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const c = params.type.color
  drawBackground(ctx, w, logicalH, c)

  ctx.fillStyle = '#fafafa'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillText('DBTI', PAD, 28)
  ctx.fillStyle = '#71717a'
  ctx.font = '10px system-ui, sans-serif'
  ctx.fillText('电影人格 · 分享战报', PAD + 42, 28)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#52525b'
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillText('ROLL YOUR TYPE', w - PAD, 28)
  ctx.textAlign = 'left'

  drawFilmPerforations(ctx, w, 38, c)

  let y = 54
  y = drawHero(ctx, params, y)
  y = drawStatRow(ctx, params, y)
  y = drawDimensions(ctx, params, y)
  y = drawQuote(ctx, params, y)
  y = drawAiBlock(ctx, params, y)
  y = drawSpiritAndFilms(ctx, params, y)

  drawFooter(ctx, params, y + FOOTER_GAP_AFTER_SPIRIT)
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1)
  })
}
