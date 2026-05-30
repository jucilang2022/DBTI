# 🎬 DBTI — 导演人格测试

> **D**irector **B**ased **T**ype **I**ndicator

10 道题，找到你的导演人格。从张艺谋到诺兰，从库布里克到是枝裕和——每一道题都在揭示你的电影品味 DNA。

## ✨ 功能

- **55 位中外导演**：华语、日本、欧美、欧洲及亚洲艺术导演全覆盖
- **12 型 DBTI 人格**：通过 vibe 标签匹配算法，从银幕诗人到纯粹迷影
- **智能分析**：品味光谱条形图、人格解析、精神导演推荐
- **答题回顾**：完成后可查看每道题的选择
- **分享卡片**：Canvas 生成精美结果图，支持下载
- **历史记录**：自动保存过往测试结果，支持查看统计分布
- **全人格探索**：浏览 12 种 DBTI 人格的详细介绍

## 🛠️ 技术栈

- **React 19** + **TypeScript**
- **Vite** 构建
- **Tailwind CSS v4** 样式
- **Framer Motion** 动效
- **Canvas** 分享卡片渲染

## 🚀 快速开始

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 📦 项目结构

```
src/
├── data/
│   ├── directors.ts      # 55位导演数据库
│   ├── dbti-types.ts     # 12型 DBTI 人格
│   └── quiz-analyzer.ts  # 分析引擎
├── components/
│   ├── StartScreen.tsx   # 首页
│   ├── Quiz.tsx          # 答题流程
│   ├── QuestionCard.tsx  # 题目卡片
│   ├── Result.tsx        # 结果页
│   ├── TasteBar.tsx      # 品味光谱
│   ├── ShareCard.tsx     # 分享卡片
│   ├── DirectorDetail.tsx # 导演详情
│   ├── HistoryPage.tsx   # 历史记录
│   └── TypeExplorer.tsx  # 人格全览
├── lib/
│   └── utils.ts
├── types.ts
├── App.tsx
└── main.tsx
```

## 🧑‍🎨 DBTI 12 型

| 类型 | 英文名 | 核心标签 |
|------|--------|----------|
| 银幕诗人 | Screen Poet | 诗意、唯美、文艺 |
| 叙事工匠 | Story Craftsman | 叙事、结构、情节 |
| 视觉猎手 | Visual Hunter | 视觉、镜头、构图 |
| 现实之眼 | Eye of Reality | 现实、社会、记录 |
| 商业巨匠 | Blockbuster Maestro | 商业、大众、类型 |
| 冷门猎手 | Rarity Hunter | 小众、冷门、遗珠 |
| 古典传承 | Classic Heir | 古典、传统、大师 |
| 反叛先锋 | Rebel Vanguard | 反叛、突破、颠覆 |
| 荒诞行者 | Absurd Walker | 荒诞、黑色、讽刺 |
| 情感捕手 | Emotion Catcher | 情感、温情、共鸣 |
| 类型通吃 | Genre Master | 动作、娱乐、类型 |
| 纯粹迷影 | Pure Cinephile | 大师、多元、突破 |

## 📸 截图

（运行 `npm run dev` 后本地查看）
