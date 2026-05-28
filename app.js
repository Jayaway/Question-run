const DEFAULT_BANK = window.QUESTION_BANK || { meta: {}, questions: [] };
const STORAGE_KEY = "algorithm-review-quiz-v2";
const BANK_STORAGE_KEY = "algorithm-review-quiz-bank-v1";
let bank = loadQuestionBank();
let questions = bank.questions || [];

/* ===== Sound Effects (Web Audio API) ===== */
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
  resetBtn: document.querySelector("#resetBtn"),
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
    // 如果缓存题库为空，回退到内置题库
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
    const correct = Boolean(rec && rec.correct === true);
    if (app.section !== "全部题型" && q.section !== app.section) return false;

    if (app.status === "wrong" && !wrong) return false;
    if (app.status === "unanswered" && done) return false;
    if (app.status === "done" && !done) return false;
    if (!query) return true;
    const haystack = [q.title, q.prompt, q.answer, q.analysis, q.section, (q.options||[]).map(o=>o.text).join(" ")].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

/* ===== Custom Dropdown Logic ===== */
function initFilters() {
  const sections = ["全部题型", ...new Set(questions.map(q => q.section))];
  els.sectionMenu.innerHTML = sections.map(s => `<button class="dropdown-item${s === app.section ? " active" : ""}" data-value="${escapeAttr(s)}">${s}</button>`).join("");
  els.sectionToggle.textContent = app.section;
  // status dropdown active state
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
  const idx = Math.min(Math.floor(count / 15), MOOD_WORDS.length - 1);
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
  els.markIcon.textContent = app.marked[q.id] ? "★" : "☆";
  els.prevBtn.disabled = app.index === 0; els.nextBtn.disabled = app.index === list.length - 1;
  if (q.image) { els.questionImage.src = q.image; els.questionImage.style.display = "block"; }
  else { els.questionImage.removeAttribute("src"); els.questionImage.style.display = "none"; }
  renderAnswerInput(q, rec, reveal); renderFooter(q, rec, reveal);
}
function renderAnswerInput(q, rec, reveal) {
  els.choiceArea.innerHTML = ""; els.fillArea.style.display = "none"; els.subjectiveArea.style.display = "none";
  if (q.type === "choice") {
    const committed = rec.revealed;
    const lockedCorrect = committed && rec.correct; // 已答对就锁定
    els.choiceArea.innerHTML = (q.options || []).map(o => {
      const isC = o.key === q.answer, wasC = committed && rec.selected === o.key;
      const cls = ["option-btn"]; let mark = "";
      if (committed && isC) { cls.push("correct"); mark = "✓"; }
      else if (committed && wasC) { cls.push("wrong"); mark = "✗"; }
      return `<button class="${cls.join(" ")}" data-option="${o.key}" ${lockedCorrect?"disabled":""}><span class="option-key">${o.key}</span><span class="option-label">${escapeHtml(o.text)}</span><span class="option-mark">${mark}</span></button>`;
    }).join(""); return;
  }
  if (q.type === "fill") { els.fillArea.style.display = "grid"; els.fillInput.value = rec.input != null ? rec.input : ""; els.fillInput.disabled = false; return; }
  els.subjectiveArea.style.display = "grid"; els.memoryInput.value = rec.draft || "";
}
function renderFooter(q, rec, reveal) {
  const dismissed = rec.answerDismissed;
  const showFB = reveal && rec.correct !== null && !dismissed;
  const showSub = reveal && q.type !== "choice" && q.type !== "fill" && !dismissed;
  const showMem = reveal && app.mode === "memorize" && !dismissed;
  if (showFB) showFeedbackPanel(rec.correct ? "ok" : "bad", q);
  else if (showSub || showMem) showFeedbackPanel("ok", q, { neutral: true });
  else hideFeedback();
  if (q.type === "choice") { els.primaryBtn.textContent = rec.revealed ? "下一题 →" : "选择答案"; els.primaryBtn.disabled = !rec.revealed; }
  else if (q.type === "fill") {
    const inputChanged = rec.revealed && (els.fillInput.value.trim() !== (rec.input || ""));
    if (rec.revealed && !inputChanged) { els.primaryBtn.textContent = "下一题 →"; els.primaryBtn.disabled = false; }
    else { els.primaryBtn.textContent = rec.revealed ? "重新提交" : "提交"; els.primaryBtn.disabled = !(els.fillInput.value||"").trim(); }
  }
  else { els.primaryBtn.textContent = rec.revealed ? "下一题 →" : "查看答案"; els.primaryBtn.disabled = false; }
}
function showFeedbackPanel(kind, q, opts) {
  els.feedbackPanel.dataset.state = kind;
  if (opts && opts.neutral) { els.feedbackTitle.textContent = "参考答案与解析"; els.feedbackIcon.textContent = "📖"; }
  else if (kind === "ok") { els.feedbackTitle.textContent = "答对啦 🎉"; els.feedbackIcon.textContent = "✓"; }
  else { els.feedbackTitle.textContent = "答案有误"; els.feedbackIcon.textContent = "✗"; }
  els.feedbackAnswer.textContent = q.answer || "暂无答案";
  if (q.analysis) { els.feedbackAnalysis.textContent = q.analysis; els.feedbackAnalysisBlock.style.display = ""; }
  else { els.feedbackAnalysisBlock.style.display = "none"; }
}
function hideFeedback() { els.feedbackPanel.dataset.state = "hidden"; }

