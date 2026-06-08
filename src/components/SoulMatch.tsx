import { useMemo, useState } from 'react'
import { ArrowLeft, Compass, Flame, RefreshCw, Users } from 'lucide-react'
import { DBTI_TYPES } from '@/data/dbti-types'
import { Card, PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { getLatestDBTIEntry, getLatestDBTIType } from '@/lib/cinephile-profile'
import { cn } from '@/lib/utils'

type MatchMode = 'similar' | 'mirror' | 'guide'

const MODE_META = {
  similar: { label: '同类', icon: Users, description: '与你拥有相近的审美坐标' },
  mirror: { label: '镜像', icon: Flame, description: '与你相似，却总在关键处选相反答案' },
  guide: { label: '引路人', icon: Compass, description: '能带你进入陌生电影世界的人' },
}

const NAMES = ['胶片余温', '午夜场常客', '第七码头', '无字幕观众', '银幕背面', '散场不走']

function distance(a: string, b: string) {
  return [...a].filter((letter, index) => letter !== b[index]).length
}

interface SoulMatchProps {
  onBack: () => void
  onStartTest: () => void
}

export function SoulMatch({ onBack, onStartTest }: SoulMatchProps) {
  const latest = getLatestDBTIEntry()
  const ownType = getLatestDBTIType(latest)
  const [mode, setMode] = useState<MatchMode>('similar')
  const [seed, setSeed] = useState(0)

  const matches = useMemo(() => {
    if (!ownType) return []
    const sorted = DBTI_TYPES
      .filter((type) => type.id !== ownType.id)
      .map((type) => ({ type, diff: distance(ownType.id, type.id) }))
      .sort((a, b) => {
        if (mode === 'similar') return a.diff - b.diff
        if (mode === 'mirror') return Math.abs(a.diff - 2) - Math.abs(b.diff - 2)
        return b.diff - a.diff
      })
    return [...sorted.slice(seed % 3), ...sorted.slice(0, seed % 3)].slice(0, 3)
  }, [mode, ownType, seed])

  return (
    <PageShell contentClassName="max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className={buttonClasses.ghost}>
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <span className="text-[10px] tracking-[0.22em] text-zinc-600">SOULMATE SCREENING</span>
        </div>

        <div className="match-heading">
          <div>
            <p className="profile-label">灵魂影友匹配</p>
            <h1>有人与你看见同一束光，<br />也有人会带你看向别处。</h1>
          </div>
          {ownType && <div className="match-code" style={{ color: ownType.color }}>{ownType.id}</div>}
        </div>

        {!ownType ? (
          <Card className="py-12 text-center">
            <Compass className="mx-auto w-8 h-8 text-[#d2a45e]" />
            <h2 className="mt-5 text-xl text-white">先确定你的银幕坐标</h2>
            <p className="mt-2 text-sm text-zinc-500">完成 DBTI 后，才能找到真正有意思的影友。</p>
            <button onClick={onStartTest} className={cn(buttonClasses.primary, 'mt-6 text-sm')}>开始测试</button>
          </Card>
        ) : (
          <>
            <div className="match-tabs">
              {(Object.keys(MODE_META) as MatchMode[]).map((key) => {
                const meta = MODE_META[key]
                const Icon = meta.icon
                return (
                  <button key={key} onClick={() => setMode(key)} className={mode === key ? 'active' : ''}>
                    <Icon />
                    <span><strong>{meta.label}</strong><small>{meta.description}</small></span>
                  </button>
                )
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {matches.map(({ type, diff }, index) => {
                const compatibility = mode === 'similar' ? 96 - diff * 7 - index * 2 : mode === 'mirror' ? 88 - Math.abs(diff - 2) * 6 - index : 84 + diff * 2 - index
                return (
                  <Card key={type.id} className="match-card">
                    <div className="match-card-top">
                      <span style={{ color: type.color }}>{type.id}</span>
                      <strong>{compatibility}%</strong>
                    </div>
                    <h2>{NAMES[(index + seed) % NAMES.length]}</h2>
                    <p className="match-type" style={{ color: type.color }}>{type.name}</p>
                    <p>{mode === 'similar' ? `你们都相信：${type.tagline}` : mode === 'mirror' ? '你们会为同一部电影争论，却很可能在散场后继续聊到深夜。' : `TA 最想带你去看：${type.recommendations[index % type.recommendations.length]}`}</p>
                    <div className="match-tags">{type.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </Card>
                )
              })}
            </div>

            <button onClick={() => setSeed((value) => value + 1)} className={cn(buttonClasses.secondary, 'mx-auto flex text-xs')}>
              <RefreshCw className="w-3.5 h-3.5" />
              换一组影友
            </button>
            <p className="text-center text-[11px] text-zinc-700">当前为人格匹配体验版，未来可接入真实影迷资料。</p>
          </>
        )}
      </div>
    </PageShell>
  )
}
