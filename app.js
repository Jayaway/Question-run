const DEFAULT_BANK = window.QUESTION_BANK || { meta: {}, questions: [] };
const STORAGE_KEY = "algorithm-review-quiz-v2";
const BANK_STORAGE_KEY = "algorithm-review-quiz-bank-v1";
let bank = loadQuestionBank();
let questions = bank.questions || [];

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playCorrectSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}

function playWrongSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {}
}

const els = {
  modeTabs: Array.from(document.querySelectorAll(".mode-tab")),
  sectionToggle: document.querySelector("#sectionToggle"),
  sectionMenu: document.querySelector("#sectionMenu"),
  sectionDropdown: document.querySelector("#sectionDropdown"),
  statusToggle: document.querySelector("#statusToggle"),
  statusMenu: document.querySelector("#statusMenu"),
  statusDropdown: document.querySelector("#statusDropdown"),
  searchInput: document.querySelector("#searchInput"),
  restartBtn: document.querySelector("#restartBtn"),
  importFile: document.querySelector("#importFile"),
  restoreBankBtn: document.querySelector("#restoreBankBtn"),
  importHint: document.querySelector("#importHint"),
  mobileMenuBtn: document.querySelector("#mobileMenuBtn"),
  drawerOverlay: document.querySelector("#drawerOverlay"),
  themeToggle: document.querySelector("#themeToggle"),
  questionNav: document.querySelector("#questionNav"),
  pageTitle: document.querySelector("#pageTitle"),
  sourceText: document.querySelector("#sourceText"),
  typeBadge: document.querySelector("#typeBadge"),
  progressText: document.querySelector("#progressText"),
  progressSegments: document.querySelector("#progressSegments"),
  streakCount: document.querySelector("#streakCount"),
  questionTitle: document.querySelector("#questionTitle"),
  questionCard: document.querySelector(".question-card"),
  questionPrompt: document.querySelector("#questionPrompt"),
  questionImage: document.querySelector("#questionImage"),
  choiceArea: document.querySelector("#choiceArea"),
  fillArea: document.querySelector("#fillArea"),
  fillInput: document.querySelector("#fillInput"),
  subjectiveArea: document.querySelector("#subjectiveArea"),
  memoryInput: document.querySelector("#memoryInput"),
  actionBar: document.querySelector("#actionBar"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackAnswer: document.querySelector("#feedbackAnswer"),
  feedbackAnalysis: document.querySelector("#feedbackAnalysis"),
  feedbackAnalysisBlock: document.querySelector("#feedbackAnalysisBlock"),
  primaryBtn: document.querySelector("#primaryBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  markBtn: document.querySelector("#markBtn"),
  markIcon: document.querySelector("#markIcon"),
  shuffleBtn: document.querySelector("#shuffleBtn"),
  statTotal: document.querySelector("#statTotal"),
  statDone: document.querySelector("#statDone"),
  statAccuracy: document.querySelector("#statAccuracy"),
  statMarked: document.querySelector("#statMarked")
};

function loadQuestionBank() {
  try {
    const s = localStorage.getItem(BANK_STORAGE_KEY);
    if (!s) return normalizeQuestionBank(DEFAULT_BANK, "内置题库");
    const parsed = normalizeQuestionBank(JSON.parse(s), "导入题库");
    if (!parsed.questions.length) { localStorage.removeItem(BANK_STORAGE_KEY); return normalizeQuestionBank(DEFAULT_BANK, "内置题库"); }
    return parsed;
  }
  catch { localStorage.removeItem(BANK_STORAGE_KEY); return normalizeQuestionBank(DEFAULT_BANK, "内置题库"); }
}
function normalizeQuestionBank(input, fallbackTitle = "导入题库") {
  const raw = Array.isArray(input) ? { meta: { title: fallbackTitle }, questions: input } : input || {};
  const rq = Array.isArray(raw.questions) ? raw.questions : [];
  const norm = rq.map((q, i) => normalizeQuestion(q, i)).filter(Boolean);
  return { meta: { title: raw.meta?.title || fallbackTitle, source: raw.meta?.source || fallbackTitle, count: norm.length }, questions: norm };
}
function normalizeQuestion(q, index) {
  if (!q || typeof q !== "object") return null;
  const type = q.type || (q.options ? "choice" : "short");
  const section = q.section || ({ choice: "选择题", fill: "填空题", code: "算法填空", short: "问答题", design: "算法设计题" }[type] || "题目");
  const number = Number(q.number) || index + 1;
  const title = q.title || `${section} ${number}`;
  const prompt = q.prompt || q.question || q.stem || title;
  let options = q.options;
  if (options && !Array.isArray(options) && typeof options === "object") options = Object.entries(options).map(([k, t]) => ({ key: k, text: t }));
  if (type === "choice") { options = (Array.isArray(options) ? options : []).map((o, i) => ({ key: String(o.key || "ABCD"[i] || i+1), text: String(o.text||o.label||o.value||"") })).filter(o => o.text); if (!options.length) return null; }
  return { id: String(q.id || `${type}-${String(number).padStart(2,"0")}`), type, section, number, title: String(title), prompt: String(prompt), ...(options ? { options } : {}), answer: q.answer == null ? "" : String(q.answer), analysis: q.analysis || q.explanation || q.explain || "", ...(q.image ? { image: String(q.image) } : {}) };
}
function importQuestionBank(input) {
  const nb = normalizeQuestionBank(input, "导入题库"); if (!nb.questions.length) throw new Error("没有找到有效题目");
  bank = nb; questions = nb.questions; localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(nb));
  app = { ...app, section: "全部题型", status: "all", query: "", index: 0, records: {}, marked: {}, streak: 0 };
  initFilters(); render(); closeDrawerOnMobile(); if (els.importHint) els.importHint.textContent = `已导入 ${questions.length} 题`; return nb;
}
function restoreDefaultBank() {
  showModal({
    type: "danger", icon: "⚠️", title: "恢复内置题库",
    body: "这将清除当前已导入的题库，恢复为内置题库，所有刷题记录将被重置。是否继续？",
    confirmText: "确认恢复", cancelText: "取消",
    onConfirm: () => {
      localStorage.removeItem(BANK_STORAGE_KEY);
      bank = normalizeQuestionBank(DEFAULT_BANK, "内置题库"); questions = bank.questions || [];
      app = { ...app, section: "全部题型", status: "all", query: "", index: 0, records: {}, marked: {}, streak: 0 };
      initFilters(); render(); closeDrawerOnMobile(); if (els.importHint) els.importHint.textContent = "已恢复内置题库";
    }
  });
}
window.importQuestionBank = importQuestionBank;

let app = loadState();
let swipeStart = null;
let autoNextTimer = 0;

function loadState() { const f = { mode: "practice", section: "全部题型", status: "all", query: "", index: 0, records: {}, marked: {}, streak: 0 }; try { return { ...f, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return f; } }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(app)); }
function recordFor(id) { if (!app.records[id]) app.records[id] = { attempts: 0, revealed: false, correct: null, mastered: null }; return app.records[id]; }

