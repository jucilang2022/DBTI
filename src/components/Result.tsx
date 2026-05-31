import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, RefreshCw, Sparkles, Film, Eye, Heart, Brain,
  ChevronDown, Star, Flame, Gem, Clapperboard, HelpCircle,
} from 'lucide-react'
import type { QuizResult, Answer, QuizQuestion, AnswerChoice, AIAnalysis, QuizAnswer } from '@/types'
import { getRarityLabel } from '@/data/quiz-analyzer'
import { DBTI_TYPES, getDimensionLabels } from '@/data/dbti-types'
import { cn } from '@/lib/utils'
import { ShareCard } from './ShareCard'
import { compareQuestions } from '@/data/director_compare_questions'
import { valueQuestions } from '@/data/value-questions'
import { scenarioQuestions } from '@/data/scenario_questions'
import { selfCognitionQuestions } from '@/data/self_cognition_questions'
import { Card, PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'

interface ResultProps {
  result: QuizResult
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  aiAnalysis?: AIAnalysis | null
  resultId: string
  onRestart: () => void
}

const CHOICE_META: Record<AnswerChoice, { label: string; icon: React.ReactNode; color: string }> = {
  famous: { label: '代表作', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  controversial: { label: '争议之作', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-rose-400' },
  hidden: { label: '特色佳作', icon: <Gem className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  other: { label: '其他作品', icon: <Clapperboard className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  unknown: { label: '没看过', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-zinc-500' },
}

function getWorkByChoice(q: QuizQuestion, choice: AnswerChoice) {
  switch (choice) {
    case 'famous': return q.director.famousWork
    case 'controversial': return q.director.controversialWork
    case 'hidden': return q.director.hiddenGem
    default: return null
  }
}

export function Result({ result, questions, answers, aiAnalysis, resultId, onRestart }: ResultProps) {
  const typeCode = result.typeCode?.trim().toUpperCase()
  const type = (typeCode ? DBTI_TYPES.find((t) => t.id === typeCode) : null) ?? result.type
  const { knownCount, matchScore } = result
  const totalQuestions = answers.length
  const [showReview, setShowReview] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  // 保存结果到 localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('dbti_history') || '[]')
      if (history.some((entry: { id?: string }) => entry.id === resultId)) return

      // 保存完整答题数据（含所有题型）
      history.unshift({
        id: resultId,
        typeId: type.id,
        typeName: type.name,
        matchScore,
        knownCount,
        timestamp: new Date().toISOString(),
        result,
        questions,
        answers: answers as unknown as Answer[],  // 全题型数据存入 answers（HistoryEntry 扩展兼容）
        aiAnalysis: aiAnalysis ?? null,
      })
      localStorage.setItem('dbti_history', JSON.stringify(history.slice(0, 20)))
    } catch {
      // Ignore storage errors; the result page should still render.
    }
  }, [type, matchScore, knownCount, resultId, result, questions, answers, aiAnalysis])

  const renderShareText = () => {
    const choiceEmojis = result.choiceCounts
      ? Object.entries(result.choiceCounts).map(([k, v]) =>
          k === 'famous' ? '⭐'.repeat(v as number) :
          k === 'controversial' ? '🔥'.repeat(v as number) :
          k === 'hidden' ? '💎'.repeat(v as number) :
          k === 'other' ? '🎬'.repeat(v as number) :
          '❓'.repeat(v as number)
        ).join('')
      : ''
    const lines = [
      '🎬 DBTI 导演人格测试结果',
      '',
      `🧑‍🎨 你的类型：${type.name}（${type.nameEn}）`,
      `📝 「${type.tagline}」`,
      `🎯 匹配度：${matchScore}%`,
      `🎭 有效回答 ${knownCount}/${totalQuestions} 题`,
      choiceEmojis ? `📊 ${choiceEmojis}` : '',
      '',
      `✨ 精神导演：${type.spiritDirector}`,
      '',
      '来测测你的导演人格 👇',
      window.location.href,
    ]
    return lines.filter(Boolean).join('\n')
  }

  const handleShare = async () => {
    if (navigator.share) {
      // 有原生分享：弹出菜单让用户选择分享方式
      await navigator.share({
        title: 'DBTI 导演人格测试',
        text: renderShareText(),
        url: window.location.href,
      })
    } else {
      // 无原生分享：打开分享卡片
      setShowShareCard(true)
    }
  }

  // 构建全题型答案回顾数据
  type ReviewGroup = {
    label: string
    icon: React.ReactNode
    color: string
    items: { title: string; detail: string; accent: string }[]
  }

  const buildReview = (): ReviewGroup[] => {
    const groups: ReviewGroup[] = []

    // 导演作品题
    const dwItems = answers
      .filter((a): a is QuizAnswer & { choice: AnswerChoice } => a.questionType === 'director_work' && !!a.choice)
      .map((a) => {
        const q = questions.find((q) => q.director.id === a.directorId)
        if (!q) return null
        const meta = CHOICE_META[a.choice]
        const work = getWorkByChoice(q, a.choice)
        return {
          title: q.director.name,
          detail: work ? `《${work.title}》（${work.year}）` : a.choice === 'unknown' ? '没看过' : '其他作品',
          accent: meta?.color ?? 'text-zinc-500',
        }
      })
      .filter(Boolean)
    if (dwItems.length > 0) {
      groups.push({
        label: '导演作品',
        icon: <Film className="w-3.5 h-3.5" />,
        color: 'text-amber-400',
        items: dwItems as { title: string; detail: string; accent: string }[],
      })
    }

    // 导演对比题
    const dcItems = answers
      .filter((a) => a.questionType === 'director_compare')
      .map((a) => {
        const q = compareQuestions.find((cq) => cq.id === a.questionId)
        const dir = q?.directors[a.selectedIndex]
        if (!dir) return null
        return {
          title: q!.question,
          detail: `→ 选择了 ${dir.name}（${dir.style}）`,
          accent: 'text-amber-400',
        }
      })
      .filter(Boolean)
    if (dcItems.length > 0) {
      groups.push({
        label: '导演对比',
        icon: <Clapperboard className="w-3.5 h-3.5" />,
        color: 'text-amber-400',
        items: dcItems as { title: string; detail: string; accent: string }[],
      })
    }

    // 价值观/情景/自我认知 — 通用处理
    const choicePools = [
      { type: 'value' as const, label: '价值观选择', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-emerald-400', pool: valueQuestions },
      { type: 'scenario' as const, label: '情景选择', icon: <Clapperboard className="w-3.5 h-3.5" />, color: 'text-sky-400', pool: scenarioQuestions },
      { type: 'self_cognition' as const, label: '自我认知', icon: <Brain className="w-3.5 h-3.5" />, color: 'text-purple-400', pool: selfCognitionQuestions },
    ]

    for (const cp of choicePools) {
      const items = answers
        .filter((a) => a.questionType === cp.type)
        .map((a) => {
          const q = cp.pool.find((pq) => pq.id === a.questionId)
          const opt = q?.options[a.selectedIndex]
          if (!q || !opt) return null
          return {
            title: q.question,
            detail: `→ ${opt.text}`,
            accent: cp.color,
          }
        })
        .filter(Boolean)
      if (items.length > 0) {
        groups.push({
          label: cp.label,
          icon: cp.icon,
          color: cp.color,
          items: items as { title: string; detail: string; accent: string }[],
        })
      }
    }

    return groups
  }

  const reviewGroups = buildReview()

  return (
    <PageShell
      overflowHidden
      contentClassName="pt-14 pb-24"
      background={
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[150px] opacity-20"
            style={{ backgroundColor: type.color }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-15"
            style={{ backgroundColor: type.color }}
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* === 主标题 === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6"
            style={{
              backgroundColor: type.color + '15',
              borderColor: type.color + '30',
              color: type.color,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
            你的 DBTI 是
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span style={{ color: type.color }}>{type.name}</span>
          </motion.h1>

          <motion.p
            className="text-lg text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {type.nameEn}
          </motion.p>

          {/* 四维字母码 */}
          {typeCode && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700">
                {typeCode.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="text-lg font-mono font-bold tracking-wider"
                    style={{ color: type.color }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3">
                {(() => {
                  const labels = getDimensionLabels(typeCode)
                  return labels.map((d, i) => (
                    <div key={i} className="text-xs text-zinc-500">
                      <span style={{ color: type.color }} className="font-mono">{d.letter}</span>
                      {' '}{d.label}
                    </div>
                  ))
                })()}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* === Tagline + 稀有度 === */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-lg text-zinc-300 italic mb-3">「{type.tagline}」</p>
          <span className="text-sm text-zinc-500">{getRarityLabel(type.rarity)}</span>
        </motion.div>

        {/* === 人格解析 === */}
        <Card
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">人格解析</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{type.description}</p>
        </Card>

        {/* === AI 分析（如果有） === */}
        {aiAnalysis && (
          <Card
            className="space-y-5 border-emerald-800/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">AI 实时分析</span>
            </div>

            {/* 匹配分析 */}
            <div>
              <div className="text-xs text-zinc-500 mb-2">匹配分析</div>
              <p className="text-sm text-zinc-300 leading-relaxed">{aiAnalysis.matchReason}</p>
            </div>

            {/* 锐评 */}
            <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
              <div className="text-xs text-rose-400 mb-2 font-medium">锐评</div>
              <p className="text-sm text-zinc-200 leading-relaxed">{aiAnalysis.roast}</p>
            </div>

            {/* AI 推荐片单 */}
            {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 mb-2">AI 额外推荐</div>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.recommendations.map((rec: string) => (
                    <span
                      key={rec}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* === 精神导演 + 推荐片单 === */}
        <Card
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: aiAnalysis ? 1.4 : 1.2 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4" style={{ color: type.color }} />
              <span className="text-sm font-semibold text-white">你的精神导演</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{type.spiritDirector}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4" style={{ color: type.color }} />
              <span className="text-sm font-semibold text-white">推荐片单</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {type.recommendations.map((rec) => (
                <span
                  key={rec}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: type.color + '15',
                    color: type.color,
                    borderColor: type.color + '25',
                    borderWidth: 1,
                  }}
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* === 金句 === */}
        <motion.div
          className="text-center py-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-xs text-zinc-500 italic leading-relaxed">{type.quote}</p>
        </motion.div>

        {/* === 统计 + 品味条 === */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{result.matchScore}%</div>
              <div className="text-xs text-zinc-500 mt-1">匹配度</div>
            </div>
            <div className="w-px h-12 bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{knownCount}/{totalQuestions}</div>
              <div className="text-xs text-zinc-500 mt-1">有效回答</div>
            </div>
          </div>

          {/* 选项分布 */}
          {result.choiceCounts && (
            <div className="grid grid-cols-5 gap-2 pt-5 pb-5 mb-5 border-t border-b border-zinc-800">
              {Object.entries(result.choiceCounts).map(([key, count]) => {
                const label =
                  key === 'famous' ? '⭐代表作' :
                  key === 'controversial' ? '🎯争议' :
                  key === 'hidden' ? '💎特色' :
                  key === 'other' ? '🎬其他' :
                  '❓没看过'
                return (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-[11px] leading-tight text-zinc-500 mt-1">{label}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 四维评分条 */}
          {result.dimensions && (() => {
            const dims = result.dimensions
            const pairs = [
              { left: '大众 P', lv: dims.p ?? 0, right: 'N 特色', rv: dims.n ?? 0, lc: '#f59e0b', rc: '#a21caf' },
              { left: '经典 C', lv: dims.c ?? 0, right: 'G 邪典', rv: dims.g ?? 0, lc: '#38bdf8', rc: '#ef4444' },
              { left: '正统 O', lv: dims.o ?? 0, right: 'A 独到', rv: dims.a ?? 0, lc: '#34d399', rc: '#8b5cf6' },
              { left: '核心 M', lv: dims.m ?? 0, right: 'S 随性', rv: dims.s ?? 0, lc: '#e879f9', rc: '#6b7280' },
            ]
            const maxVal = Math.max(...pairs.flatMap(p => [p.lv, p.rv]), 1)
            return (
              <>
                <div className="flex items-center gap-2 mb-4 pt-2">
                  <Sparkles className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-white">四维人格剖面</span>
                </div>
                <div className="space-y-3">
                  {pairs.map((pair, i) => {
                    const total = pair.lv + pair.rv
                    const lpct = total > 0 ? (pair.lv / maxVal) * 100 : 0
                    const rpct = total > 0 ? (pair.rv / maxVal) * 100 : 0
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: pair.lc }} className="font-semibold">{pair.left}</span>
                          <span className="text-zinc-600">{pair.lv} vs {pair.rv}</span>
                          <span style={{ color: pair.rc }} className="font-semibold">{pair.right}</span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                          <motion.div
                            style={{ backgroundColor: pair.lc }}
                            initial={{ width: 0 }}
                            animate={{ width: `${lpct}%` }}
                            transition={{ duration: 0.5, delay: 2 + i * 0.1 }}
                          />
                          <motion.div
                            style={{ backgroundColor: pair.rc }}
                            initial={{ width: 0 }}
                            animate={{ width: `${rpct}%` }}
                            transition={{ duration: 0.5, delay: 2 + i * 0.1 + 0.15 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })()}
        </Card>

        {/* === 答案回顾 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-white">回顾你的选择</span>
              <span className="text-xs text-zinc-500 ml-1">({knownCount} 题有效)</span>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-zinc-400 transition-transform duration-300',
                showReview && 'rotate-180',
              )}
            />
          </button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-5">
                  {reviewGroups.map((group) => (
                    <div key={group.label}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className={cn('text-xs', group.color)}>{group.icon}</span>
                        <span className={cn('text-xs font-semibold', group.color)}>
                          {group.label}（{group.items.length} 题）
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {group.items.map((item, i) => (
                          <div
                            key={i}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-800/30"
                          >
                            <div className="text-xs text-zinc-300 font-medium leading-snug">
                              {item.title}
                            </div>
                            <div className={cn('text-[11px] mt-0.5 leading-snug', item.accent)}>
                              {item.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === 操作按钮 === */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleShare} className={cn(buttonClasses.primary, 'w-full px-4 py-3 text-sm')}>
              <Share2 className="w-4 h-4" />
              分享结果
            </button>

            <button onClick={onRestart} className={cn(buttonClasses.secondary, 'w-full px-4 py-3 text-sm')}>
              <RefreshCw className="w-4 h-4" />
              返回首页
            </button>
          </div>

          <p className="text-right text-xs text-zinc-600">
            建议/反馈？-&gt;{' '}
            <a
              href="https://www.douban.com/people/230674291"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              月亮
            </a>
          </p>
        </motion.div>
      </div>

      {/* 分享卡片弹窗 */}
      <ShareCard
        open={showShareCard}
        onClose={() => setShowShareCard(false)}
        type={type}
        matchScore={matchScore}
        knownCount={knownCount}
        totalQuestions={totalQuestions}
      />
    </PageShell>
  )
}
