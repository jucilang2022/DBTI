import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, RefreshCw, Sparkles, Film, Eye, Heart, Brain,
  ChevronDown, Star, Flame, Gem, Clapperboard, HelpCircle,
} from 'lucide-react'
import type { QuizResult, Answer, QuizQuestion, AnswerChoice, Director, AIAnalysis } from '@/types'
import { getRarityLabel } from '@/data/quiz-analyzer'
import { getDimensionLabels } from '@/data/dbti-types'
import { cn } from '@/lib/utils'
import { TasteBar } from './TasteBar'
import { ShareCard } from './ShareCard'
import { DirectorDetail } from './DirectorDetail'

interface ResultProps {
  result: QuizResult
  questions: QuizQuestion[]
  answers: Answer[]
  aiAnalysis?: AIAnalysis | null
  onRestart: () => void
}

const CHOICE_META: Record<AnswerChoice, { label: string; icon: React.ReactNode; color: string }> = {
  famous: { label: '代表作', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  controversial: { label: '低分但不是很低', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-rose-400' },
  hidden: { label: '小众佳片', icon: <Gem className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  other: { label: '其他作品', icon: <Clapperboard className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  unknown: { label: '没看过', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-zinc-500' },
}

function getWorkByChoice(q: QuizQuestion, choice: AnswerChoice) {
  switch (choice) {
    case 'famous': return q.director.famousWork
    case 'controversial': return q.director.controversialWork
    case 'hidden': return q.director.hiddenGem
    case 'other': return q.director.otherWork
    default: return null
  }
}

export function Result({ result, questions, answers, aiAnalysis, onRestart }: ResultProps) {
  const { type, knownCount, matchScore } = result
  const [showReview, setShowReview] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [detailDirector, setDetailDirector] = useState<Director | null>(null)

  // 保存结果到 localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('dbti_history') || '[]')
      history.unshift({
        typeId: type.id,
        typeName: type.name,
        matchScore,
        knownCount,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem('dbti_history', JSON.stringify(history.slice(0, 20)))
    } catch {}
  }, [type, matchScore, knownCount])

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
      `🎭 认识 ${knownCount}/10 位导演`,
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

  const answerPairs: { q: QuizQuestion; a: Answer }[] = questions.map((q, i) => ({
    q,
    a: answers[i],
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* 背景光晕 */}
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

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-24">
        {/* === 主标题 === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
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
          {result.typeCode && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700">
                {result.typeCode.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="text-lg font-mono font-bold tracking-wider"
                    style={{ color: type.color }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-2">
                {(() => {
                  const labels = getDimensionLabels(result.typeCode!)
                  return labels.map((d, i) => (
                    <div key={i} className="text-[10px] text-zinc-500">
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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-lg text-zinc-300 italic mb-3">「{type.tagline}」</p>
          <span className="text-sm text-zinc-500">{getRarityLabel(type.rarity)}</span>
        </motion.div>

        {/* === 人格解析 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">人格解析</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{type.description}</p>
        </motion.div>

        {/* === AI 分析（如果有） === */}
        {aiAnalysis && (
          <motion.div
            className="bg-zinc-900/60 rounded-2xl border border-emerald-800/40 p-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">🧠 AI 实时分析</span>
            </div>

            {/* 匹配分析 */}
            <div className="mb-4">
              <div className="text-xs text-zinc-500 mb-1.5">匹配分析</div>
              <p className="text-sm text-zinc-300 leading-relaxed">{aiAnalysis.matchReason}</p>
            </div>

            {/* 锐评 */}
            <div className="mb-4 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
              <div className="text-xs text-rose-400 mb-1.5 font-medium">💬 锐评</div>
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
          </motion.div>
        )}

        {/* === 精神导演 + 推荐片单 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: aiAnalysis ? 1.4 : 1.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Film className="w-4 h-4" style={{ color: type.color }} />
            <span className="text-sm font-semibold text-white">你的精神导演</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{type.spiritDirector}</p>

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
        </motion.div>

        {/* === 金句 === */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-xs text-zinc-500 italic leading-relaxed">{type.quote}</p>
        </motion.div>

        {/* === 统计 + 品味条 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 mb-4"
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
              <div className="text-3xl font-bold text-white">{knownCount}/10</div>
              <div className="text-xs text-zinc-500 mt-1">认识导演</div>
            </div>
          </div>

          {/* 选项分布 */}
          {result.choiceCounts && (
            <div className="flex items-center justify-around pt-4 pb-4 mb-4 border-t border-b border-zinc-800">
              {Object.entries(result.choiceCounts).map(([key, count]) => {
                const label =
                  key === 'famous' ? '⭐代表作' :
                  key === 'controversial' ? '🎯低分' :
                  key === 'hidden' ? '💎小众' :
                  key === 'other' ? '🎬其他' :
                  '❓没看过'
                return (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{label}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 四维评分条 */}
          {result.dimensions && (() => {
            const dims = result.dimensions
            const pairs = [
              { left: '大众 P', lv: dims.p ?? 0, right: 'N 小众', rv: dims.n ?? 0, lc: '#f59e0b', rc: '#a21caf' },
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
        </motion.div>

        {/* === 答案回顾 === */}
        <motion.div
          className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden mb-8"
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
              <span className="text-xs text-zinc-500 ml-1">({knownCount} 位认识)</span>
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
                <div className="px-5 pb-5 space-y-3 border-t border-zinc-800 pt-4">
                  {answerPairs.map(({ q, a }) => {
                    const meta = CHOICE_META[a.choice]
                    const work = getWorkByChoice(q, a.choice)
                    return (
                      <button
                        key={q.director.id}
                        onClick={() => setDetailDirector(q.director)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition-colors text-left"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: q.director.color + '20', color: q.director.color }}
                        >
                          {q.director.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">
                              {q.director.name}
                            </span>
                            <span className={cn('text-xs flex items-center gap-1 shrink-0', meta.color)}>
                              {meta.icon}
                              {meta.label}
                            </span>
                          </div>
                          {work && (
                            <div className="text-xs text-zinc-500 mt-0.5 truncate">
                              《{work.title}》（{work.year}）
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === 操作按钮 === */}
        <motion.button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <Share2 className="w-4 h-4" />
          分享结果
        </motion.button>

        <motion.button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
        >
          <RefreshCw className="w-4 h-4" />
          重新测试
        </motion.button>
      </div>

      {/* 导演详情弹窗 */}
      <DirectorDetail
        director={detailDirector}
        onClose={() => setDetailDirector(null)}
      />

      {/* 分享卡片弹窗 */}
      <ShareCard
        open={showShareCard}
        onClose={() => setShowShareCard(false)}
        type={type}
        matchScore={matchScore}
        knownCount={knownCount}
      />
    </div>
  )
}
