import { ArrowDown, ArrowRight, Clock3, Grid2X2, Sparkles } from 'lucide-react'

interface CinemaHomeProps {
  onStartTest: () => void
  onHistory: () => void
  onExplore: () => void
}

export function CinemaHome({ onStartTest, onHistory, onExplore }: CinemaHomeProps) {
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
          <button onClick={onExplore}>人格全览</button>
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

        <section className="cinema-manifesto">
          <p className="cinema-eyebrow">THIS IS JUST THE BEGINNING</p>
          <blockquote>
            “电影不只是一份片单，
            <br />
            也是我们理解世界的方式。”
          </blockquote>
          <p>幕间仍在生长。现在，从认识你的电影人格开始。</p>
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