/* ===== INTERACTIONS ===== */
function pickOption(key) {
  const q = currentQuestion(); if (!q || q.type !== "choice") return;
  const rec = recordFor(q.id);
  // 已经答对就不让再点
  if (rec.revealed && rec.correct) return;
  const btn = els.choiceArea.querySelector(`[data-option="${key}"]`);
  if (btn) addOptionRipple(btn);
  const isFirstAnswer = !rec.revealed;
  const correct = key === q.answer;
  rec.selected = key;
  // 错题记录只在首次答题时定，之后再选不改 correct（保证答错过的题永远在错题本里）
  if (isFirstAnswer) {
    rec.correct = correct;
    rec.firstWrong = !correct;
  } else if (correct) {
    // 答错后再选对：本次答对了，但 firstWrong 保留
    rec.correct = true;
  }
  rec.revealed = true;
  rec.answerDismissed = false;
  rec.attempts = (rec.attempts||0)+1;
  rec.lastAt = Date.now();
  if (isFirstAnswer) {
    updateStreak(correct); recordAnswer(correct);
  }
  if (correct) triggerCorrectFeedback(); else triggerWrongFeedback();
  shakeIcon();
  render();
  // 只在首次答题时触发15题节点动画
  if (isFirstAnswer && answeredCount % 15 === 0) {
    const role = chooseCheckpointMascot(correct);
    if (correct) {
      setTimeout(() => playMascotMoment(role, () => doGo(1)), 700);
    } else {
      pendingMascot = role;
    }
  } else if (correct) {
    scheduleAutoNext(true);
  }
}
function triggerCorrectFeedback() {
  if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  playCorrectSound();
  const card = els.questionCard;
  card.classList.remove("shake","wrong-border");
  card.classList.add("correct-flash","correct-border");
  setTimeout(() => card.classList.remove("correct-flash","correct-border"), 800);
  launchConfetti();
}
function triggerWrongFeedback() {
  if (navigator.vibrate) navigator.vibrate([80, 100, 80, 100, 80]);
  playWrongSound();
  const card = els.questionCard;
  card.classList.remove("correct-flash","correct-border");
  card.classList.add("shake","wrong-border");
  setTimeout(() => card.classList.remove("shake","wrong-border"), 600);
}
function handlePrimaryClick() {
  const q = currentQuestion(); if (!q) return;
  const rec = recordFor(q.id);
  if (q.type === "choice") { if (rec.revealed) go(1); return; }
  if (q.type === "fill") {
    const input = els.fillInput.value.trim(); if (!input) return;
    // 如果已答过且输入没变，跳下一题
    if (rec.revealed && input === (rec.input || "")) { go(1); return; }
    // 重新提交或首次提交
    rec.input = input; rec.correct = isFillCorrect(input, q.answer);
    rec.revealed = true; rec.answerDismissed = false; rec.attempts = (rec.attempts||0)+1; rec.lastAt = Date.now();
    updateStreak(rec.correct); recordAnswer(rec.correct);
    if (rec.correct) triggerCorrectFeedback(); else triggerWrongFeedback();
    shakeIcon();
    render();
    if (answeredCount % 15 === 0) {
      const role = chooseCheckpointMascot(rec.correct);
      if (rec.correct) { setTimeout(() => playMascotMoment(role, () => doGo(1)), 700); }
      else { pendingMascot = role; }
    } else {
      if (rec.correct) scheduleAutoNext(true);
    }
    return;
  }
  if (rec.revealed) { go(1); return; }
  rec.draft = els.memoryInput.value; rec.revealed = true; rec.answerDismissed = false; rec.lastAt = Date.now(); render();
}
function toggleMark() {
  const q = currentQuestion(); if (!q) return;
  const wasMarked = app.marked[q.id];
  if (wasMarked) { delete app.marked[q.id]; }
  else { app.marked[q.id] = Date.now(); launchCollectEffect(); }
  render();
}
function launchCollectEffect() {
  els.markBtn.classList.add("collecting");
  setTimeout(() => els.markBtn.classList.remove("collecting"), 500);
  // 聚拢粒子特效
  const rect = els.markBtn.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("span");
    p.className = "star-particle";
    p.style.left = rect.left + rect.width/2 + "px";
    p.style.top = rect.top + rect.height/2 + "px";
    p.style.position = "fixed";
    p.style.setProperty("--px", `${(Math.random()-0.5)*60}px`);
    p.style.setProperty("--py", `${(Math.random()-0.5)*60}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function updateStreak(c) { /* streak now updated only at checkpoints */ }
function currentQuestion() { return filteredQuestions()[app.index]; }
function go(delta) {
  clearAutoNext(); dismissFloatingAnswer();
  if (pendingMascot) {
    const role = pendingMascot;
    pendingMascot = null;
    playMascotMoment(role, () => doGo(delta));
    return;
  }
  doGo(delta);
}
function doGo(delta) {
  const list = filteredQuestions(); if (!list.length) return;
  app.index = Math.min(Math.max(app.index+delta,0), list.length-1); render();
}
function shuffle() { clearAutoNext(); dismissFloatingAnswer(); const list = filteredQuestions(); if (!list.length) return; app.index = Math.floor(Math.random()*list.length); render(); }
function clearAutoNext() { clearTimeout(autoNextTimer); autoNextTimer = 0; }
function scheduleAutoNext(ok) { clearAutoNext(); const l = filteredQuestions(); if (!ok || app.mode!=="practice" || !isMobileViewport() || app.index>=l.length-1) return; autoNextTimer = setTimeout(()=>go(1), 1350); }
function dismissFloatingAnswer() { const q = currentQuestion(); if (!q) return; const r = app.records[q.id]; if (!r||!r.revealed) return; r.answerDismissed = true; hideFeedback(); }
function isMobileViewport() { return matchMedia("(max-width:700px)").matches; }
function launchConfetti() {
  const layer = document.createElement("div"); layer.className = "confetti-burst";
  const colors = ["#58cc02","#1cb0f6","#ffc800","#ff86d6","#ff9600"];
  for (let i = 0; i < 36; i++) { const p = document.createElement("span"); p.style.setProperty("--x",`${Math.random()*100}vw`); p.style.setProperty("--dx",`${Math.random()*80-40}px`); p.style.setProperty("--rot",`${Math.random()*540-270}deg`); p.style.setProperty("--delay",`${Math.random()*0.18}s`); p.style.setProperty("--color",colors[i%colors.length]); layer.appendChild(p); }
  document.body.appendChild(layer); setTimeout(()=>layer.remove(), 1500);
}
function isFillCorrect(input, answer) { const ni = normalize(input); const ps = String(answer||"").split(/[;；,，、]/).map(x=>normalize(x)).filter(Boolean); if (!ps.length) return false; return ps.every(p=>ni.includes(p)); }
function normalize(t) { return String(t||"").toLowerCase().replace(/\s+/g,"").replace(/[，,；;。.\-_/、：:（）()]/g,""); }
function setDrawer(open) { document.body.classList.toggle("drawer-open", open); els.mobileMenuBtn.setAttribute("aria-expanded", String(open)); els.drawerOverlay.hidden = !open; }
function toggleDrawer() { setDrawer(!document.body.classList.contains("drawer-open")); }
function closeDrawerOnMobile() { setDrawer(false); }
function resetRecords() { app.records = {}; app.marked = {}; app.streak = 0; app.index = 0; answeredCount = 0; last15Results = []; render(); }
function shortLabel(q) { const p = {"选择题":"选","填空题":"填","算法填空":"算","问答题":"问","算法设计与分析题":"设"}[q.section]||"题"; return `${p}${q.number}`; }
function escapeHtml(t) { return String(t||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function escapeAttr(t) { return escapeHtml(t).replaceAll("\n"," "); }

function showModal({ type="info", icon="", title="", body="", confirmText="确认", cancelText="取消", onConfirm=null, onOk=null }) {
  const overlay = document.createElement("div");
  overlay.className = "custom-modal-overlay";
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  let iconHtml = "";
  if (icon) iconHtml = `<div class="custom-modal-icon ${type}">${icon}</div>`;
  let actionsHtml = "";
  if (onOk) {
    actionsHtml = `<div class="custom-modal-actions"><button class="btn-ok" type="button">${escapeHtml(confirmText)}</button></div>`;
  } else {
    actionsHtml = `<div class="custom-modal-actions"><button class="btn-cancel" type="button">${escapeHtml(cancelText)}</button><button class="btn-confirm" type="button">${escapeHtml(confirmText)}</button></div>`;
  }
  overlay.innerHTML = `<div class="custom-modal">${iconHtml}<div class="custom-modal-title">${title}</div><div class="custom-modal-body">${body}</div>${actionsHtml}</div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  if (onOk) {
    overlay.querySelector(".btn-ok").addEventListener("click", () => { onOk(); close(); });
  } else {
    overlay.querySelector(".btn-cancel").addEventListener("click", close);
    overlay.querySelector(".btn-confirm").addEventListener("click", () => { if (onConfirm) onConfirm(); close(); });
  }
  return close;
}

function bindSwipeNavigation() {
  els.questionCard.addEventListener("touchstart", e => { if (!isMobileViewport()||e.touches.length!==1) return; swipeStart = {x:e.touches[0].clientX, y:e.touches[0].clientY, at:Date.now()}; }, {passive:true});
  els.questionCard.addEventListener("touchend", e => { if (!swipeStart||!isMobileViewport()) return; const t=e.changedTouches[0], dx=t.clientX-swipeStart.x, dy=t.clientY-swipeStart.y, el=Date.now()-swipeStart.at; swipeStart=null; if (el>700||Math.abs(dx)<70||Math.abs(dy)>55) return; go(dx<0?1:-1); }, {passive:true});
}

function bindEvents() {
  els.modeTabs.forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.mode) { app.mode = btn.dataset.mode; app.status = "all"; }
    if (btn.dataset.status) { app.status = btn.dataset.status; app.mode = btn.dataset.status === "marked" ? "memorize" : "practice"; }
    app.index = 0; initFilters(); render(); closeDrawerOnMobile();
  }));

  // Custom dropdown: section
  els.sectionToggle.addEventListener("click", e => { e.stopPropagation(); toggleDropdown(els.sectionDropdown, els.sectionMenu); });
  els.sectionMenu.addEventListener("click", e => {
    const btn = e.target.closest(".dropdown-item"); if (!btn) return;
    app.section = btn.dataset.value; app.index = 0;
    closeAllDropdowns(); initFilters(); render(); closeDrawerOnMobile();
  });

  // Custom dropdown: status
  els.statusToggle.addEventListener("click", e => { e.stopPropagation(); toggleDropdown(els.statusDropdown, els.statusMenu); });
  els.statusMenu.addEventListener("click", e => {
    const btn = e.target.closest(".dropdown-item"); if (!btn) return;
    app.status = btn.dataset.value; app.index = 0;
    closeAllDropdowns(); initFilters(); render(); closeDrawerOnMobile();
  });

  // Close dropdowns on outside click
  document.addEventListener("click", () => closeAllDropdowns());

  els.searchInput.addEventListener("input", () => { app.query = els.searchInput.value; app.index = 0; render(); });
  els.questionNav.addEventListener("click", e => { const b = e.target.closest("[data-index]"); if (!b) return; app.index = Number(b.dataset.index); render(); closeDrawerOnMobile(); });
  els.choiceArea.addEventListener("click", e => { const b = e.target.closest("[data-option]"); if (!b||b.disabled) return; pickOption(b.dataset.option); });
  els.primaryBtn.addEventListener("click", handlePrimaryClick);
  els.feedbackPanel.addEventListener("click", () => { if (els.feedbackPanel.dataset.state !== "hidden") dismissFloatingAnswer(); });
  els.prevBtn.addEventListener("click", () => go(-1));
  els.nextBtn.addEventListener("click", () => go(1));
  els.markBtn.addEventListener("click", toggleMark);
  els.shuffleBtn.addEventListener("click", shuffle);
  if (els.resetBtn) els.resetBtn.addEventListener("click", () => {
    showModal({
      type: "danger", icon: "⚠️", title: "重新刷题",
      body: "这将清除所有刷题记录和收藏，恢复初始状态，确定要重新开始吗？",
      confirmText: "确认重置", cancelText: "取消",
      onConfirm: resetRecords
    });
  });
  els.restartBtn.addEventListener("click", () => {
    showModal({
      type: "danger", icon: "⚠️", title: "重新刷题",
      body: "这将清除所有刷题记录和收藏，恢复初始状态，确定要重新开始吗？",
      confirmText: "确认重置", cancelText: "取消",
      onConfirm: resetRecords
    });
  });
  els.importFile.addEventListener("change", async () => {
    const f = els.importFile.files && els.importFile.files[0]; if (!f) return;
    try { importQuestionBank(JSON.parse(await f.text())); } catch(e) {
      showModal({ type: "danger", icon: "❌", title: "导入失败", body: e.message, confirmText: "知道了", onOk: () => {} });
    }
    finally { els.importFile.value = ""; }
  });
  els.restoreBankBtn.addEventListener("click", restoreDefaultBank);
  els.mobileMenuBtn.addEventListener("click", toggleDrawer);
  els.drawerOverlay.addEventListener("click", () => setDrawer(false));
  els.fillInput.addEventListener("input", () => { const q = currentQuestion(); if (!q||q.type!=="fill"||recordFor(q.id).revealed) return; els.primaryBtn.disabled = !els.fillInput.value.trim(); });
  els.fillInput.addEventListener("keydown", e => { if (e.key === "Enter") handlePrimaryClick(); });
  els.memoryInput.addEventListener("input", () => { const q = currentQuestion(); if (q) { recordFor(q.id).draft = els.memoryInput.value; saveState(); } });
  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    if (e.key==="ArrowLeft") go(-1); else if (e.key==="ArrowRight") go(1);
    else if (e.key==="Enter") { e.preventDefault(); handlePrimaryClick(); }
    else if (/^[a-dA-D]$/.test(e.key)) { const q=currentQuestion(); if (q&&q.type==="choice") pickOption(e.key.toUpperCase()); }
  });
  bindSwipeNavigation();
}

