-- D1 表结构，初始化时一次性执行
-- 命令：wrangler d1 execute quiz-db --file=./schema.sql --remote

CREATE TABLE IF NOT EXISTS visits (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        INTEGER NOT NULL,        -- 毫秒时间戳
  ip        TEXT,
  ua        TEXT,
  ua_info   TEXT,                    -- 解析后的浏览器/设备类型
  fp        TEXT NOT NULL,           -- 匿名指纹
  page      TEXT NOT NULL,
  referrer  TEXT,
  location  TEXT,                    -- 校园标签等
  tags      TEXT                     -- 时间段标签（卷王等）
);
CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts);
CREATE INDEX IF NOT EXISTS idx_visits_fp ON visits(fp);
CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);

CREATE TABLE IF NOT EXISTS answers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  fp   TEXT NOT NULL,
  qid  TEXT NOT NULL,
  ts   INTEGER NOT NULL,
  UNIQUE(fp, qid)                    -- 同一指纹同一题只计一次
);
CREATE INDEX IF NOT EXISTS idx_answers_fp ON answers(fp);
