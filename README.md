# 🎬 DBTI — 电影人格测试

> **D**irector **B**ased **T**ype **I**ndicator

16 道题，找到你的电影人格。涵盖导演作品、导演对比、价值观、情景与自我认知五种题型，本地算法判定类型，AI 根据答题记录生成解读文案。

## ✨ 功能

- **55 位中外导演**：华语、日本、欧美、欧洲及亚洲艺术导演全覆盖
- **16 型 DBTI 人格**：四维字母编码（P/N · C/G · O/A · M/S），如 PCOM、NGAM
- **混合题型答题**：每次测试随机抽取 16 题（4 导演作品 + 2 导演对比 + 3 价值观 + 4 情景 + 3 自我认知），顺序完全随机
- **本地算法 + AI 文案**：本地算法根据答题统计判定最终 DBTI 类型；AI 基于同一类型与答题记录生成锐评、解读与片单推荐
- **智能分析**：答题倾向条形图、人格解析、精神导演推荐
- **答题回顾**：完成后可查看每道题的选择
- **分享卡片**：Canvas 生成结果图，支持下载
- **历史记录**：自动保存过往测试结果，支持查看统计分布
- **全人格探索**：浏览 16 种 DBTI 人格的详细介绍

## 🛠️ 技术栈

- **React 19** + **TypeScript**
- **Vite** 构建
- **Tailwind CSS v4** 样式
- **Framer Motion** 动效
- **Express** AI 分析后端（DeepSeek API）
- **Canvas** 分享卡片渲染

## 🚀 快速开始

```bash
npm install
```

本地开发（前端 + AI 后端）：

```bash
# 终端 1：前端
npm run dev

# 终端 2：AI 后端（需配置 .env 中的 API Key）
npm run dev:server
```

前端默认运行在 `http://localhost:5173`，AI 后端运行在 `http://localhost:3099`，开发模式下 Vite 会自动代理 `/api` 请求。

构建生产版本：

```bash
npm run build
```

## 📦 项目结构

```
src/
├── api/
│   └── analyze.ts          # AI 分析请求 + 本地兜底
├── data/
│   ├── directors.ts        # 55 位导演数据库
│   ├── dbti-types.ts       # 16 型 DBTI 人格
│   ├── quiz-analyzer.ts    # 本地维度分析引擎
│   ├── value-questions.ts  # 价值观题
│   ├── director_compare_questions.ts
│   ├── scenario_questions.ts
│   └── self_cognition_questions.ts
├── components/
│   ├── StartScreen.tsx     # 首页
│   ├── Quiz.tsx            # 答题流程
│   ├── Result.tsx          # 结果页
│   ├── ShareCard.tsx       # 分享卡片
│   ├── HistoryPage.tsx     # 历史记录
│   └── TypeExplorer.tsx    # 人格全览
server/
└── index.ts                # AI 分析 API 服务
```

## 🧠 分析逻辑

- **最终人格类型**：由本地算法 v5 根据 16 题答题统计判定（题型加权 + 归一化维度匹配）
- **AI 职责**：接收本地判定的类型与完整答题记录，生成 matchReason / roast / recommendations 文案；AI 不可用时仍展示本地类型，只是没有 AI 文案
- **本地算法 v5**：
  - 各题型按权重累加维度分（价值观/情景/自我认知 1.35–1.4，导演对比 1.15，导演作品 0.55）
  - **类型判定以 12 道行为题为主**，导演作品题主要影响剖面图与覆盖率
  - 对 16 型计算归一化契合度（每维 -1~+1），取得分最高者，避免单维堆叠锁死某一型
- **四维答题倾向**：始终由全量加权分统计，展示为条形图
- 四维答题倾向条形图与最终类型均来自同一本地算法结果

本地模拟（5 万次随机答题）下，16 型出现率约在 **3.4%–9.2%** 之间（均匀理想值为 6.25%），最高/最低比约 **2.5×–2.7×**，四维边际比例均接近 50/50。运行 `npm run simulate` 可复现。

## 🧑‍🎨 DBTI 16 型

人格类型以四维字母编码命名，例如：

| 编码 | 名称 | 维度含义 |
|------|------|----------|
| PCOM | 奥斯卡风向标 | 大众 · 经典 · 正统 · 核心影迷 |
| NGAM | B级片挖掘机 | 特色 · 争议 · 独到 · 核心影迷 |

完整 16 型可在应用内「全部人格」页面浏览。

## 📸 截图

（运行 `npm run dev` 后本地查看）

## 📤 分享与 HTTPS

系统分享（Web Share API）**仅在安全上下文**可用：`https://` 或 `http://localhost`。

若站点是 **`http://39.107.99.162` 这类纯 IP + HTTP**，浏览器**不会**提供 `navigator.share`（与 localhost 开发不同）。此时应用会自动改为 **「保存图片」+「复制」**，不是代码 bug。

要恢复手机「分享」菜单，需要任选其一：

