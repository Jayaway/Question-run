const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "visit-data.json");
const ADMIN_PASSWORD = "admin888";

function loadData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return { visits: [] }; }
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
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
    location: v.ip || "未知"
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

  if (req.method === "POST" && req.url === "/api/track") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const { fp, page, referrer } = JSON.parse(body || "{}");
        const data = loadData();
        data.visits.push({
          ts: Date.now(),
          ip: getClientIP(req),
          ua: req.headers["user-agent"] || "",
          uaInfo: parseUA(req.headers["user-agent"] || ""),
          fp: fp || "anon-" + Date.now(),
          page: page || parseReferrer(referrer || req.headers.referer),
          referrer: referrer || ""
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

  if (req.method === "GET" && req.url === "/api/stats") {
    const data = loadData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getStats(data.visits)));
    return;
  }

  let filePath = "." + (req.url === "/" ? "/index.html" : req.url.split("?")[0]);
  filePath = path.join(__dirname, path.normalize(filePath));
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
