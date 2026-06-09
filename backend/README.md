# 刷题项目后端 · Cloudflare Workers + D1

零月租、全球边缘节点、5 GB 数据库免费额度。

## 🎉 当前部署状态

- **生产 URL**：`https://api.comun.store`
- **D1 数据库**：`question` (`c9e0f00e-b817-4b0c-82ca-47f6ef6b809c`)
- **Worker 名**：`quiz-rank-backend`
- **Account ID**：`6532ce5835b337176da8d0c86f761a04`

后续要重新部署只需：
```bash
cd backend
export CLOUDFLARE_API_TOKEN="你的 token"
npx wrangler deploy
```

实时日志：
```bash
npx wrangler tail
```

---

## 一键部署（10 分钟）

### 准备：注册 Cloudflare（免费）

1. 打开 https://dash.cloudflare.com/sign-up 注册账号（用邮箱即可，无需信用卡）
2. 验证邮箱

### 步骤 1：安装 wrangler

```bash
cd backend
npm install            # 安装本地依赖
npx wrangler login     # 弹出浏览器登录授权
```

### 步骤 2：创建 D1 数据库

```bash
npx wrangler d1 create quiz-db
```

你会看到类似输出：
```toml
[[d1_databases]]
binding = "DB"
database_name = "quiz-db"
database_id = "xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

把 `database_id` 复制，**粘贴到 `wrangler.toml` 的对应行**，覆盖 `REPLACE_WITH_YOUR_D1_DATABASE_ID`。

### 步骤 3：初始化数据库表结构

```bash
npm run init-db        # 远程 D1 执行 schema.sql
```

应该看到 `🌀 Executing on remote database ... ✅ Executed N queries`。

### 步骤 4：设置管理密码（不要直接写在 wrangler.toml 里）

```bash
npx wrangler secret put ADMIN_PASSWORD
# 提示输入时，敲你想要的密码（默认 6666 不安全，建议改一个）
```

### 步骤 5：部署

```bash
npm run deploy
```

部署成功后会输出公网 URL，类似：
```
https://quiz-rank-backend.YOUR-SUBDOMAIN.workers.dev
```

### 步骤 6：把这个 URL 告诉前端

回到项目根目录，编辑 `config.js`：

```js
window.API_BASE = "https://quiz-rank-backend.YOUR-SUBDOMAIN.workers.dev";
```

刷新 `comun.store`，DevTools Network 面板里的 `/api/track`、`/api/leaderboard` 都应该返回 200。

---

## 自检 curl 命令

把下面的 `$BASE` 改成你的 Workers URL：

```bash
BASE="https://quiz-rank-backend.YOUR-SUBDOMAIN.workers.dev"

# 健康检查
curl "$BASE/"

# 上报访问
curl -X POST "$BASE/api/track" \
  -H "Content-Type: application/json" \
  -d '{"fp":"fp-test-001","page":"首页"}'

# 上报答题
curl -X POST "$BASE/api/track-answer" \
  -H "Content-Type: application/json" \
  -d '{"fp":"fp-test-001","qid":"os-ch1-001"}'

# 查看排行榜（公开）
curl "$BASE/api/leaderboard"

# 登录拿 token
curl -X POST "$BASE/api/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"你设置的密码"}'

# 用 token 查后台统计
curl "$BASE/api/stats" \
  -H "Authorization: Bearer 上一步返回的 token"
```

---

## 本地开发（不部署到云上）

```bash
cd backend
npm run init-db-local  # 初始化本地 D1
npm run dev            # 启动本地 Worker，监听 http://localhost:8787
```

此时设置 `config.js` 为：
```js
window.API_BASE = "http://localhost:8787";
```

并在项目根目录另起一个进程：
```bash
node server.js         # 静态服务，依然在 3000 端口
```

浏览器打开 `http://localhost:3000`，API 自动打到 8787 端口。

---

## 实时日志

```bash
npm run tail
```

会持续输出生产环境的请求日志，调试很方便。

---

## 上线后的安全收紧

编辑 `wrangler.toml`，把允许的来源域名限定：
```toml
[vars]
ALLOW_ORIGIN = "https://comun.store"
```
然后 `npm run deploy` 重新发布。

---

## 配额（永远用不完的额度）

| 项目 | 免费额度 | 你的预估用量 |
|---|---|---|
| Worker 请求 | 10 万/天 | < 1 万/天 |
| Worker CPU | 10 ms/请求 | 1-2 ms |
| D1 读 | 500 万行/天 | < 1 万 |
| D1 写 | 10 万行/天 | < 1 千 |
| D1 存储 | 5 GB | < 100 MB |

每月总成本：**¥0**
