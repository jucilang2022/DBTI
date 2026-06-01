# 用 Render 免费部署 AI 后端（替代 Railway）

Railway 试用结束后，可用 [Render](https://render.com) 免费 Web Service，无需信用卡（以 Render 当前政策为准）。

## 限制（免费档）

- 约 **15 分钟无访问会休眠**，下次请求要先「唤醒」，可能等 **30～60 秒**
- 个人项目、好友玩玩一般够用

## 部署前：代码必须已 push 到 GitHub

Render 拉的是 **GitHub 上的 main**，不是本机未提交代码。  
若日志里仍是旧 commit（例如没有 `npm start` 的版本），需要先：

```bash
git add package.json server/index.ts src/lib/api-base.ts public/_redirects render.yaml deploy/
git commit -m "chore: add start script and Render deploy config"
git push origin main
```

再在 Render 里 **Manual Deploy → Deploy latest commit**。

## 部署步骤

1. 打开 [render.com](https://render.com)，GitHub 登录。  
2. **Dashboard → New + → Web Service**，连接 **DBTI** 仓库。  
3. 填写：

   | 项 | 值 |
   |----|-----|
   | Name | `dbti-api` |
   | Region | Singapore（离大陆稍近） |
   | Branch | `main` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Plan | **Free** |

4. **Environment** 添加：

   - `AI_API_KEY` = 你的 DeepSeek Key  
   - （可选）`AI_BASE_URL`、`AI_MODEL`

5. 创建后得到地址，例如 `https://dbti-api.onrender.com`。  
6. 浏览器打开 `https://dbti-api.onrender.com/health`，应看到 `{"ok":true}`。

## 绑定 api.dbti.fun

1. Render 该服务 → **Settings → Custom Domains** → 添加 `api.dbti.fun`。  
2. 按提示在 DNS 添加 **CNAME**：`api` → Render 给的 host（如 `dbti-api.onrender.com`）。  
3. 等 SSL 生效（几分钟）。

## 改 Cloudflare Pages

环境变量改为：

```
VITE_API_BASE_URL=https://api.dbti.fun
```

或暂时用 `https://dbti-api.onrender.com`，改完后 **Retry deployment** 重新构建。

## 其他免费替代

- [Zeabur](https://zeabur.com)（国内常用，有免费额度）  
- [Fly.io](https://fly.io)（需 CLI，有免费额度）
