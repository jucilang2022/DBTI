# Cloudflare 部署前端

## 面板里怎么填（Deploy command 必填时）

**Settings → Build**：

| 项 | 值 |
|----|-----|
| Build command | `npm run build` |
| Build output directory | `dist`（仅展示用；实际以 Wrangler 为准） |
| **Deploy command** | `npx wrangler deploy` |

环境变量（Production）：

```
VITE_API_BASE_URL=https://dbti-d7gw.onrender.com
NODE_VERSION=22
```

Wrangler 4.86+ 要求 **Node.js ≥ 22**；若 Deploy 报版本错误，请把 `NODE_VERSION` 设为 `22`（与仓库 `.node-version` 一致）。

保存后 **Retry deployment**。

## 为什么不用 `_redirects`

不要加 `public/_redirects` 里的 `/* /index.html 200`。  
SPA 路由由仓库根目录 `wrangler.jsonc` 的 `assets.not_found_handling: "single-page-application"` 处理；再加 `_redirects` 会和 Wrangler 冲突，报 **Infinite loop (100324)**。

## 本地验证

```bash
npm install
npm run build
npx wrangler deploy
```

## 绑定域名

**Custom domains** → 添加 `dbti.fun` → 按提示改 DNS（CNAME 到 `xxx.pages.dev` 或 Workers 域名）。
