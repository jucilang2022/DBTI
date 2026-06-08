import { useMemo, useState } from 'react'
import { ArrowLeft, Check, MessageCircle, Send } from 'lucide-react'
import { Card, PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/utils'

const PROMPTS = [
  '哪部电影改变过你看待爱情的方式？',
  '说一部你明知有缺点，却会一直维护的电影。',
  '如果只能保留一个电影结尾，你会留下哪一个？',
  '哪部电影最像你最近的生活状态？',
  '有没有一部电影，你喜欢它却不愿意再看第二遍？',
  '用三部电影描述现在的你。',
  '哪个电影角色让你看见了不愿承认的自己？',
]

const SAMPLE_ANSWERS = [
  { type: 'NCAM', name: '雨夜放映员', answer: '《一一》。它让我接受，人永远只能看见事情的一半。' },
  { type: 'PGOM', name: '最后一排', answer: '《疯狂的麦克斯4》，疲惫的时候我需要电影替我把油门踩到底。' },
  { type: 'PCAS', name: '散场以后', answer: '《花样年华》。有些错过不是遗憾，而是一个人秘密的完整人生。' },
]

interface DailyPromptProps {
  onBack: () => void
}

function getDayState() {
  const now = new Date()
  return {
    index: Math.floor(now.getTime() / 86400000),
    key: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  }
}

export function DailyPrompt({ onBack }: DailyPromptProps) {
  const [day] = useState(getDayState)
  const prompt = PROMPTS[day.index % PROMPTS.length]
  const storageKey = `daily_prompt_${day.key}`
  const [answer, setAnswer] = useState(() => localStorage.getItem(storageKey) ?? '')
  const [submitted, setSubmitted] = useState(() => Boolean(localStorage.getItem(storageKey)))
  const issueNumber = useMemo(() => String((day.index % 999) + 1).padStart(3, '0'), [day.index])

  const submit = () => {
    const clean = answer.trim()
    if (!clean) return
    localStorage.setItem(storageKey, clean)
    setAnswer(clean)
    setSubmitted(true)
  }

  return (
    <PageShell contentClassName="max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className={buttonClasses.ghost}>
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <span className="text-[10px] tracking-[0.22em] text-zinc-600">DAILY QUESTION · NO.{issueNumber}</span>
        </div>

        <section className="prompt-stage">
          <p className="profile-label">今日电影命题</p>
          <h1>{prompt}</h1>
          <p>不必写影评。只说电影曾经如何穿过你的生活。</p>
          <div className="prompt-editor">
            <textarea
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value)
                setSubmitted(false)
              }}
              placeholder="写下你的答案……"
              maxLength={280}
            />
            <div>
              <span>{answer.length} / 280</span>
              <button onClick={submit} disabled={!answer.trim()} className={cn(buttonClasses.primary, 'px-4 py-3 text-xs disabled:opacity-40')}>
                {submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {submitted ? '已留在幕间' : '留下回答'}
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-[#d2a45e]" />
          <h2 className="text-sm font-semibold text-white">今晚的其他回答</h2>
          <span className="text-xs text-zinc-600">虚拟社区预览</span>
        </div>

        <div className="grid gap-3">
          {SAMPLE_ANSWERS.map((item) => (
            <Card key={item.name} className="prompt-answer">
              <div><span>{item.type}</span><strong>{item.name}</strong></div>
              <p>{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
