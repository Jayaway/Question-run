const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.join(__dirname, "visit-data.json");
const ANSWER_FILE = path.join(__dirname, "answer-data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "6666";
const adminTokens = new Set();

function loadData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return { visits: [] }; }
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function loadAnswers() {
  try { return JSON.parse(fs.readFileSync(ANSWER_FILE, "utf8")); }
  catch { return { answers: [] }; }
}
function saveAnswers(data) {
  fs.writeFileSync(ANSWER_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getLeaderboard(answers) {
  const userMap = {};
  const seen = new Set();
  answers.forEach(a => {
    const key = `${a.fp}::${a.qid}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (!userMap[a.fp]) userMap[a.fp] = { fp: a.fp, count: 0, lastTs: 0 };
    userMap[a.fp].count++;
    if (a.ts > userMap[a.fp].lastTs) userMap[a.fp].lastTs = a.ts;
  });
  return Object.values(userMap).sort((a, b) => b.count - a.count).slice(0, 50);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function getClientIP(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "";
}

function parseReferrer(ref) {
  if (!ref) return "直接访问";
  try { return new URL(ref).pathname || "/"; }
  catch { return ref; }
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return { start, end: start + 86400000 };
}

function getLocationLabel(ip) {
  if (!ip) return '';
  if (/^104\.238\.220\./.test(ip)) return '杉达学生';
  return '';
}

function getTag(ts) {
  const h = new Date(ts).getHours();
  if (h >= 0 && h < 6) return '卷王';
  return '';
}

function getStats(visits) {
  const { start, end } = getTodayRange();
  const todayVisits = visits.filter(v => v.ts >= start && v.ts < end);

  const uvSet = new Set();
  const pageCount = {};
  todayVisits.forEach(v => { uvSet.add(v.fp); pageCount[v.page] = (pageCount[v.page] || 0) + 1; });
  const todayUV = uvSet.size;
  const todayPV = todayVisits.length;

  const allUV = new Set(visits.map(v => v.fp)).size;
  const allPV = visits.length;

  const pageRank = Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  const recent = [...todayVisits].reverse().slice(0, 20).map(v => ({
    time: new Date(v.ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    page: v.page,
    device: v.uaInfo || "未知",
    location: v.location || v.ip || "未知",
    tags: v.tags || ""
  }));

  const weekly = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const de = ds + 86400000;
    const dayVisits = visits.filter(v => v.ts >= ds && v.ts < de);
    const dayUV = new Set(dayVisits.map(v => v.fp)).size;
    weekly.push({
      day: `${d.getMonth() + 1}/${d.getDate()}`,
      uv: dayUV,
      pv: dayVisits.length
    });
  }

  return { todayUV, todayPV, totalUV: allUV, totalPV: allPV, pageRank, recent, weekly };
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

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "POST" && req.url === "/api/login") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const { password } = JSON.parse(body || "{}");
        if (password !== ADMIN_PASSWORD) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        const token = crypto.randomBytes(24).toString("hex");
        adminTokens.add(token);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, token }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/track") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const { fp, page, referrer } = JSON.parse(body || "{}");
        const ip = getClientIP(req);
        const ts = Date.now();
        const data = loadData();
        data.visits.push({
          ts: ts,
          ip: ip,
          ua: req.headers["user-agent"] || "",
          uaInfo: parseUA(req.headers["user-agent"] || ""),
          fp: fp || "anon-" + ts,
          page: page || parseReferrer(referrer || req.headers.referer),
          referrer: referrer || "",
          location: getLocationLabel(ip),
          tags: getTag(ts)
        });
        if (data.visits.length > 50000) data.visits = data.visits.slice(-50000);
        saveData(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/track-answer") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const { fp, qid } = JSON.parse(body || "{}");
        if (!fp || !qid) { res.writeHead(400); res.end(JSON.stringify({ error: "missing fp or qid" })); return; }
        const data = loadAnswers();
        data.answers.push({ fp: fp, qid: qid, ts: Date.now() });
        if (data.answers.length > 200000) data.answers = data.answers.slice(-200000);
        saveAnswers(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/stats") {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!adminTokens.has(token)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    const data = loadData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getStats(data.visits)));
    return;
  }

  if (req.method === "GET" && req.url === "/api/leaderboard") {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!adminTokens.has(token)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    const data = loadAnswers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getLeaderboard(data.answers)));
    return;
  }

  let pathname = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  try { pathname = decodeURIComponent(pathname); }
  catch { pathname = "/index.html"; }
  pathname = path.posix.normalize(pathname);
  const publicFiles = new Set(["/index.html", "/admin.html", "/styles.css", "/app.js", "/data.js", "/banks.js"]);
  if (!publicFiles.has(pathname) && !pathname.startsWith("/assets/")) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }
  const filePath = path.resolve(__dirname, "." + pathname);
  if (!filePath.startsWith(__dirname + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  if (MIME[ext]) {
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end("Not Found"); return; }
      res.writeHead(200, { "Content-Type": MIME[ext] });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 服务已启动 → http://localhost:${PORT}`);
  console.log(`📊 管理后台 → http://localhost:${PORT}/admin.html`);
  console.log(`📝 数据文件 → ${DATA_FILE}`);
});
