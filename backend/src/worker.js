// Cloudflare Worker —— 刷题项目后端
// 复刻 server.js 的全部 5 个 API：login / track / track-answer / stats / leaderboard
//
// 部署前请确保已绑定：
//   - D1 数据库（binding 名：DB）
//   - 环境变量 ADMIN_PASSWORD（默认 6666）
//   - 可选环境变量 ALLOW_ORIGIN（默认 *）

const MAX_VISITS = 50000;
const MAX_ANSWERS = 200000;

// ============ 工具 ============

function corsHeaders(env, request) {
  const allowed = (env.ALLOW_ORIGIN || "*").split(",").map(s => s.trim());
  const origin = (request && request.headers.get("origin")) || "";
  let allow = "*";
  if (!allowed.includes("*")) {
    allow = allowed.includes(origin) ? origin : allowed[0];
  }
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(data, status, env, request) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(env, request) },
  });
}

function getClientIP(request) {
  return request.headers.get("cf-connecting-ip")
      || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || "";
}

function parseUA(ua) {
  if (!ua) return "未知";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iPhone/iPad";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  return ua.length > 30 ? ua.slice(0, 30) + "…" : ua;
}

function getLocationLabel(ip) {
  if (!ip) return "";
  if (/^104\.238\.220\./.test(ip)) return "杉达学生";
  return "";
}

function getTag(ts) {
  const h = new Date(ts + 8 * 3600 * 1000).getUTCHours(); // 北京时间
  if (h >= 0 && h < 6) return "卷王";
  return "";
}

function getTodayRangeBeijing() {
  // 北京时区当天 0 点的时间戳
  const now = Date.now();
  const beijingOffset = 8 * 3600 * 1000;
  const dayStart = Math.floor((now + beijingOffset) / 86400000) * 86400000 - beijingOffset;
  return { start: dayStart, end: dayStart + 86400000 };
}

// ============ 业务：写入访问 ============

