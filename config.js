// 前端 API 配置 —— 一处改，全站生效
//
// 本地开发（用 server.js）   ：window.API_BASE = ""
// 部署到 Cloudflare Workers ：window.API_BASE = "https://api.comun.store"
//
// 留空表示走同源（即 Nginx 反代或 server.js）

window.API_BASE = "https://api.comun.store";
