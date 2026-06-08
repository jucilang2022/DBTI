import { useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Search, Sparkles, X } from 'lucide-react'

interface CinemaHomeProps {
  onStartTest: () => void
  onHistory: () => void
  onExplore: () => void
}

type ListId = 'weekly' | 'classic' | 'new'

interface Movie {
  id: number
  title: string
  original: string
  year: number
  country: string
  director: string
  genres: string[]
  score: number
  duration: string
  lists: ListId[]
  poster: string
  posterTitle: string
  description: string
}

const movies: Movie[] = [
  { id: 1, title: '花样年华', original: 'In the Mood for Love', year: 2000, country: '中国香港', director: '王家卫', genres: ['剧情', '爱情'], score: 8.8, duration: '98 分钟', lists: ['weekly', 'classic'], poster: 'wong', posterTitle: '花样\n年华', description: '相邻而居的周慕云与苏丽珍，在发现各自伴侣的秘密后逐渐靠近。克制的情感、流动的光影与无法抵达的爱情，共同构成一首关于错过的诗。' },
  { id: 2, title: '教父', original: 'The Godfather', year: 1972, country: '美国', director: '弗朗西斯·福特·科波拉', genres: ['剧情', '犯罪'], score: 9.3, duration: '175 分钟', lists: ['weekly', 'classic'], poster: 'godfather', posterTitle: 'THE\nGODFATHER', description: '一场婚礼拉开柯里昂家族的史诗序幕。权力、忠诚与家庭互相纠缠，迈克尔也从局外人一步步走向父亲留下的阴影。' },
  { id: 3, title: '千与千寻', original: 'Spirited Away', year: 2001, country: '日本', director: '宫崎骏', genres: ['动画', '剧情'], score: 9.4, duration: '125 分钟', lists: ['weekly', 'classic'], poster: 'spirited', posterTitle: '千と\n千尋', description: '误入神灵世界的少女千寻，为了拯救父母开始工作。一次关于成长、名字与记忆的奇妙旅程，也是写给每个孩子和大人的温柔寓言。' },
  { id: 4, title: '星际穿越', original: 'Interstellar', year: 2014, country: '美国 / 英国', director: '克里斯托弗·诺兰', genres: ['科幻', '剧情'], score: 9.4, duration: '169 分钟', lists: ['weekly', 'new'], poster: 'interstellar', posterTitle: 'INTER\nSTELLAR', description: '当沙尘吞噬地球，一群探索者穿越虫洞，为人类寻找新的家园。在宏大的宇宙尺度里，爱成为跨越时间与维度的微弱信号。' },
  { id: 5, title: '寄生虫', original: 'Parasite', year: 2019, country: '韩国', director: '奉俊昊', genres: ['剧情', '犯罪'], score: 8.8, duration: '132 分钟', lists: ['weekly', 'new'], poster: 'parasite', posterTitle: '기생충\nPARASITE', description: '生活在半地下室的一家人，偶然进入富有的朴社长家。两个家庭的生活逐渐交叠，阶层之间看不见的线也开始崩塌。' },
  { id: 6, title: '沙丘 2', original: 'Dune: Part Two', year: 2024, country: '美国 / 加拿大', director: '丹尼斯·维伦纽瓦', genres: ['科幻', '剧情'], score: 8.2, duration: '166 分钟', lists: ['new'], poster: 'dune', posterTitle: 'DUNE\nPART TWO', description: '保罗与契妮和弗雷曼人并肩作战，踏上复仇之路。预言、权力与爱情在厄拉科斯的沙海中碰撞，英雄神话显露出危险的另一面。' },
  { id: 7, title: '坠落的审判', original: 'Anatomy of a Fall', year: 2023, country: '法国', director: '茹斯汀·特里耶', genres: ['剧情', '犯罪'], score: 8.4, duration: '151 分钟', lists: ['new'], poster: 'anatomy', posterTitle: 'ANATOMY\nOF A FALL', description: '一名男子从家中坠亡，妻子成为唯一嫌疑人。审判逐渐从死亡真相转向一段婚姻的内部，事实与叙述之间的边界愈发模糊。' },
  { id: 8, title: '十二怒汉', original: '12 Angry Men', year: 1957, country: '美国', director: '西德尼·吕美特', genres: ['剧情', '犯罪'], score: 9.4, duration: '96 分钟', lists: ['classic'], poster: 'angry', posterTitle: '12\nANGRY MEN', description: '十二名陪审员被关进一间闷热的房间，决定一个少年的生死。一次看似明确的裁决，被一个人的合理怀疑重新打开。' },
]