/* ===== 15-QUESTION MASCOT CHECKPOINT ===== */

/* ===== UNIFIED MASCOT SYSTEM ===== */
let answeredCount = 0;
let pendingMascot = null;
let last15Results = [];
let mascotTimeline = null;

const MASCOT_CONFIG = {
  gru: { image: "./assets/gru-front.webp", duration: 2300, particle: "celebrate", lines: ["这一组收得很漂亮，继续保持！","咕噜检测到：你刚刚状态很好！","这 15 题刷得很顺，下一组继续冲！","漂亮！你已经进入节奏了！","这一波很稳，继续保持手感！"] },
  boobo: { image: "./assets/boobo-front.webp", duration: 2300, particle: "blueDots", lines: ["啵！这一组完成啦，下一组慢慢变强。","刚刚有几题挺关键，继续保持节奏。","啵啵觉得，你正在越来越稳。","这 15 题过关，下一组继续观察！","有几题可以回头看看，但整体不错。","啵？状态好像慢慢起来了。"] },
  mimo: { image: "./assets/mimo-front.webp", duration: 2300, particle: "softDots", lines: ["没关系，这题先记住，下一组慢慢来。","错在这里不是坏事，说明重点被找到了。","先别急着否定自己，下一组我们稳一点。","这一题有点绕，绵绵陪你翻过去。","这题先收进错题里，之后会变成你的分数。","刚刚那题不简单，先放下，下一组重新开始。"] },
  waiwai: { image: "./assets/waiwai-front.webp", duration: 2300, particle: "marks", lines: ["这题有点坏，记住它，下次别让它骗到。","第 15 题还来挖坑，题目真会挑时间。","被它偷袭了一下，不丢人。","这题先记仇，下一组再打回来。","刚刚那题不太老实，歪歪已经盯上它了。","别看我，我也觉得它阴险。"] },
  dodo: { image: "./assets/dodo-front.webp", duration: 2400, particle: "yellowBubbles", lines: ["15 题完成啦，豆豆建议你眨眨眼。","脑子已经热起来了，下一组慢慢来。","这一组结束，豆豆给你盖个小章。","可以继续，也可以先喘一口气。","刷了这么久，喝口水不算偷懒。","豆豆觉得你已经很努力了，下一组别急。"] }
};

