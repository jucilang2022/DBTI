# Cloudflare Pages 部署前端（静态站）

## 正确配置（不要用 Wrangler 当 Deploy command）

在 Pages 项目 → **Settings → Build**：

| 项 | 填什么 |
|----|--------|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| **Deploy command** | **留空**（不要填 `npx wrangler deploy`） |

环境变量（Production）：

```
VITE_API_BASE_URL=https://dbti-d7gw.onrender.com
NODE_VERSION=20
```

保存后 **Retry deployment**。

## 单页应用路由（刷新不 404）

**Settings → Functions** 或项目概览里打开 **Single Page Application (SPA)** / **处理单页应用程序**（有则勾选）。

不要用 `public/_redirects` 里的 `/* /index.html 200`，会和 Wrangler 冲突导致部署失败。

## 绑定域名

**Custom domains** → 添加 `dbti.fun` → 按提示改 DNS（CNAME 到 `xxx.pages.dev`）。