1. **绑定域名 + HTTPS**（推荐）：例如 `dbti.example.com` 指向服务器，用 Nginx/Caddy + Let's Encrypt 免费证书。
2. **免费动态域名**：如 [DuckDNS](https://www.duckdns.org/) 等，再配 Caddy 自动 HTTPS。
3. **Cloudflare Tunnel**：无公网证书也能得到 `https://xxx.trycloudflare.com` 类 HTTPS 地址。

Let's Encrypt **一般不给纯 IP 签发证书**，所以仅有 IP 时很难做到标准 HTTPS。

## ☁️ 推荐：方案 B（免费 · 不备案 · HTTPS）

**不买服务器**时用这套：前端 **Cloudflare Pages**（免费），AI 后端 **Render** 等免费托管（Railway 试用结束可换 Render）。

| 项目 | 费用 |
|------|------|
| Cloudflare Pages | 免费 |
| Render Web Service | 免费档（会休眠，首请求可能较慢） |
| 域名 dbti.fun | 你已有 |

架构：

- **dbti.fun** → Cloudflare Pages（静态站 + 自动 HTTPS + 系统分享）
- **api.dbti.fun** → Render（`npm start`，挂 DeepSeek Key）

大陆访问：多数情况**能打开**，偶发偏慢；AI 超时则会**降级为本地结果**（无锐评，类型仍有）。若以后要更快且愿付费，可看下方「香港单机」。

**阿里云大陆 ECS（39.107.99.162）可关机**，域名不要再用 A 记录指过去。

### 快速清单

1. 代码在 **GitHub**
2. **Render** 部署 API → 环境变量 `AI_API_KEY` → 绑定 `api.dbti.fun`（见 [deploy/render-api.md](deploy/render-api.md)）
3. **Cloudflare Pages** 部署 → 环境变量 `VITE_API_BASE_URL=https://api.dbti.fun` → 绑定 `dbti.fun`
4. DNS 删掉指向 `39.107.99.162` 的 A 记录，改成 Pages / Render 的 CNAME

---

## 方案 B 详细步骤

架构：**dbti.fun** → Cloudflare Pages  
**api.dbti.fun** → Render 等（无需 ICP 备案）

### 第一步：代码推送到 GitHub

确保仓库在 GitHub（Cloudflare Pages / Render 都从 Git 拉代码）。

### 第二步：部署 AI 后端（Render 免费档）

Railway 试用结束后请改用 **Render**，完整图文见 **[deploy/render-api.md](deploy/render-api.md)**。

简要步骤：

1. [render.com](https://render.com) → **New Web Service** → 连 GitHub 仓库。  
2. **Build**：`npm install` · **Start**：`npm start` · **Plan**：Free · **Region**：Singapore。  
3. 环境变量：`AI_API_KEY`（必填）。  
4. 访问 `https://你的服务名.onrender.com/health` 应返回 `{"ok":true}`。  
5. Render 里绑自定义域名 **api.dbti.fun**，DNS 加 CNAME `api` → Render 提示的目标。

> 免费档会休眠，久未访问后第一次 AI 分析可能要等半分钟唤醒。也可试 [Zeabur](https://zeabur.com) 免费额度。

### 第三步：部署前端（Cloudflare Pages）

详细说明见 **[deploy/cloudflare-pages.md](deploy/cloudflare-pages.md)**。

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。  
2. 选仓库，构建设置：

   | 项 | 值 |
   |----|-----|
   | Framework preset | None 或 Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | **Deploy command** | `npx wrangler deploy`（若面板标为必填则填此项） |
   | Node version | `22`（Environment variables 里设 `NODE_VERSION=22`，Wrangler 部署需要） |

3. **Environment variables**（Production）：

   ```
   VITE_API_BASE_URL=https://api.dbti.fun
   ```

   若 API 还没绑域名，可暂时填 Render 的 `https://xxx.onrender.com`（不要末尾 `/`）。

4. 保存并 **Deploy**。首次构建约 1～3 分钟。

5. **Custom domains** → 添加 **dbti.fun** 和 **www.dbti.fun**。  
   Cloudflare 会提示把 DNS 从「A 记录 → 39.107.99.162」改成 **CNAME 到 `xxx.pages.dev`**（根域名用 CNAME 扁平化，在 Cloudflare DNS 里一键即可）。

6. 打开 `https://dbti.fun`，完成一次测试，看 AI 锐评是否出现。

### 第四步：DNS 对照（在 Cloudflare DNS 里）

| 类型 | 名称 | 内容 | 说明 |
|------|------|------|------|
| CNAME | `@` | `dbti.pages.dev`（Pages 提供的） | 网站 |
| CNAME | `www` | `dbti.pages.dev` | 可选 |
| CNAME | `api` | `xxxx.onrender.com`（Render 提供） | AI 接口 |

**删掉** 原来指向 `39.107.99.162` 的 A 记录（否则还会走国内机 + 备案拦截）。

国内那台 ECS 可以只当备用，或关机省钱。

### 常见问题

- **页面能开，没有 AI 文案**：检查 `VITE_API_BASE_URL` 是否配对、改完后要在 Pages 里 **Retry deployment** 重新构建。  
- **浏览器报 CORS**：后端已 `cors()` 全开放；若仍报错，确认 API 地址是 `https` 且域名无误。  
- **系统分享**：`https://dbti.fun` 下会自动可用「分享」按钮。  
- **混合内容**：前端必须 HTTPS，API 也必须 HTTPS（Render / 自定义域名均满足）。  
- **AI 很慢或没有锐评**：Render 免费档可能正在休眠，等一会重试；或检查 `AI_API_KEY`。

### 本地对照生产

```bash
# 模拟生产 API 地址
VITE_API_BASE_URL=https://api.dbti.fun npm run build
npm run preview
```

## 🇭🇰 可选：香港单机（付费，大陆更快）

约几十元/月，前后端一台香港轻量，适合「大陆用户为主且不想备案但介意速度」。见 **[deploy/hk-server.md](deploy/hk-server.md)**。

## 🔜 待优化

- 生产环境 CORS 白名单（`CORS_ORIGIN`）