const MASCOT_ANIM = {
  gru: { from: { y: 120, scale: 0.62, rotation: -8 }, to: { y: 0, scale: 1, rotation: 0 }, keyframes: [{ t: 0.42, y: -24, scale: 1.14, rotation: 4 }, { t: 0.62, y: 8, scale: 0.96, rotation: -2 }, { t: 0.78, y: -10, scale: 1.04, rotation: 1 }], ease: "cubic-bezier(.18,1.35,.36,1)" },
  boobo: { from: { y: 100, scale: 0.72, rotation: -6 }, to: { y: 0, scale: 1, rotation: 0 }, keyframes: [{ t: 0.36, y: -14, scale: 1.08, rotation: 4 }, { t: 0.56, y: 6, scale: 0.98, rotation: -3 }, { t: 0.74, y: -5, scale: 1.03, rotation: 2 }], ease: "cubic-bezier(.2,1.2,.28,1)" },
  mimo: { from: { y: 40, scale: 0.72, rotation: 0 }, to: { y: 0, scale: 1, rotation: 0 }, keyframes: [{ t: 0.38, y: -8, scale: 1.08, rotation: 0 }, { t: 0.62, y: 4, scale: 0.98, rotation: 0 }, { t: 0.82, y: -3, scale: 1.03, rotation: 0 }], ease: "cubic-bezier(.2,1.2,.3,1)" },
  waiwai: { from: { x: -90, y: 26, scale: 0.72, rotation: -16 }, to: { x: 0, y: 0, scale: 1, rotation: 0 }, keyframes: [{ t: 0.38, x: 16, y: -8, scale: 1.08, rotation: 8 }, { t: 0.58, x: -8, y: 4, scale: 0.98, rotation: -5 }, { t: 0.76, x: 4, y: -2, scale: 1.03, rotation: 3 }], ease: "cubic-bezier(.16,1.25,.34,1)" },
  dodo: { from: { y: 80, scale: 0.82, rotation: 0 }, to: { y: 0, scale: 1, rotation: 0 }, keyframes: [{ t: 0.36, y: -8, scale: 1.04, rotation: 0 }, { t: 0.56, y: 6, scale: 0.98, rotation: 0 }, { t: 0.76, y: -3, scale: 1.02, rotation: 0 }], ease: "cubic-bezier(.18,1.15,.32,1)" }
};

