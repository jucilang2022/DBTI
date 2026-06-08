import { ArrowDown, ArrowRight, Clock3, Compass, Grid2X2, MessageCircle, Sparkles, UserRound } from 'lucide-react'

interface CinemaHomeProps {
  onStartTest: () => void
  onHistory: () => void
  onExplore: () => void
  onProfile: () => void
  onPrompt: () => void
  onMatch: () => void
}

export function CinemaHome({ onStartTest, onHistory, onExplore, onProfile, onPrompt, onMatch }: CinemaHomeProps) {
  return (
    <div className="cinema-home">
      <header className="cinema-header">
        <a className="cinema-brand" href="#top" aria-label="幕间首页">
          <span className="cinema-brand-mark" />
          幕间
        </a>

        <nav className="cinema-nav" aria-label="主导航">
          <a href="#top">首页</a>
          <button onClick={onStartTest}>DBTI 测试</button>
          <a href="#cinema-life">影迷空间</a>
        </nav>

        <button className="header-test-button" onClick={onStartTest}>
          开始测试
          <ArrowRight />
        </button>
      </header>

      <main>
        <section className="cinema-hero" id="top">
          <div className="cinema-hero-image" />
          <div className="cinema-hero-shade" />

          <div className="cinema-hero-content">
            <p className="cinema-eyebrow">A PLACE FOR CINEPHILES</p>
            <h1>
              在电影与生活之间，
              <br />
              <em>留一点幕间。</em>
            </h1>
            <p className="cinema-hero-copy">
              这里属于每一个认真看电影的人。
              <br />
              从认识自己的观影品味开始，慢慢建立属于你的银幕世界。
            </p>
            <div className="hero-actions">
              <button className="cinema-primary" onClick={onStartTest}>
                测测我的电影人格
                <ArrowRight />
              </button>
              <a className="cinema-secondary-link" href="#dbti">
                了解 DBTI
                <ArrowDown />
              </a>
            </div>
          </div>

          <div className="hero-aside">
            <span>NOW SHOWING</span>
            <strong>DBTI 电影人格测试</strong>
            <small>16 道题 · 约 2 分钟</small>
          </div>
        </section>

        <section className="dbti-feature" id="dbti">
          <div className="dbti-orbit" aria-hidden="true">
            <span>PCOM</span>
            <span>NGAM</span>
            <span>NCAS</span>
          </div>

          <div className="dbti-feature-copy">
            <p className="cinema-eyebrow">DIRECTOR BASED TYPE INDICATOR</p>
            <h2>
              你的选择，
              <br />
              藏着哪一种<em>电影人格？</em>
            </h2>
            <p>
              DBTI 从导演偏好、审美判断、价值取向与观影习惯出发，
              用 16 道题描绘你的电影品味。它不是标准答案，而是一面更有趣的银幕镜子。
            </p>

            <div className="dbti-stats">
              <div><strong>16</strong><span>电影人格</span></div>
              <div><strong>55</strong><span>中外导演</span></div>
              <div><strong>4</strong><span>品味维度</span></div>
            </div>

            <div className="dbti-feature-actions">
              <button className="cinema-primary" onClick={onStartTest}>
                <Sparkles />
                开始测试
                <ArrowRight />
              </button>
              <button className="cinema-text-button" onClick={onExplore}>
                <Grid2X2 />
                查看全部人格
              </button>
              <button className="cinema-text-button" onClick={onHistory}>
                <Clock3 />
                历史结果
              </button>
            </div>
          </div>

          <div className="dbti-code">
            <span>DBTI</span>
            <p>D · B · T · I</p>
            <small>结果仅供娱乐 · 数据保存在本地</small>
          </div>
        </section>

        <section className="cinema-life" id="cinema-life">
          <div className="cinema-life-heading">
            <div>
              <p className="cinema-eyebrow">YOUR CINEMA LIFE</p>
              <h2>测试只是开场，<br /><em>真正的故事在散场以后。</em></h2>
            </div>
            <p>
              建立你的银幕身份，回答只属于影迷的问题，
              再遇见那些与你相似、或恰好完全不同的人。
            </p>
          </div>

          <div className="cinema-life-grid">
            <button className="cinema-life-card featured" onClick={onProfile}>
              <span className="cinema-life-number">01</span>
              <UserRound />
              <div>
                <small>MY SCREEN IDENTITY</small>
                <h3>电影人格主页</h3>
                <p>把测试结果变成长期身份，收藏塑造你的电影与审美坐标。</p>
              </div>
              <ArrowRight />
            </button>

            <button className="cinema-life-card" onClick={onPrompt}>
              <span className="cinema-life-number">02</span>
              <MessageCircle />
              <div>
                <small>DAILY QUESTION</small>
                <h3>今日电影命题</h3>
                <p>不写标准影评，只说电影曾经如何穿过你的生活。</p>
              </div>
              <ArrowRight />
            </button>

            <button className="cinema-life-card" onClick={onMatch}>
              <span className="cinema-life-number">03</span>
              <Compass />
              <div>
                <small>SOULMATE SCREENING</small>
                <h3>灵魂影友匹配</h3>
                <p>寻找同类、镜像与引路人，看看你们会为哪部电影争论。</p>
              </div>
              <ArrowRight />
            </button>
          </div>
        </section>

        <section className="cinema-manifesto">
          <p className="cinema-eyebrow">THIS IS JUST THE BEGINNING</p>
          <blockquote>
            “电影不只是一份片单，
            <br />
            也是我们理解世界的方式。”
          </blockquote>
          <p>幕间仍在生长。这里不只保存看过的电影，也保存电影留下的你。</p>
        </section>
      </main>

      <footer className="cinema-footer">
        <span className="cinema-brand"><span className="cinema-brand-mark" />幕间</span>
        <p>为影迷，也为每一个被电影打动的人。</p>
        <p>© 2026 MUJIAN CINEMA</p>
      </footer>
    </div>
  )
}