function filteredQuestions() {
  const query = app.query.trim().toLowerCase();
  return questions.filter(q => {
    const rec = app.records[q.id];
    const marked = Boolean(app.marked[q.id]);
    const done = Boolean(rec && (rec.revealed || rec.mastered !== null || rec.correct !== null));
    const wrong = Boolean(rec && (rec.firstWrong === true || rec.correct === false || rec.mastered === false));
    if (app.section !== "全部题型" && q.section !== app.section) return false;

    if (app.status === "wrong" && !wrong) return false;
    if (app.status === "unanswered" && done) return false;
    if (app.status === "done" && !done) return false;
    if (!query) return true;
    const haystack = [q.title, q.prompt, q.answer, q.analysis, q.section, (q.options||[]).map(o=>o.text).join(" ")].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function initFilters() {
  const sections = ["全部题型", ...new Set(questions.map(q => q.section))];
  els.sectionMenu.innerHTML = sections.map(s => `<button class="dropdown-item${s === app.section ? " active" : ""}" data-value="${escapeAttr(s)}">${s}</button>`).join("");
  els.sectionToggle.textContent = app.section;
  els.statusMenu.querySelectorAll(".dropdown-item").forEach(btn => btn.classList.toggle("active", btn.dataset.value === app.status));
  const statusLabels = { all: "全部题目", unanswered: "未刷题", done: "已刷题", wrong: "错题本", marked: "已收藏" };
  els.statusToggle.textContent = statusLabels[app.status] || "全部题目";
  els.searchInput.value = app.query;
  els.sourceText.textContent = `${bank.meta.source || "本地题库"} · ${questions.length} 题`;
}

function toggleDropdown(dropdown, menu) {
  const isOpen = menu.classList.contains("open");
  closeAllDropdowns();
  if (!isOpen) menu.classList.add("open");
}
function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu.open").forEach(m => m.classList.remove("open"));
}

function render() {
  const list = filteredQuestions();
  if (app.index >= list.length) app.index = Math.max(0, list.length - 1);
  renderStats(); renderMode(); renderNav(list); renderProgressSegments(list);
  if (!list.length) { renderEmpty(); saveState(); return; }
  renderQuestion(list[app.index], list); saveState();
}
const MOOD_WORDS = ["嗯…","还行","不错","可以","挺好","很强","牛啊","太强了","起飞!","无敌!","封神!"];
function getMoodWord(count) {
  const idx = Math.min(Math.floor(count / 10), MOOD_WORDS.length - 1);
  return MOOD_WORDS[idx];
}
function renderStats() {
  const done = questions.filter(q => { const r = app.records[q.id]; return r && (r.revealed || r.mastered !== null || r.correct !== null); }).length;
  const checked = Object.values(app.records).filter(r => r.correct !== null);
  const correct = checked.filter(r => r.correct === true).length;
  const accuracy = checked.length ? Math.round((correct / checked.length) * 100) : 0;
  els.statTotal.textContent = questions.length; els.statDone.textContent = done;
  els.statAccuracy.textContent = `${accuracy}%`; els.statMarked.textContent = Object.keys(app.marked).length;
  els.streakCount.textContent = getMoodWord(answeredCount);
}
function renderMode() {
  els.modeTabs.forEach(btn => { const m = btn.dataset.mode, s = btn.dataset.status; btn.classList.toggle("active", Boolean((m && app.mode === m && app.status === "all") || (s && app.status === s))); });
  els.pageTitle.textContent = app.status === "wrong" ? "错题本" : app.status === "marked" ? "收藏题" : (app.mode === "memorize" ? "背题模式" : "刷题模式");
}
function renderNav(list) {
  els.questionNav.innerHTML = list.map((q, idx) => {
    const rec = app.records[q.id], done = rec && (rec.revealed || rec.mastered !== null || rec.correct !== null);
    const wrong = rec && (rec.firstWrong === true || rec.correct === false || rec.mastered === false), marked = app.marked[q.id];
    const cls = ["nav-item", idx === app.index && "active", done && "done", wrong && "wrong", marked && "marked"].filter(Boolean).join(" ");
    return `<button class="${cls}" data-index="${idx}" title="${escapeAttr(q.title)}">${shortLabel(q)}</button>`;
  }).join("");
}
function renderProgressSegments(list) {
  if (!list.length) { els.progressSegments.innerHTML = ""; return; }
  const pct = Math.round(((app.index + 1) / list.length) * 100);
  els.progressSegments.innerHTML = `<span class="seg-bar" style="width:${pct}%"></span>`;
}
function renderEmpty() {
  els.questionTitle.textContent = "没有匹配的题目"; els.questionPrompt.textContent = "";
  els.typeBadge.textContent = "空"; els.progressText.textContent = "0 / 0";
  els.choiceArea.innerHTML = ""; els.fillArea.style.display = "none"; els.subjectiveArea.style.display = "none";
  els.questionImage.style.display = "none"; hideFeedback();
  els.primaryBtn.disabled = true; els.primaryBtn.textContent = "继续";
  els.prevBtn.disabled = true; els.nextBtn.disabled = true;
  els.questionNav.innerHTML = `<div class="empty">当前筛选下没有题目。</div>`;
}

function renderQuestion(q, list) {
  const rec = recordFor(q.id), reveal = app.mode === "memorize" || rec.revealed;
  els.typeBadge.textContent = q.section; els.progressText.textContent = `${app.index + 1} / ${list.length}`;
  els.questionTitle.textContent = q.title; els.questionPrompt.textContent = q.prompt || q.title;
  els.markBtn.classList.toggle("active", Boolean(app.marked[q.id]));
  els.markBtn.setAttribute("aria-pressed", String(Boolean(app.marked[q.id])));
  els.markIcon.textContent = app.marked[q.id] ? "★" : "☆";
  els.prevBtn.disabled = app.index === 0; els.nextBtn.disabled = app.index === list.length - 1;
  els.primaryBtn.disabled = false;
  els.primaryBtn.dataset.state = reveal ? "next" : "check";
  els.primaryBtn.textContent = reveal ? "下一题" : (app.mode === "memorize" ? "显示答案" : "检查答案");

  if (q.image) {
    els.questionImage.src = q.image;
    els.questionImage.style.display = "block";
  } else {
    els.questionImage.removeAttribute("src");
    els.questionImage.style.display = "none";
  }

  els.choiceArea.innerHTML = "";
  els.fillArea.style.display = "none";
  els.subjectiveArea.style.display = "none";

  if (q.type === "choice") {
    els.choiceArea.innerHTML = q.options.map(opt => {
      let cls = "option-btn";
      let mark = "";
      if (reveal) {
        const selected = rec.selected === opt.key;
        const isCorrect = normalizeAnswer(opt.key) === normalizeAnswer(q.answer);
        if (isCorrect) { cls += " correct"; mark = "✓"; }
        else if (selected) { cls += " wrong"; mark = "✕"; }
      }
      return `<button class="${cls}" type="button" data-key="${escapeAttr(opt.key)}" ${reveal ? "disabled" : ""}><span class="option-key">${escapeHtml(opt.key)}</span><span>${escapeHtml(opt.text)}</span><span class="option-mark">${mark}</span></button>`;
    }).join("");
  } else if (q.type === "fill" || q.type === "code") {
    els.fillArea.style.display = "grid";
    els.fillInput.value = rec.input || "";
    els.fillInput.disabled = reveal;
  } else {
    els.subjectiveArea.style.display = "grid";
    els.memoryInput.value = rec.input || "";
    els.memoryInput.disabled = reveal;
  }

  if (reveal) showFeedback(q, rec.correct !== false);
  else hideFeedback();
}

function normalizeAnswer(v) { return String(v ?? "").trim().replace(/\s+/g, " ").toLowerCase(); }
function splitBlankAnswer(v) { return normalizeAnswer(v).split(/[;；\s]+/).filter(Boolean); }
function checkFillAnswer(input, answer) {
  const userParts = splitBlankAnswer(input);
  const answerParts = splitBlankAnswer(answer);
  if (!answerParts.length) return normalizeAnswer(input) === normalizeAnswer(answer);
  return userParts.length === answerParts.length && userParts.every((part, index) => part === answerParts[index]);
}
function showFeedback(q, correct) {
  els.feedbackPanel.dataset.state = correct ? "ok" : "bad";
  els.feedbackIcon.textContent = correct ? "✓" : "✕";
  els.feedbackTitle.textContent = correct ? "回答正确" : "回答错误";
  els.feedbackAnswer.textContent = q.answer || "无";
  const hasAnalysis = Boolean(String(q.analysis || "").trim());
  els.feedbackAnalysis.textContent = q.analysis || "";
  els.feedbackAnalysisBlock.style.display = hasAnalysis ? "grid" : "none";
}
function hideFeedback() { els.feedbackPanel.dataset.state = "hidden"; }
function shortLabel(q) { const p = {"选择题":"选","填空题":"填","算法填空":"算","问答题":"问","算法设计题":"设","算法设计与分析题":"设"}[q.section]||"题"; return `${p}${q.number}`; }
function escapeHtml(t) { return String(t||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function escapeAttr(t) { return escapeHtml(t); }

function clearAutoNext() { if (autoNextTimer) { clearTimeout(autoNextTimer); autoNextTimer = 0; } }
function goToIndex(nextIndex) { app.index = Math.max(0, Math.min(nextIndex, filteredQuestions().length - 1)); render(); }
function doGo(step) { const list = filteredQuestions(); if (!list.length) return; goToIndex(app.index + step); }
function nextQuestion() { doGo(1); }
function prevQuestion() { doGo(-1); }

function selectChoice(key) {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  rec.selected = key;
  renderQuestion(q, list);
}

function revealCurrent(forceCorrect) {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  rec.revealed = true;
  if (typeof forceCorrect === "boolean") rec.correct = forceCorrect;
  render();
}

function checkCurrentAnswer() {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  if (q.type === "choice") {
    if (!rec.selected) return;
    const isFirstAnswer = rec.correct === null && rec.revealed !== true;
    const correct = normalizeAnswer(rec.selected) === normalizeAnswer(q.answer);
    rec.correct = correct;
    rec.revealed = true;
    rec.attempts = (rec.attempts || 0) + 1;
    if (!correct && rec.firstWrong == null) rec.firstWrong = true;
    if (correct) { app.streak = (app.streak || 0) + 1; playCorrectSound(); }
    else { app.streak = 0; playWrongSound(); }
    recordAnswer(correct);
    render();
    if (correct) {
      pulseStreak();
      flashCorrect();
    } else {
      shakeWrong();
    }
    if (isFirstAnswer && answeredCount % 10 === 0) {
      const role = chooseCheckpointMascot(correct);
      if (correct) {
        setTimeout(() => playMascotMoment(role, () => nextQuestion()), 700);
      }
    }
    return;
  }

  const value = q.type === "fill" || q.type === "code" ? els.fillInput.value : els.memoryInput.value;
  rec.input = value;
  rec.attempts = (rec.attempts || 0) + 1;
  const correct = q.type === "fill" || q.type === "code" ? checkFillAnswer(value, q.answer) : normalizeAnswer(value) === normalizeAnswer(q.answer);
  rec.correct = correct;
  rec.mastered = correct;
  rec.revealed = true;
  if (!correct && rec.firstWrong == null) rec.firstWrong = true;
  if (correct) { app.streak = (app.streak || 0) + 1; playCorrectSound(); }
  else { app.streak = 0; playWrongSound(); }
  recordAnswer(correct);
  render();
  if (correct) { pulseStreak(); flashCorrect(); }
  else { shakeWrong(); }
  if (answeredCount % 10 === 0) {
    const role = chooseCheckpointMascot(rec.correct);
    if (rec.correct) { setTimeout(() => playMascotMoment(role, () => doGo(1)), 700); }
  }
}

function handlePrimaryAction() {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  if (rec.revealed || app.mode === "memorize" && els.primaryBtn.dataset.state === "next") {
    nextQuestion();
    return;
  }
  if (app.mode === "memorize") {
    rec.revealed = true;
    rec.mastered = true;
    render();
    return;
  }
  checkCurrentAnswer();
}

function toggleMark() {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  if (app.marked[q.id]) delete app.marked[q.id];
  else app.marked[q.id] = true;
  render();
}

function shuffleQuestions() {
  const list = filteredQuestions();
  if (list.length < 2) return;
  const currentId = list[app.index]?.id;
  questions = [...questions].sort(() => Math.random() - 0.5);
  const nextList = filteredQuestions();
  app.index = Math.max(0, nextList.findIndex(item => item.id === currentId));
  render();
}

function resetRecords() { app.records = {}; app.marked = {}; app.streak = 0; app.index = 0; answeredCount = 0; last15Results = []; render(); }

function showModal({ type = "default", icon = "", title = "提示", body = "", confirmText = "确定", cancelText = "取消", onConfirm = null }) {
  const overlay = document.createElement("div");
  overlay.className = "custom-modal-overlay";
  overlay.innerHTML = `
    <div class="custom-modal ${type === "danger" ? "danger" : ""}">
      <div class="custom-modal-icon">${escapeHtml(icon)}</div>
      <h3 class="custom-modal-title">${escapeHtml(title)}</h3>
      <p class="custom-modal-body">${escapeHtml(body)}</p>
      <div class="custom-modal-actions">
        <button class="custom-modal-btn cancel" type="button">${escapeHtml(cancelText)}</button>
        <button class="custom-modal-btn confirm" type="button">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector(".cancel").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  overlay.querySelector(".confirm").addEventListener("click", () => { close(); if (typeof onConfirm === "function") onConfirm(); });
}

function openDrawer() {
  document.body.classList.add("drawer-open");
  els.mobileMenuBtn?.setAttribute("aria-expanded", "true");
  if (els.drawerOverlay) els.drawerOverlay.hidden = false;
}
function closeDrawerOnMobile() {
  document.body.classList.remove("drawer-open");
  els.mobileMenuBtn?.setAttribute("aria-expanded", "false");
  if (els.drawerOverlay) els.drawerOverlay.hidden = true;
}
function toggleDrawer() { document.body.classList.contains("drawer-open") ? closeDrawerOnMobile() : openDrawer(); }

function initTheme() {
  const stored = localStorage.getItem("algorithm-review-theme");
  const dark = stored === "dark";
  document.body.classList.toggle("dark", dark);
  updateThemeAssets();
}
function toggleTheme() {
  const on = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", on);
  localStorage.setItem("algorithm-review-theme", on ? "dark" : "light");
  updateThemeAssets();
  render();
}
function updateThemeAssets() {
  if (els.themeToggle) {
    const img = els.themeToggle.querySelector("img");
    if (img) img.src = document.body.classList.contains("dark") ? "./assets/moon.png" : "./assets/sun2.png";
  }
  const meta = document.querySelector("#themeColorMeta");
  if (meta) meta.content = document.body.classList.contains("dark") ? "#2a2255" : "#7B61FF";
}

function bindEvents() {
  els.mobileMenuBtn?.addEventListener("click", toggleDrawer);
  els.drawerOverlay?.addEventListener("click", closeDrawerOnMobile);
  els.themeToggle?.addEventListener("click", toggleTheme);
  els.sectionToggle?.addEventListener("click", () => toggleDropdown(els.sectionDropdown, els.sectionMenu));
  els.statusToggle?.addEventListener("click", () => toggleDropdown(els.statusDropdown, els.statusMenu));
  document.addEventListener("click", e => {
    if (!els.sectionDropdown?.contains(e.target)) els.sectionMenu?.classList.remove("open");
    if (!els.statusDropdown?.contains(e.target)) els.statusMenu?.classList.remove("open");
  });
  els.sectionMenu?.addEventListener("click", e => {
    const btn = e.target.closest(".dropdown-item");
    if (!btn) return;
    app.section = btn.dataset.value || "全部题型";
    app.index = 0;
    initFilters();
    render();
    closeAllDropdowns();
  });
  els.statusMenu?.addEventListener("click", e => {
    const btn = e.target.closest(".dropdown-item");
    if (!btn) return;
    app.status = btn.dataset.value || "all";
    app.index = 0;
    initFilters();
    render();
    closeAllDropdowns();
  });
  els.searchInput?.addEventListener("input", e => { app.query = e.target.value || ""; app.index = 0; render(); });
  els.restartBtn?.addEventListener("click", () => showModal({ title: "重新刷题", body: "这会清空当前刷题记录和收藏，是否继续？", confirmText: "确认重置", cancelText: "取消", onConfirm: resetRecords }));
  els.restoreBankBtn?.addEventListener("click", restoreDefaultBank);
  els.importFile?.addEventListener("change", async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importQuestionBank(JSON.parse(text));
    } catch (error) {
      showModal({ type: "danger", icon: "!", title: "导入失败", body: error?.message || "题库文件格式不正确", confirmText: "知道了", cancelText: "关闭" });
    } finally {
      e.target.value = "";
    }
  });
  els.modeTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      const status = btn.dataset.status;
      if (mode) {
        app.mode = mode;
        app.status = "all";
      }
      if (status) {
        app.status = status;
        if (status === "wrong" || status === "marked") app.mode = "practice";
      }
      app.index = 0;
      initFilters();
      render();
      closeDrawerOnMobile();
    });
  });
  els.questionNav?.addEventListener("click", e => {
    const btn = e.target.closest(".nav-item");
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (Number.isFinite(index)) goToIndex(index);
    closeDrawerOnMobile();
  });
  els.choiceArea?.addEventListener("click", e => {
    const btn = e.target.closest(".option-btn");
    if (!btn || btn.disabled) return;
    addOptionRipple(btn);
    selectChoice(btn.dataset.key);
  });
  els.primaryBtn?.addEventListener("click", handlePrimaryAction);
  els.prevBtn?.addEventListener("click", prevQuestion);
  els.nextBtn?.addEventListener("click", nextQuestion);
  els.markBtn?.addEventListener("click", toggleMark);
  els.shuffleBtn?.addEventListener("click", shuffleQuestions);
  els.feedbackPanel?.addEventListener("click", hideFeedback);
  els.fillInput?.addEventListener("keydown", e => { if (e.key === "Enter") handlePrimaryAction(); });
  els.memoryInput?.addEventListener("input", e => { const list = filteredQuestions(); const q = list[app.index]; if (!q) return; recordFor(q.id).input = e.target.value; saveState(); });
  els.fillInput?.addEventListener("input", e => { const list = filteredQuestions(); const q = list[app.index]; if (!q) return; recordFor(q.id).input = e.target.value; saveState(); });
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") prevQuestion();
    if (e.key === "ArrowRight") nextQuestion();
  });
  els.questionCard?.addEventListener("touchstart", e => {
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    swipeStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  els.questionCard?.addEventListener("touchend", e => {
    const touch = e.changedTouches?.[0];
    if (!touch || !swipeStart) return;
    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) nextQuestion();
    else prevQuestion();
  }, { passive: true });
}

let answeredCount = 0;
let pendingMascot = null;
let last15Results = [];
const MASCOT_CONFIG = {
  boobo: {
    image: "./assets/boobo-front.webp",
    darkImage: "./assets/boobo-dark.webp",
    lines: ["稳住节奏，一题一题来。", "做得不错，继续推进。", "这题拿下，状态在线。"]
  },
  gru: {
    image: "./assets/gru-front.webp",
    darkImage: "./assets/gru-dark.webp",
    lines: ["漂亮，这波节奏拉满。", "继续冲，已经很强了。", "这题很稳，保持手感。"]
  },
  mimo: {
    image: "./assets/mimo-front.webp",
    darkImage: "./assets/mimo-dark.webp",
    lines: ["别急，慢一点更容易做对。", "卡住也没事，先看清题意。", "一步一步来，你可以的。"]
  },
  waiwai: {
    image: "./assets/waiwai-front.webp",
    darkImage: "./assets/waiwai-dark.webp",
    lines: ["先别慌，回到条件本身。", "错一道不影响后面发挥。", "想清楚再出手，节奏会回来。"]
  },
  dodo: {
    image: "./assets/dodo-front.webp",
    darkImage: "./assets/dodo-dark.webp",
    lines: ["继续加油，下一题争取更稳。", "状态在慢慢起来，别停。", "保持专注，马上就顺了。"]
  }
};

function pulseStreak() {
  const count = els.streakCount;
  const icon = document.getElementById("streakIcon");
  if (!count || !icon || !window.gsap) return;
  count.textContent = getMoodWord(answeredCount);
  gsap.fromTo(icon, { scale: .8, rotate: -12 }, { scale: 1.15, rotate: 0, duration: .32, ease: "back.out(2)" });
  gsap.fromTo(count, { scale: .9, color: "#ff9f1c" }, { scale: 1, color: "", duration: .42, ease: "power2.out" });
}
function flashCorrect() {
  els.questionCard?.classList.remove("wrong-border", "shake");
  els.questionCard?.classList.add("correct-flash", "correct-border");
  setTimeout(() => els.questionCard?.classList.remove("correct-flash", "correct-border"), 620);
}
function shakeWrong() {
  els.questionCard?.classList.remove("correct-flash", "correct-border");
  els.questionCard?.classList.add("shake", "wrong-border");
  setTimeout(() => els.questionCard?.classList.remove("shake", "wrong-border"), 560);
}
function addOptionRipple(btn) { btn.style.setProperty("--cx","50%"); btn.style.setProperty("--cy","50%"); btn.classList.add("ripple"); setTimeout(()=>btn.classList.remove("ripple"), 400); }
function recordAnswer(isCorrect) { last15Results.push({ correct: isCorrect }); if (last15Results.length > 15) last15Results.shift(); answeredCount++; }
function chooseCheckpointMascot(isCorrect) {
  const total = last15Results.length, correctCount = last15Results.filter(r => r.correct).length;
  const accuracy = total > 0 ? correctCount / total : 0;
  if (isCorrect) { if (accuracy >= 0.85) return "gru"; if (accuracy >= 0.6) return "boobo"; return "dodo"; }
  if (accuracy < 0.6) return "mimo";
  return "waiwai";
}
function createMascotParticles(role) {
  const container = document.getElementById("mascotParticles");
  if (!container) return;
  container.innerHTML = "";
  const count = role === "waiwai" ? 8 : 10;
  for (let i = 0; i < count; i++) {
    const node = document.createElement("span");
    node.className = role === "waiwai" ? "waiwai-mark" : (role === "boobo" ? "boobo-dot" : role === "mimo" ? "mimo-soft-dot" : role === "dodo" ? "dodo-bubble-dot" : "mascot-particle");
    node.style.setProperty("--x", `${Math.round((Math.random() - .5) * 180)}px`);
    node.style.setProperty("--y", `${Math.round((Math.random() - .5) * 180)}px`);
    node.style.setProperty("--r", `${Math.round((Math.random() - .5) * 80)}deg`);
    if (role === "waiwai") node.textContent = "!";
    else node.style.background = role === "gru" ? "#58cc02" : role === "boobo" ? "#59b8ff" : role === "mimo" ? "#ff9fbd" : "#ffbf3d";
    container.appendChild(node);
  }
}
function playMascotMoment(role, onComplete) {
  const overlay = document.getElementById("mascotOverlay");
  const img = document.getElementById("mascotImg");
  const bubble = document.getElementById("mascotBubble");
  if (!overlay || !img || !bubble) { if (typeof onComplete === "function") onComplete(); return; }
  const cfg = MASCOT_CONFIG[role] || MASCOT_CONFIG.boobo;
  overlay.className = `mascot-overlay show role-${role}`;
  img.src = document.body.classList.contains("dark") ? (cfg.darkImage || cfg.image) : cfg.image;
  bubble.textContent = cfg.lines[Math.floor(Math.random() * cfg.lines.length)];
  createMascotParticles(role);
  clearTimeout(pendingMascot);
  pendingMascot = setTimeout(() => {
    overlay.classList.add("hide");
    setTimeout(() => {
      overlay.className = "mascot-overlay";
      overlay.classList.remove("hide");
      if (typeof onComplete === "function") onComplete();
    }, 260);
  }, 1800);
}

function updateRightPanel() {
  const rpDone = document.getElementById("rpDone");
  const rpAccuracy = document.getElementById("rpAccuracy");
  const rpStreak = document.getElementById("rpStreak");
  const rpMarked = document.getElementById("rpMarked");
  const rpEnergyFill = document.getElementById("rpEnergyFill");
  const rpEnergyLeft = document.getElementById("rpEnergyLeft");
  const rpMascotImg = document.getElementById("rpMascotImg");
  const rpMascotLine = document.getElementById("rpMascotLine");
  const rpTipsList = document.getElementById("rpTipsList");
  if (!rpDone) return;

  const done = questions.filter(q => { const r = app.records[q.id]; return r && (r.revealed || r.correct !== null); }).length;
  const checked = Object.values(app.records).filter(r => r.correct !== null);
  const correct = checked.filter(r => r.correct === true).length;
  const accuracy = checked.length ? Math.round((correct / checked.length) * 100) : 0;
  rpDone.textContent = done;
  rpAccuracy.textContent = accuracy + "%";
  rpStreak.textContent = app.streak || 0;
  rpMarked.textContent = Object.keys(app.marked).length;

  const progress = answeredCount % 15;
  const left = progress === 0 ? 15 : 15 - progress;
  rpEnergyFill.style.width = Math.round((progress / 15) * 100) + "%";
  rpEnergyLeft.textContent = left;

  const total = last15Results.length;
  const recentCorrect = last15Results.filter(r => r.correct).length;
  const recentAcc = total > 0 ? recentCorrect / total : 0.5;
  let mascotRole = "boobo";
  let mascotLine = "准备好了吗？开始刷题吧。";
  if (total >= 3) {
    if (recentAcc >= 0.85) { mascotRole = "gru"; mascotLine = MASCOT_CONFIG.gru.lines[Math.floor(Math.random() * MASCOT_CONFIG.gru.lines.length)]; }
    else if (recentAcc >= 0.6) { mascotRole = "boobo"; mascotLine = MASCOT_CONFIG.boobo.lines[Math.floor(Math.random() * MASCOT_CONFIG.boobo.lines.length)]; }
    else { mascotRole = "mimo"; mascotLine = MASCOT_CONFIG.mimo.lines[Math.floor(Math.random() * MASCOT_CONFIG.mimo.lines.length)]; }
  }
  rpMascotImg.src = document.body.classList.contains("dark") ? (MASCOT_CONFIG[mascotRole].darkImage || MASCOT_CONFIG[mascotRole].image) : MASCOT_CONFIG[mascotRole].image;
  rpMascotLine.textContent = '"' + mascotLine + '"';

  const wrongSections = {};
  questions.forEach(q => {
    const r = app.records[q.id];
    if (r && (r.firstWrong || r.correct === false)) {
      const keyword = q.section || "其他";
      wrongSections[keyword] = (wrongSections[keyword] || 0) + 1;
    }
  });
  const sorted = Object.entries(wrongSections).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (sorted.length) {
    rpTipsList.innerHTML = sorted.map(([k, v]) => `<li>${k}（${v}题）</li>`).join("");
  } else {
    rpTipsList.innerHTML = "<li>暂无错题，继续保持</li>";
  }
}

initTheme(); initFilters(); bindEvents(); render();

Object.values(MASCOT_CONFIG).forEach(c => {
  const i1 = new Image(); i1.src = c.image;
  if (c.darkImage) { const i2 = new Image(); i2.src = c.darkImage; }
});

const _origRender = render;
render = function() { _origRender(); updateRightPanel(); saveState(); };
render();