function playMascotMoment(role, onComplete) {
  const config = MASCOT_CONFIG[role];
  if (!config) { if (onComplete) onComplete(); return; }

  // GSAP not loaded? skip silently.
  if (typeof gsap === "undefined") { if (onComplete) onComplete(); return; }

  // Kill existing timeline if another animation is in progress
  if (mascotTimeline) { mascotTimeline.kill(); mascotTimeline = null; }

  const overlay = document.getElementById("mascotOverlay");
  const img = document.getElementById("mascotImg");
  const bubble = document.getElementById("mascotBubble");

  bubble.textContent = config.lines[Math.floor(Math.random() * config.lines.length)];

  const preload = new Image();
  preload.onload = function () {
    img.src = config.image;
    // Make overlay visible
    overlay.style.display = "flex";
    overlay.style.opacity = 0;
    overlay.classList.add(`role-${role}`);

    const anim = MASCOT_ANIM[role];

    // Set image initial state
    gsap.set(img, { opacity: 0, x: anim.from.x || 0, y: anim.from.y || 0, scale: anim.from.scale, rotation: anim.from.rotation || 0, transformOrigin: "center bottom" });
    gsap.set(bubble, { opacity: 0, y: 12, scale: 0.94 });

    mascotTimeline = gsap.timeline({
      onComplete: () => {
        overlay.style.display = "none";
        overlay.className = "mascot-overlay";
        clearMascotParticles();
        mascotTimeline = null;
        triggerFireBurst();
        if (onComplete) onComplete();
      }
    });

    // 1. Overlay fade in (0.28s)
    mascotTimeline.to(overlay, { opacity: 1, duration: 0.28, ease: "power2.out" });

    // 2. Image enter with elastic bounce (1s)
    const easeMap = { gru: "elastic.out(1, 0.4)", boobo: "elastic.out(1, 0.5)", mimo: "elastic.out(1, 0.55)", waiwai: "back.out(2.5)", dodo: "elastic.out(1, 0.6)" };
    mascotTimeline.to(img, {
      opacity: 1,
      x: anim.to.x || 0,
      y: anim.to.y || 0,
      scale: anim.to.scale,
      rotation: anim.to.rotation || 0,
      duration: 1.0,
      ease: easeMap[role] || "elastic.out(1, 0.5)"
    }, "<");

    // 3. Bubble pop in (delayed)
    mascotTimeline.to(bubble, {
      opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)"
    }, "-=0.4");

    // 4. Particles (synchronous, fire-and-forget)
    if (config.particle === "celebrate") createCelebrateParticles(false);
    else if (config.particle === "blueDots") createFloatingDots("boobo-dot", ["#59b8ff","#9bd8ff","#c8ecff","#7cc8ff"], 16, 1300, false);
    else if (config.particle === "softDots") createFloatingDots("mimo-soft-dot", ["#ff9fbd","#ffc6d8","#ffdce7","#ffb3cc"], 18, 1500, false);
    else if (config.particle === "yellowBubbles") createFloatingDots("dodo-bubble-dot", ["#ffd36a","#ffe39b","#ffc24b","#fff0c2"], 14, 1700, false);
    else if (config.particle === "marks") createWaiwaiMarks(false);

    // 5. Hold for 1.2s
    mascotTimeline.to({}, { duration: 1.2 });

    // 6. Fade out (0.3s)
    mascotTimeline.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" });
  };

  preload.onerror = function () {
    if (onComplete) onComplete();
  };
  preload.src = config.image;
}

