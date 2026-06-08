import { useState } from 'react'
import { ArrowLeft, Edit3, Film, Save, Sparkles, Ticket, UserRound } from 'lucide-react'
import { Card, PageShell } from '@/components/ui/layout'
import { buttonClasses } from '@/components/ui/buttonStyles'
import {
  getCinephileProfile,
  getLatestDBTIEntry,
  getLatestDBTIType,
  saveCinephileProfile,
  type CinephileProfileData,
} from '@/lib/cinephile-profile'
import { cn } from '@/lib/utils'

interface CinephileProfileProps {
  onBack: () => void
  onStartTest: () => void
}

export function CinephileProfile({ onBack, onStartTest }: CinephileProfileProps) {
  const [profile, setProfile] = useState<CinephileProfileData>(getCinephileProfile)
  const [draft, setDraft] = useState(profile)
  const [editing, setEditing] = useState(false)
  const latest = getLatestDBTIEntry()
  const type = getLatestDBTIType(latest)

  const saveProfile = () => {
    const next = {
      displayName: draft.displayName.trim() || '无名放映员',
      bio: draft.bio.trim() || '在电影与生活之间，寻找自己的银幕坐标。',
      favoriteFilms: draft.favoriteFilms.filter(Boolean).slice(0, 3),
    }
    saveCinephileProfile(next)
    setProfile(next)
    setDraft(next)
    setEditing(false)
  }

  return (
    <PageShell contentClassName="max-w-4xl">
      <div className="space-y-5 sm:space-y-7">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className={buttonClasses.ghost}>
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <span className="text-[10px] tracking-[0.22em] text-zinc-600">MY SCREEN IDENTITY</span>
        </div>

        <section className="profile-hero">
          <div className="profile-avatar" style={{ borderColor: type?.color ?? '#d2a45e' }}>
            <UserRound />
          </div>
          <div className="min-w-0">
            {editing ? (
              <input
                value={draft.displayName}
                onChange={(event) => setDraft({ ...draft, displayName: event.target.value })}
                className="profile-input text-xl sm:text-2xl"
                aria-label="影迷昵称"
              />
            ) : (
              <h1 className="text-2xl sm:text-4xl font-semibold text-white">{profile.displayName}</h1>
            )}
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              幕间居民 · {latest ? `第 ${new Date(latest.timestamp).getFullYear()} 季` : '等待第一次放映'}
            </p>
          </div>
          <button
            onClick={() => editing ? saveProfile() : setEditing(true)}
            className={cn(buttonClasses.secondary, 'ml-auto px-3 sm:px-4 py-2.5 text-xs')}
          >
            {editing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {editing ? '保存' : '编辑'}
          </button>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="profile-type-card">
            {type && latest ? (
              <>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="profile-label">我的电影人格</p>
                    <h2 className="mt-3 text-2xl sm:text-3xl" style={{ color: type.color }}>{type.name}</h2>
                    <p className="mt-1 text-xs tracking-wider text-zinc-500">{type.id} · {type.nameEn}</p>
                  </div>
                  <strong className="text-3xl sm:text-4xl font-light text-white">{latest.matchScore}%</strong>
                </div>
                <p className="mt-7 text-sm leading-7 text-zinc-300">「{type.tagline}」</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {type.tags.map((tag) => (
                    <span key={tag} className="profile-chip" style={{ color: type.color }}>{tag}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <Sparkles className="mx-auto w-7 h-7 text-[#d2a45e]" />
                <h2 className="mt-4 text-xl text-white">你的银幕身份尚未揭晓</h2>
                <p className="mt-2 text-sm text-zinc-500">完成 DBTI，主页才会真正属于你。</p>
                <button onClick={onStartTest} className={cn(buttonClasses.primary, 'mt-6 text-sm')}>开始测试</button>
              </div>
            )}
          </Card>

          <Card className="space-y-5">
            <div>
              <p className="profile-label">银幕自述</p>
              {editing ? (
                <textarea
                  value={draft.bio}
                  onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                  className="profile-input mt-3 min-h-24 resize-none"
                  aria-label="银幕自述"
                />
              ) : (
                <p className="mt-3 text-sm leading-7 text-zinc-300">{profile.bio}</p>
              )}
            </div>
            <div className="border-t border-zinc-800 pt-5">
              <p className="profile-label">精神导演</p>
              <p className="mt-3 text-sm text-zinc-300">{type?.spiritDirector ?? '等待 DBTI 为你揭晓'}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#d2a45e]" />
            <h2 className="text-sm font-semibold text-white">塑造我的三部电影</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(editing ? draft.favoriteFilms : profile.favoriteFilms).map((film, index) => (
              <div key={index} className="profile-film">
                <span>0{index + 1}</span>
                {editing ? (
                  <input
                    value={film}
                    onChange={(event) => {
                      const films = [...draft.favoriteFilms]
                      films[index] = event.target.value
                      setDraft({ ...draft, favoriteFilms: films })
                    }}
                    className="profile-input"
                    aria-label={`第 ${index + 1} 部电影`}
                  />
                ) : (
                  <strong>《{film}》</strong>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="profile-stat"><Ticket /><strong>{latest ? '1' : '0'}</strong><span>人格档案</span></div>
          <div className="profile-stat"><Film /><strong>{profile.favoriteFilms.length}</strong><span>本命电影</span></div>
          <div className="profile-stat"><Sparkles /><strong>{type?.tags.length ?? 0}</strong><span>审美标签</span></div>
        </div>
      </div>
    </PageShell>
  )
}
