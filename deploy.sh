#!/bin/bash
# ============================================
#  Question Run · 一键部署脚本（修复版）
#  适用: 阿里云 / Ubuntu / CentOS
#  修复点:
#    1. 先停服务再覆盖,杜绝数据丢失
#    2. 用 rsync --delete 真正"全覆盖"
#    3. 排除 .git / 数据文件,避免污染和丢数据
#    4. 自动备份数据文件
# ============================================
set -e

SRC="/root/workspace/exec-f76cbcacaf364cfbbd54"
DST="/var/www/刷题"
BACKUP="/tmp/qr-backup-$(date +%s)"
LOG="/var/log/question-run.log"

echo "==========================================="
echo "  Question Run · 部署开始 $(date '+%F %T')"
echo "==========================================="

# ---- 1. 先停掉旧 node 进程(避免部署期间写入数据) ----
echo "[1/6] 停止旧服务..."
pkill -f "node.*server.js" 2>/dev/null || true
sleep 1

# ---- 2. 备份数据文件 ----
echo "[2/6] 备份数据文件..."
mkdir -p "$BACKUP"
[ -f "$DST/visit-data.json" ] && cp "$DST/visit-data.json" "$BACKUP/"
[ -f "$DST/answer-data.json" ] && cp "$DST/answer-data.json" "$BACKUP/"
echo "  备份目录: $BACKUP"

# ---- 3. 拉取最新代码 ----
echo "[3/6] git pull..."
cd "$SRC" || { echo "源码目录不存在: $SRC"; exit 1; }
git pull

# ---- 4. 全量同步(关键修复点) ----
echo "[4/6] 同步文件到 $DST ..."
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude='.git' \
    --exclude='visit-data.json' \
    --exclude='answer-data.json' \
    --exclude='node_modules' \
    ./ "$DST/"
else
  echo "  (未检测到 rsync,使用 cp+dotglob 回退方案)"
  shopt -s dotglob nullglob
  rm -rf "$DST"/*
  cp -r ./* "$DST/"
  shopt -u dotglob nullglob
fi

# ---- 5. 还原数据文件 ----
echo "[5/6] 还原数据文件..."
[ -f "$BACKUP/visit-data.json" ] && cp "$BACKUP/visit-data.json" "$DST/" && echo "  ✓ visit-data.json"
[ -f "$BACKUP/answer-data.json" ] && cp "$BACKUP/answer-data.json" "$DST/" && echo "  ✓ answer-data.json"

# ---- 6. Nginx 重载 + 启动新服务 ----
echo "[6/6] 启动服务..."
nginx -t && nginx -s reload
cd "$DST" && nohup node server.js > "$LOG" 2>&1 &

sleep 1
echo ""
echo "==========================================="
echo "  ✅ 部署完成!"
echo "==========================================="
echo "  访问: http://$(hostname -I | awk '{print $1}')/"
echo "  日志: tail -f $LOG"
echo "  备份: $BACKUP"