function createMascotParticle(type) {
  clearMascotParticles();
  if (type === "celebrate") createCelebrateParticles(false);
  else if (type === "blueDots") createFloatingDots("boobo-dot", ["#59b8ff","#9bd8ff","#c8ecff","#7cc8ff"], 16, 1300, false);
  else if (type === "softDots") createFloatingDots("mimo-soft-dot", ["#ff9fbd","#ffc6d8","#ffdce7","#ffb3cc"], 18, 1500, false);
  else if (type === "yellowBubbles") createFloatingDots("dodo-bubble-dot", ["#ffd36a","#ffe39b","#ffc24b","#fff0c2"], 14, 1700, false);
  else if (type === "marks") createWaiwaiMarks(false);
}
function createFloatingDots(cls, colors, count, dur, reduced) {
  if (reduced) { count = Math.max(3, Math.floor(count * 0.4)); }
  const c = document.getElementById("mascotParticles");
  for (let i = 0; i < count; i++) { const d = document.createElement("span"); d.className = cls; const a = Math.random()*Math.PI*2, dist = 45+Math.random()*85; d.style.setProperty("--x",`${Math.cos(a)*dist}px`); d.style.setProperty("--y",`${Math.sin(a)*dist-25}px`); d.style.background = colors[Math.floor(Math.random()*colors.length)]; const s = 5+Math.random()*9; d.style.width=`${s}px`; d.style.height=`${s}px`; d.style.animationDelay=`${Math.random()*220}ms`; d.style.animationDuration=`${reduced ? 400 : dur}ms`; c.appendChild(d); setTimeout(()=>d.remove(), reduced ? 400 : dur); }
}
function createCelebrateParticles(reduced) {
  const c = document.getElementById("mascotParticles"); const colors = ["#58cc02","#1cb0f6","#ff9600","#ce82ff","#ff4b4b"]; const count = reduced ? 8 : 28;
  for (let i = 0; i < count; i++) { const p = document.createElement("span"); p.className = "mascot-particle"; const a = (Math.PI*2*i)/count, dist = 90+Math.random()*110; p.style.setProperty("--x",`${Math.cos(a)*dist}px`); p.style.setProperty("--y",`${Math.sin(a)*dist}px`); p.style.background = colors[Math.floor(Math.random()*colors.length)]; const s = 6+Math.random()*8; p.style.width=`${s}px`; p.style.height=`${s}px`; p.style.animationDuration=`${reduced ? 400 : 900}ms`; c.appendChild(p); setTimeout(()=>p.remove(), reduced ? 400 : 1000); }
}
function createWaiwaiMarks(reduced) {
  const c = document.getElementById("mascotParticles"); const marks = ["?","!","#","…","?!"]; const count = reduced ? 4 : 12;
  for (let i = 0; i < count; i++) { const m = document.createElement("span"); m.className = "waiwai-mark"; m.textContent = marks[Math.floor(Math.random()*marks.length)]; const a = Math.random()*Math.PI*2, dist = 60+Math.random()*90; m.style.setProperty("--x",`${Math.cos(a)*dist}px`); m.style.setProperty("--y",`${Math.sin(a)*dist-20}px`); m.style.setProperty("--r",`${-24+Math.random()*48}deg`); m.style.animationDelay=`${Math.random()*180}ms`; m.style.animationDuration=`${reduced ? 400 : 950}ms`; c.appendChild(m); setTimeout(()=>m.remove(), reduced ? 400 : 1200); }
}
function clearMascotParticles() { const c = document.getElementById("mascotParticles"); if (c) c.innerHTML = ""; }