const listLabels: Record<ListId, string> = { weekly: '本周精选', classic: '影史经典', new: '近年佳作' }

function loadWatchlist(): number[] {
  try {
    return JSON.parse(localStorage.getItem('mujian-watchlist') || '[]')
  } catch {
    return []
  }
}

export function CinemaHome({ onStartTest, onHistory, onExplore }: CinemaHomeProps) {
  const [currentList, setCurrentList] = useState<ListId>('weekly')
  const [genre, setGenre] = useState('全部类型')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [saved, setSaved] = useState<Set<number>>(() => new Set(loadWatchlist()))
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null)
  const [onlySaved, setOnlySaved] = useState(false)

  const visibleMovies = useMemo(() => movies.filter((movie) => {
    const matchesList = onlySaved || movie.lists.includes(currentList)
    const matchesSaved = !onlySaved || saved.has(movie.id)
    const matchesGenre = genre === '全部类型' || movie.genres.includes(genre)
    const haystack = `${movie.title} ${movie.original} ${movie.director} ${movie.genres.join(' ')}`.toLowerCase()
    return matchesList && matchesSaved && matchesGenre && haystack.includes(query.toLowerCase())
  }), [currentList, genre, onlySaved, query, saved])

  const toggleSave = (id: number) => {
    const next = new Set(saved)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSaved(next)
    localStorage.setItem('mujian-watchlist', JSON.stringify([...next]))
  }

  const openList = (list: ListId) => {
    setOnlySaved(false)
    setCurrentList(list)
  }

  return (
    <div className="cinema-home">
      <header className="cinema-header">
        <a className="cinema-brand" href="#top" aria-label="幕间首页"><span className="cinema-brand-mark" />幕间</a>
        <nav className="cinema-nav">
          <a href="#ranking">榜单</a>
          <button onClick={onStartTest}>电影人格</button>
          <a href="#about">关于</a>
        </nav>
        <div className="cinema-actions">
          <button className="cinema-icon-button" onClick={() => setSearchOpen(true)} aria-label="搜索"><Search /></button>
          <button className="watchlist-button" onClick={() => { setOnlySaved(true); document.querySelector('#ranking')?.scrollIntoView() }}>
            我的片单 <span>{saved.size}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="cinema-hero" id="top">
          <div className="cinema-hero-image" />
          <div className="cinema-hero-shade" />
          <div className="cinema-hero-content">
            <p className="cinema-eyebrow">CURATED CINEMA · 2026</p>
            <h1>好电影，<br /><em>值得慢慢遇见。</em></h1>
            <p>从影史经典到当代新作，我们不追逐热度，<br />只寻找那些在灯亮之后，仍留在心里的作品。</p>
            <a className="cinema-primary" href="#ranking">浏览本期榜单 <ArrowRight /></a>
          </div>
          <div className="cinema-feature"><span>01</span><div><small>本周编辑推荐</small><strong>花样年华</strong></div></div>
        </section>

        <section className="cinema-ranking" id="ranking">
          <div className="cinema-section-heading">
            <div><p className="cinema-eyebrow">THE WEEKLY LIST</p><h2>{onlySaved ? '我的片单' : '本周电影榜'}</h2></div>
            <p>每周五更新 · 综合口碑、影史价值与编辑审美</p>
          </div>
          <div className="cinema-toolbar">
            <div className="cinema-tabs">
              {(Object.keys(listLabels) as ListId[]).map((list) => (
                <button key={list} className={!onlySaved && currentList === list ? 'active' : ''} onClick={() => openList(list)}>{listLabels[list]}</button>
              ))}
            </div>
            <select value={genre} onChange={(event) => setGenre(event.target.value)}>
              {['全部类型', '剧情', '爱情', '犯罪', '科幻', '动画'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="cinema-movie-list">
            {visibleMovies.map((movie, index) => (
              <article className="cinema-movie-row" key={movie.id} onClick={() => setActiveMovie(movie)}>
                <span className={`cinema-rank ${index < 3 ? 'top' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                <div className={`cinema-poster poster-${movie.poster}`} data-title={movie.posterTitle} />
                <div className="cinema-movie-title">
                  <h3>{movie.title}</h3><p>{movie.original} · {movie.year}</p>
                  <div>{movie.genres.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
                <div className="cinema-director"><small>导演 / DIRECTOR</small><strong>{movie.director}</strong><p>{movie.country}</p></div>
                <div className="cinema-score"><strong>{movie.score}</strong><small>MUJIAN</small></div>
                <button className={`cinema-save ${saved.has(movie.id) ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); toggleSave(movie.id) }} aria-label="收藏电影"><Bookmark /></button>
              </article>
            ))}
            {!visibleMovies.length && <p className="cinema-empty">{onlySaved ? '片单还是空的，先收藏几部电影吧。' : '没有找到符合条件的电影。'}</p>}
          </div>
        </section>

        <section className="dbti-feature">
          <div className="dbti-orbit" aria-hidden="true"><span>PCOM</span><span>NGAM</span><span>NCAS</span></div>
          <div className="dbti-feature-copy">
            <p className="cinema-eyebrow">DIRECTOR BASED TYPE INDICATOR</p>
            <h2>你的片单，<br />藏着哪一种<em>电影人格？</em></h2>
            <p>16 道关于导演、审美与观影习惯的问题，解码你的电影品味 DNA。不是标准答案，而是一面更有趣的银幕镜子。</p>
            <div className="dbti-feature-actions">
              <button className="cinema-primary" onClick={onStartTest}><Sparkles /> 开始测试 <ArrowRight /></button>
              <button className="cinema-text-button" onClick={onExplore}>查看 16 种人格</button>
              <button className="cinema-text-button" onClick={onHistory}>历史结果</button>
            </div>
          </div>
          <div className="dbti-code">
            <span>DBTI</span><p>D · B · T · I</p><small>约 2 分钟 · 数据仅保存在本地</small>
          </div>
        </section>

        <section className="cinema-manifesto" id="about">
          <p className="cinema-eyebrow">OUR POINT OF VIEW</p>
          <blockquote>“榜单不是答案，<br />而是一场对话的开始。”</blockquote>
          <p>我们相信品味无法被算法完全定义。每一部入选的电影，<br />都经过真实的观看、讨论与时间检验。</p>
        </section>
      </main>

      <footer className="cinema-footer"><span className="cinema-brand"><span className="cinema-brand-mark" />幕间</span><p>在电影与生活之间，留一点幕间。</p><p>© 2026 MUJIAN CINEMA</p></footer>

      {searchOpen && (
        <div className="cinema-search-overlay">
          <button onClick={() => setSearchOpen(false)} aria-label="关闭"><X /></button>
          <p className="cinema-eyebrow">SEARCH THE LIST</p>
          <label htmlFor="movie-search">你想找哪一部电影？</label>
          <input id="movie-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入片名、导演或类型..." />
          <button className="cinema-primary" onClick={() => { setSearchOpen(false); document.querySelector('#ranking')?.scrollIntoView() }}>查看搜索结果 <ArrowRight /></button>
        </div>
      )}

      {activeMovie && (
        <div className="cinema-modal-backdrop" onClick={() => setActiveMovie(null)}>
          <article className="cinema-modal" onClick={(event) => event.stopPropagation()}>
            <button className="cinema-modal-close" onClick={() => setActiveMovie(null)}><X /></button>
            <div className={`cinema-modal-poster poster-${activeMovie.poster}`} />
            <div className="cinema-modal-content">
              <p className="cinema-eyebrow">{activeMovie.year} · {activeMovie.genres.join(' / ')}</p>
              <h2>{activeMovie.title}</h2><p className="cinema-original">{activeMovie.original}</p>
              <p className="cinema-description">{activeMovie.description}</p>
              <dl><div><dt>导演</dt><dd>{activeMovie.director}</dd></div><div><dt>片长</dt><dd>{activeMovie.duration}</dd></div><div><dt>地区</dt><dd>{activeMovie.country}</dd></div><div><dt>幕间评分</dt><dd>{activeMovie.score} / 10</dd></div></dl>
              <button className="cinema-primary cinema-modal-save" onClick={() => toggleSave(activeMovie.id)}>{saved.has(activeMovie.id) ? '已加入我的片单' : '加入我的片单'}</button>
            </div>
          </article>
        </div>
      )}
    </div>
  )
}