async function trackVisit(env, request) {
  const body = await request.json().catch(() => ({}));
  const { fp, page, referrer } = body;
  const ip = getClientIP(request);
  const ts = Date.now();
  const ua = request.headers.get("user-agent") || "";

  await env.DB.prepare(`
    INSERT INTO visits (ts, ip, ua, ua_info, fp, page, referrer, location, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    ts, ip, ua, parseUA(ua),
    fp || `anon-${ts}`,
    page || "首页",
    referrer || "",
    getLocationLabel(ip),
    getTag(ts)
  ).run();

  // 异步清理超量数据（不阻塞响应）
  // D1 不支持真后台任务，每 100 次写入触发一次清理
  if (Math.floor(ts / 1000) % 100 === 0) {
    await env.DB.prepare(`
      DELETE FROM visits WHERE id IN (
        SELECT id FROM visits ORDER BY id DESC LIMIT -1 OFFSET ?
      )
    `).bind(MAX_VISITS).run().catch(() => {});
  }

  return json({ ok: true }, 200, env, request);
}

// ============ 业务：写入答题（去重） ============

async function trackAnswer(env, request) {
  const body = await request.json().catch(() => ({}));
  const { fp, qid } = body;
  if (!fp || !qid) return json({ error: "missing fp or qid" }, 400, env, request);

  // UNIQUE(fp, qid) 已在表上保证去重，重复 INSERT 会被忽略
  await env.DB.prepare(`
    INSERT OR IGNORE INTO answers (fp, qid, ts) VALUES (?, ?, ?)
  `).bind(fp, qid, Date.now()).run();

  return json({ ok: true }, 200, env, request);
}

// ============ 业务：登录 ============

async function login(env, request) {
  const body = await request.json().catch(() => ({}));
  const password = body.password;
  const adminPwd = env.ADMIN_PASSWORD || "6666";
  if (password !== adminPwd) return json({ ok: false }, 401, env, request);

  // 简化:token = 密码哈希，每个 admin 接口验证时重算
  // 单管理员场景下与原 server.js 的内存 token 安全等级一致（HTTPS 保护下的 Bearer）
  const token = await sha256Hex(adminPwd + ":quiz-rank");
  return json({ ok: true, token }, 200, env, request);
}

async function isAdmin(env, request) {
  const adminPwd = env.ADMIN_PASSWORD || "6666";
  const expected = await sha256Hex(adminPwd + ":quiz-rank");
  const got = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return got === expected;
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// ============ 业务：管理端统计 ============

async function getStats(env) {
  const { start, end } = getTodayRangeBeijing();

  // 今日 PV / UV
  const todayRow = await env.DB.prepare(`
    SELECT COUNT(*) AS pv, COUNT(DISTINCT fp) AS uv
    FROM visits WHERE ts >= ? AND ts < ?
  `).bind(start, end).first();

  // 历史 PV / UV
  const totalRow = await env.DB.prepare(`
    SELECT COUNT(*) AS pv, COUNT(DISTINCT fp) AS uv FROM visits
  `).first();

  // 今日页面排行
  const pageRankRows = await env.DB.prepare(`
    SELECT page, COUNT(*) AS count FROM visits
    WHERE ts >= ? AND ts < ?
    GROUP BY page ORDER BY count DESC LIMIT 10
  `).bind(start, end).all();

  // 最近访问
  const recentRows = await env.DB.prepare(`
    SELECT ts, page, ua_info AS device, ip, location, tags
    FROM visits WHERE ts >= ? AND ts < ?
    ORDER BY ts DESC LIMIT 20
  `).bind(start, end).all();

  const recent = (recentRows.results || []).map(r => ({
    time: new Date(r.ts + 8 * 3600 * 1000).toISOString().substring(11, 16),
    page: r.page,
    device: r.device || "未知",
    location: r.location || r.ip || "未知",
    tags: r.tags || "",
  }));

  // 近 7 天趋势
  const weekly = [];
  for (let i = 6; i >= 0; i--) {
    const ds = start - i * 86400000;
    const de = ds + 86400000;
    const row = await env.DB.prepare(`
      SELECT COUNT(*) AS pv, COUNT(DISTINCT fp) AS uv
      FROM visits WHERE ts >= ? AND ts < ?
    `).bind(ds, de).first();
    const d = new Date(ds + 8 * 3600 * 1000);
    weekly.push({
      day: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`,
      uv: row?.uv || 0,
      pv: row?.pv || 0,
    });
  }

  return {
    todayUV: todayRow?.uv || 0,
    todayPV: todayRow?.pv || 0,
    totalUV: totalRow?.uv || 0,
    totalPV: totalRow?.pv || 0,
    pageRank: (pageRankRows.results || []).map(r => ({ page: r.page, count: r.count })),
    recent,
    weekly,
  };
}

// ============ 业务：排行榜 ============

async function getLeaderboard(env) {
  const rows = await env.DB.prepare(`
    SELECT fp, COUNT(DISTINCT qid) AS count, MAX(ts) AS lastTs
    FROM answers GROUP BY fp ORDER BY count DESC LIMIT 50
  `).all();
  return (rows.results || []).map(r => ({
    fp: r.fp,
    count: r.count,
    lastTs: r.lastTs,
  }));
}

// ============ 路由分发 ============

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    // CORS 预检
    if (method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(env, request) });

    try {
      if (method === "POST" && path === "/api/login")         return await login(env, request);
      if (method === "POST" && path === "/api/track")         return await trackVisit(env, request);
      if (method === "POST" && path === "/api/track-answer")  return await trackAnswer(env, request);

      if (method === "GET" && path === "/api/stats") {
        if (!(await isAdmin(env, request))) return json({ error: "Unauthorized" }, 401, env, request);
        return json(await getStats(env), 200, env, request);
      }
      if (method === "GET" && path === "/api/leaderboard") {
        return json(await getLeaderboard(env), 200, env, request);
      }
      if (method === "GET" && path === "/") {
        return json({ ok: true, service: "quiz-rank-backend", time: Date.now() }, 200, env, request);
      }

      return json({ error: "Not Found", path }, 404, env, request);
    } catch (err) {
      console.error(err);
      return json({ error: String(err.message || err) }, 500, env, request);
    }
  },
};