function triggerFireBurst() {
  const icon = document.getElementById("streakIcon");
  const count = document.getElementById("streakCount");
  if (!icon || !count) return;
  if (typeof gsap === "undefined") return;

  // Update mood text
  count.textContent = getMoodWord(answeredCount);

  // Text orange flash
  gsap.fromTo(count, { color: "#ff4500" }, { color: "#4b4b4b", duration: 1.2, ease: "power2.out" });
}

// 每道题答完后图标抖动+轻微放大（Keynote风格）
function shakeIcon() {
  const icon = document.getElementById("streakIcon");
  if (!icon || typeof gsap === "undefined") return;
  gsap.timeline()
    .to(icon, { scale: 1.2, duration: 0.06, ease: "power2.out" })
    .to(icon, { x: -3, duration: 0.04, ease: "power1.inOut" })
    .to(icon, { x: 3, duration: 0.04, ease: "power1.inOut" })
    .to(icon, { x: -2, duration: 0.04, ease: "power1.inOut" })
    .to(icon, { x: 2, duration: 0.04, ease: "power1.inOut" })
    .to(icon, { x: -1, duration: 0.03, ease: "power1.inOut" })
    .to(icon, { x: 0, scale: 1, duration: 0.15, ease: "power2.out" });
}



function recordAnswer(isCorrect) { last15Results.push({ correct: isCorrect }); if (last15Results.length > 15) last15Results.shift(); answeredCount++; }

