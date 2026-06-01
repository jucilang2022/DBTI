# Cloudflare 部署前端（Workers + 静态资源）

## 构建命令

**Settings → Builds**（不是 Variables and Secrets）：

| 项 | 值 |
|----|-----|
| Build command | `npm run build` |
| **Deploy command** | `npx wrangler deploy` |
| Non-production deploy | 默认 `npx wrangler versions upload` 即可 |

## 环境变量：两个入口，别搞混

| 位置 | 用途 | 纯静态站 |
|------|------|----------|
| **Settings → Builds → Build variables and secrets** | **构建时**（`npm run build` / Vite） | ✅ 在这里配 `VITE_*`、`NODE_VERSION` |
| **Settings → Variables and Secrets** | **运行时** Worker `env` | ❌ 纯静态站无法添加 |

`VITE_API_BASE_URL` 必须在 **Build variables** 里设置，或在仓库根目录使用已提交的 **`.env.production`**（本仓库已包含 Render API 地址）。

推荐 Build variables（Production）：

```
VITE_API_BASE_URL=https://dbti-d7gw.onrender.com
NODE_VERSION=22
```

改完后 **Retry deployment**。Build details 里若仍显示 Environment variables: None，只要 `.env.production` 已 push，构建仍会带上 API 地址。

## SPA 路由

不要用 `public/_redirects` 的 `/* /index.html 200`。使用 `wrangler.jsonc` 里的 `assets.not_found_handling: "single-page-application"`。

## 绑定域名

**Custom domains** → 添加 `dbti.fun` → 按提示改 DNS。
