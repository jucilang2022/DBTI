# 香港单机部署（大陆用户 + 不备案）

## 为什么选这个

| 方案 | 大陆速度 | 备案 |
|------|----------|------|
| 大陆 ECS + 域名 | 最快 | **必须** |
| Cloudflare Pages + 美国 API | 一般偏慢 | 不需要 |
| **香港轻量 + 同域 HTTPS** | **较快、较稳** | **网站不需要大陆备案** |

域名解析到 **香港 IP**，不要解析到 `39.107.99.162`（大陆机会触发备案拦截）。

## 1. 买一台香港机器

- 阿里云：**轻量应用服务器 · 中国香港**
- 或腾讯云：**轻量 · 香港**

建议：1 核 2G 即可。开放安全组 **80、443**。

## 2. DNS

| 类型 | 主机 | 值 |
|------|------|-----|
| A | `@` | 香港公网 IP |
| A | `www` | 同上 |

删除指向大陆 `39.107.99.162` 的 A 记录。

## 3. 服务器上安装

```bash
# Node 20（示例：Ubuntu）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git caddy

sudo mkdir -p /var/www/dbti
sudo chown -R $USER:$USER /var/www/dbti
cd /var/www/dbti
git clone <你的仓库> .
npm ci
npm run build
# 同域部署：不要设置 VITE_API_BASE_URL，前端走 /api 反代

cp deploy/Caddyfile.example /tmp/Caddyfile
sudo cp /tmp/Caddyfile /etc/caddy/Caddyfile
sudo systemctl enable --now caddy
```

## 4. 环境变量与进程

```bash
cd /var/www/dbti
cp .env.example .env
# 编辑 .env 填入 AI_API_KEY

# 用 pm2 保活 API（推荐）
sudo npm i -g pm2
pm2 start npm --name dbti-api -- start
pm2 save
pm2 startup
```

## 5. 验证

- `https://dbti.fun` 能打开
- 做完测试有 AI 锐评
- 手机点「分享」能调起系统菜单

## 6. 大陆 ECS

可关机或释放，主站不再使用。

## 更新版本

```bash
cd /var/www/dbti
git pull
npm ci
npm run build
pm2 restart dbti-api
```