function chooseCheckpointMascot(isCorrect) {
  const total = last15Results.length, correctCount = last15Results.filter(r => r.correct).length;
  const accuracy = total > 0 ? correctCount / total : 0;
  if (isCorrect) { if (accuracy >= 0.85) return "gru"; if (accuracy >= 0.6) return "boobo"; return "dodo"; }
  else { if (accuracy < 0.6) return "mimo"; return "waiwai"; }
}

/* ===== OPTION RIPPLE EFFECT ===== */
function addOptionRipple(btn) { btn.style.setProperty("--cx","50%"); btn.style.setProperty("--cy","50%"); btn.classList.add("ripple"); setTimeout(()=>btn.classList.remove("ripple"), 400); }

initFilters(); bindEvents(); render();

// 预加载所有角色图片
Object.values(MASCOT_CONFIG).forEach(c => { const i = new Image(); i.src = c.image; });

/* ===== RIGHT PANEL UPDATE ===== */
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
  if (!rpDone) return; // right panel not in DOM (mobile)

  // Stats
  const done = questions.filter(q => { const r = app.records[q.id]; return r && (r.revealed || r.correct !== null); }).length;
  const checked = Object.values(app.records).filter(r => r.correct !== null);
  const correct = checked.filter(r => r.correct === true).length;
  const accuracy = checked.length ? Math.round((correct / checked.length) * 100) : 0;
  rpDone.textContent = done;
  rpAccuracy.textContent = accuracy + "%";
  rpStreak.textContent = app.streak || 0;
  rpMarked.textContent = Object.keys(app.marked).length;

  // Energy (progress toward next 15-question checkpoint)
  const progress = answeredCount % 15;
  const left = 15 - progress;
  rpEnergyFill.style.width = Math.round((progress / 15) * 100) + "%";
  rpEnergyLeft.textContent = left;

  // Mascot (based on recent performance)
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
  rpMascotImg.src = MASCOT_CONFIG[mascotRole].image;
  rpMascotLine.textContent = '"' + mascotLine + '"';

  // Tips (find most common wrong sections)
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

// Hook into render
const _origRender = render;
render = function() { _origRender(); updateRightPanel(); };

