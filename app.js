// ===== 题库注册表（内置 + 自定义导入） =====
const CURRENT_BANK_KEY = "quiz-current-bank";
const CUSTOM_BANKS_KEY = "quiz-custom-banks";
const STATE_PREFIX = "quiz-state::";
const LEGACY_STATE_KEY = "algorithm-review-quiz-v2";

let groups = buildGroups();
let currentBankId = pickInitialBankId();
let bank = normalizeBankObj(bankById(currentBankId));
let questions = bank.questions || [];
let app = loadState(currentBankId);

const openSubjects = new Set();
{ const g0 = groupOfBank(currentBankId); if (g0) openSubjects.add(g0.subject); }

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_STANDALONE = Boolean(window.navigator.standalone) || window.matchMedia?.("(display-mode: standalone)")?.matches;
const PERFORMANCE_MODE = Boolean(
  IS_IOS ||
  IS_STANDALONE ||
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ||
  window.matchMedia?.("(max-width: 700px) and (pointer: coarse)")?.matches
);
document.documentElement.classList.toggle("perf-lite", PERFORMANCE_MODE);

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
  bankPicker: document.querySelector("#bankPicker"),
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
  questionBody: document.querySelector(".question-body"),
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

// 把注册表里的题库对象 {id,title,source,questions} 归一化为运行用的 {meta,questions}
function normalizeBankObj(b) {
  if (!b) return normalizeQuestionBank({}, "题库");
  return normalizeQuestionBank({ meta: { title: b.title, source: b.source || b.title }, questions: b.questions }, b.title);
}
function loadCustomBanks() {
  try { const a = JSON.parse(localStorage.getItem(CUSTOM_BANKS_KEY) || "[]"); return Array.isArray(a) ? a : []; }
  catch { return []; }
}
function saveCustomBanks(list) { localStorage.setItem(CUSTOM_BANKS_KEY, JSON.stringify(list)); }
// 组装科目分组：内置（操作系统等，来自 banks.js）+ 算法（来自 data.js）+ 我的导入
function buildGroups() {
  const g = [];
  if (Array.isArray(window.QUIZ_BANKS)) {
    window.QUIZ_BANKS.forEach(grp => g.push({ subject: grp.subject, builtin: true, banks: orderBanksForSubject(grp.subject, (grp.banks || []).map(b => ({ ...b }))) }));
  }
  if (window.QUESTION_BANK && Array.isArray(window.QUESTION_BANK.questions) && window.QUESTION_BANK.questions.length) {
    g.push({ subject: "算法设计与分析", builtin: true, banks: [{
      id: "algo",
      title: window.QUESTION_BANK.meta?.title || "算法复习",
      source: window.QUESTION_BANK.meta?.source || "算法设计与分析",
      questions: window.QUESTION_BANK.questions
    }] });
  }
  const custom = loadCustomBanks();
  if (custom.length) g.push({ subject: "我的导入", builtin: false, banks: custom });
  return g;
}
function orderBanksForSubject(subject, banks) {
  if (subject !== "操作系统") return banks;
  const review = banks.filter(b => b.id === "os-review" || b.title === "综合复习题库");
  const rest = banks.filter(b => !(b.id === "os-review" || b.title === "综合复习题库"));
  return [...rest, ...review];
}
function allBanks() { return groups.flatMap(g => g.banks); }
function bankById(id) { return allBanks().find(b => b.id === id) || null; }
function groupOfBank(id) { return groups.find(g => g.banks.some(b => b.id === id)) || null; }
function pickInitialBankId() {
  const saved = localStorage.getItem(CURRENT_BANK_KEY);
  if (saved && bankById(saved)) return saved;
  const first = allBanks()[0];
  return first ? first.id : null;
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
// 切换到指定题库：保存当前进度 → 载入目标题库及其独立进度
function selectBank(id) {
  if (!id || !bankById(id)) return;
  if (id === currentBankId) { closeDrawerOnMobile(); return; }
  saveState();
  currentBankId = id;
  localStorage.setItem(CURRENT_BANK_KEY, id);
  bank = normalizeBankObj(bankById(id));
  questions = bank.questions || [];
  app = loadState(id);
  answeredCount = 0; last15Results = [];
  const g = groupOfBank(id); if (g) openSubjects.add(g.subject);
  closeAllDropdowns();
  initFilters(); renderBankPicker(); render();
  closeDrawerOnMobile();
}

// 导入的题库作为自定义题库追加并选中
function importQuestionBank(input) {
  const nb = normalizeQuestionBank(input, "导入题库"); if (!nb.questions.length) throw new Error("没有找到有效题目");
  const custom = loadCustomBanks();
  const id = "custom-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1000);
  custom.push({ id, title: nb.meta.title || "导入题库", source: nb.meta.source || nb.meta.title || "导入题库", questions: nb.questions });
  saveCustomBanks(custom);
  groups = buildGroups();
  selectBank(id);
  if (els.importHint) els.importHint.textContent = `已导入「${nb.meta.title}」· ${nb.questions.length} 题`;
  return nb;
}

// 删除自定义题库（内置题库不可删）
function deleteCustomBank(id) {
  const b = bankById(id); if (!b) return;
  showModal({
    type: "danger", icon: "🗑", title: "删除题库",
    body: `将删除导入的题库「${b.title}」及其刷题记录，是否继续？`,
    confirmText: "删除", cancelText: "取消",
    onConfirm: () => {
      saveCustomBanks(loadCustomBanks().filter(x => x.id !== id));
      localStorage.removeItem(stateKey(id));
      groups = buildGroups();
      if (currentBankId === id) {
        const firstId = allBanks()[0]?.id || null;
        currentBankId = firstId;
        if (firstId) localStorage.setItem(CURRENT_BANK_KEY, firstId);
        bank = normalizeBankObj(bankById(firstId));
        questions = bank.questions || [];
        app = loadState(firstId);
        answeredCount = 0; last15Results = [];
      }
      initFilters(); renderBankPicker(); render();
    }
  });
}

// 渲染左侧栏题库选择（按科目分组折叠）
function renderBankPicker() {
  const host = els.bankPicker;
  if (!host) return;
  host.innerHTML = groups.map(g => {
    const open = openSubjects.has(g.subject);
    const items = g.banks.map(b => {
      const active = b.id === currentBankId;
      const count = (b.questions || []).length;
      const del = g.builtin ? "" : `<span class="bank-del" data-del="${escapeAttr(b.id)}" role="button" title="删除题库">✕</span>`;
      return `<button class="bank-item${active ? " active" : ""}" type="button" data-bank="${escapeAttr(b.id)}"><span class="bank-item-title">${escapeHtml(b.title)}</span><span class="bank-count">${count}</span>${del}</button>`;
    }).join("");
    return `<div class="bank-group${open ? " open" : ""}" data-subject="${escapeAttr(g.subject)}">
      <button class="bank-group-head" type="button"><span class="bank-group-name">${escapeHtml(g.subject)}</span><span class="bank-group-arrow">▾</span></button>
      <div class="bank-group-body">${items}</div>
    </div>`;
  }).join("");
}
window.importQuestionBank = importQuestionBank;

let swipeStart = null;
let autoNextTimer = 0;
let _feedbackDelayTimer = 0;

function stateKey(id) { return STATE_PREFIX + id; }
function loadState(id) {
  const f = { mode: "practice", section: "全部题型", status: "all", query: "", index: 0, records: {}, marked: {}, streak: 0 };
  if (!id) return f;
  let raw = localStorage.getItem(stateKey(id));
  if (!raw && id === "algo") { const legacy = localStorage.getItem(LEGACY_STATE_KEY); if (legacy) raw = legacy; }
  try { return { ...f, ...JSON.parse(raw || "{}") }; } catch { return f; }
}
function saveState() { if (currentBankId) localStorage.setItem(stateKey(currentBankId), JSON.stringify(app)); }
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

// 切到新题时让题卡淡入+轻微上滑；性能模式或无 GSAP 时跳过
let lastShownId = null;
function animateCardIn() {
  // GSAP 未加载，动画由 CSS transition 处理，此函数保留供将来扩展
}

function renderQuestion(q, list) {
  const rec = recordFor(q.id), reveal = app.mode === "memorize" || rec.revealed;
  els.typeBadge.textContent = q.section; els.progressText.textContent = `${app.index + 1} / ${list.length}`;
  els.questionTitle.textContent = q.title; els.questionPrompt.textContent = q.prompt || q.title;
  els.markBtn.classList.toggle("active", Boolean(app.marked[q.id]));
  els.markBtn.setAttribute("aria-pressed", String(Boolean(app.marked[q.id])));
  els.markIcon.innerHTML = app.marked[q.id]
    ? `<img src="./assets/star.webp" class="mark-star-img active" alt="">`
    : `<img src="./assets/star.webp" class="mark-star-img" alt="">`;
  els.prevBtn.disabled = app.index === 0; els.nextBtn.disabled = app.index === list.length - 1;
  els.primaryBtn.disabled = false;
  const canProceed = reveal || rec.correct === false;
  els.primaryBtn.dataset.state = canProceed ? "next" : "check";
  if (q.type === "choice" && !canProceed && app.mode !== "memorize") {
    els.primaryBtn.disabled = true;
    els.primaryBtn.textContent = "请选择答案";
  } else {
    els.primaryBtn.textContent = canProceed ? "下一题" : (app.mode === "memorize" ? "显示答案" : "检查答案");
  }

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
      const selected = rec.selected === opt.key;
      const isCorrect = normalizeAnswer(opt.key) === normalizeAnswer(q.answer);
      // reveal 为 true：已揭示全部答案（正确或点过下一题）
      // rec.correct === false 且 !reveal：选错后在等待期，只标红错误选项，不透露正确答案
      if (reveal) {
        if (isCorrect) { cls += " correct"; mark = `<img src="./assets/check-mark.webp" class="option-mark-img" alt="">`; }
        else if (selected) { cls += " wrong"; mark = `<img src="./assets/x-mark.webp" class="option-mark-img" alt="">`; }
      } else if (rec.correct === false && selected) {
        cls += " wrong"; mark = `<img src="./assets/x-mark.webp" class="option-mark-img" alt="">`;
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

  if (reveal) {
    clearTimeout(_feedbackDelayTimer);
    _feedbackDelayTimer = setTimeout(() => showFeedback(q, rec.correct !== false), 650);
  } else if (rec.correct === false) {
    // 选错后 4 秒才揭示正确选项 + 弹出解析
    clearTimeout(_feedbackDelayTimer);
    _feedbackDelayTimer = setTimeout(() => {
      rec.revealed = true;
      // 手动更新选项样式，不触发 render 避免递归计时器
      els.choiceArea?.querySelectorAll(".option-btn").forEach(btn => {
        const key = btn.dataset.key;
        const isCorrect = normalizeAnswer(key) === normalizeAnswer(q.answer);
        const selected = key === rec.selected;
        if (isCorrect) {
          btn.classList.add("correct");
          const mark = btn.querySelector(".option-mark");
          if (mark) mark.innerHTML = `<img src="./assets/check-mark.webp" class="option-mark-img" alt="">`;
        } else if (selected) {
          btn.classList.add("wrong");
          const mark = btn.querySelector(".option-mark");
          if (mark) mark.innerHTML = `<img src="./assets/x-mark.webp" class="option-mark-img" alt="">`;
        }
        btn.disabled = true;
      });
      els.primaryBtn.textContent = "下一题";
      els.primaryBtn.dataset.state = "next";
      showFeedback(q, false);
    }, 4000);
  } else {
    hideFeedback();
    clearTimeout(_feedbackDelayTimer);
  }

  if (q.id !== lastShownId) { lastShownId = q.id; animateCardIn(); }
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
  if (correct) {
    const imgs = ["./assets/correct-sunglasses.webp", "./assets/correct-glow.webp", "./assets/correct-celebrate.webp"];
    els.feedbackIcon.innerHTML = `<img src="${imgs[Math.floor(Math.random() * 3)]}" class="feedback-icon-img" alt="">`;
  } else {
    els.feedbackIcon.innerHTML = `<img src="./assets/wrong-speechless.webp" class="feedback-icon-img" alt="">`;
  }
  els.feedbackTitle.textContent = correct ? "回答正确" : "回答错误";
  els.feedbackAnswer.textContent = q.answer || "无";
  const hasAnalysis = Boolean(String(q.analysis || "").trim());
  els.feedbackAnalysis.textContent = q.analysis || "";
  els.feedbackAnalysisBlock.style.display = hasAnalysis ? "grid" : "none";
}
function hideFeedback() {
  clearTimeout(_feedbackDelayTimer);
  if (els.feedbackPanel.dataset.state === "hidden") return;
  els.feedbackPanel.classList.add("pop-burst");
  els.feedbackPanel.addEventListener("animationend", function h() {
    els.feedbackPanel.removeEventListener("animationend", h);
    els.feedbackPanel.classList.remove("pop-burst");
    els.feedbackPanel.dataset.state = "hidden";
  }, { once: true });
}
function shortLabel(q) { const p = {"选择题":"选","填空题":"填","算法填空":"算","问答题":"问","算法设计题":"设","算法设计与分析题":"设","单选题":"单","判断题":"判","分析题":"析","应用题":"用","综合题":"综","基础概念":"基","易错辨析":"易","应用提高":"高"}[q.section]||"题"; return `${p}${q.number}`; }
function escapeHtml(t) { return String(t||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function escapeAttr(t) { return escapeHtml(t); }

function clearAutoNext() { if (autoNextTimer) { clearTimeout(autoNextTimer); autoNextTimer = 0; } }
function goToIndex(nextIndex) { clearTimeout(_feedbackDelayTimer); clearAutoNext(); app.index = Math.max(0, Math.min(nextIndex, filteredQuestions().length - 1)); render(); }
function doGo(step) { const list = filteredQuestions(); if (!list.length) return; goToIndex(app.index + step); }
function nextQuestion() { doGo(1); }
function prevQuestion() { doGo(-1); }

function selectChoice(key) {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  // 已揭示的题目不允许再选；选错后（未揭示）允许再次选择
  if (rec.revealed) return;
  clearAutoNext();
  rec.selected = key;
  checkCurrentAnswer();
}

function checkCurrentAnswer() {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  if (q.type === "choice") {
    if (!rec.selected) return;
    const isFirstAttempt = rec.correct === null;
    const correct = normalizeAnswer(rec.selected) === normalizeAnswer(q.answer);

    if (isFirstAttempt) {
      rec.correct = correct;
      rec.attempts = (rec.attempts || 0) + 1;
      if (!correct && rec.firstWrong == null) rec.firstWrong = true;
      if (correct) { app.streak = (app.streak || 0) + 1; playCorrectSound(); }
      else { app.streak = 0; playWrongSound(); }
      recordAnswer(correct);
    }

    if (correct) {
      rec.revealed = true;
      if (isFirstAttempt) { pulseStreak(); flashCorrect(); }
      else { playCorrectSound(); flashCorrect(); }
    }

    render();
    if (!correct && q.type === "choice") {
      // render 后 DOM 已重建，延迟触发选中按钮抖动
      setTimeout(() => shakeWrong(rec.selected), 50);
    } else if (!correct) {
      shakeWrong();
    }
    if (isFirstAttempt && answeredCount % 10 === 0) {
      setTimeout(() => {
        const role = chooseCheckpointMascot(correct);
        playMascotMoment(role, correct ? () => nextQuestion() : null);
      }, correct ? 700 : 500);
    } else if (correct) {
      // 答对自动跳下一题（非弹窗时机）
      autoNextTimer = setTimeout(() => nextQuestion(), 1300);
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
    setTimeout(() => {
      const role = chooseCheckpointMascot(rec.correct);
      playMascotMoment(role, rec.correct ? () => doGo(1) : null);
    }, rec.correct ? 700 : 500);
  } else if (rec.correct) {
    autoNextTimer = setTimeout(() => doGo(1), 1300);
  }
}

function handlePrimaryAction() {
  const list = filteredQuestions();
  const q = list[app.index];
  if (!q) return;
  const rec = recordFor(q.id);
  const canProceed = rec.revealed || rec.correct === false;
  if (canProceed || app.mode === "memorize" && els.primaryBtn.dataset.state === "next") {
    // 选错后点下一题时标记为已揭示，方便下次回顾
    if (!rec.revealed && rec.correct === false) rec.revealed = true;
    nextQuestion();
    return;
  }
  if (q.type === "choice") return;
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
      <div class="custom-modal-icon">${icon}</div>
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
    if (img) img.src = document.body.classList.contains("dark") ? "./assets/moon.webp" : "./assets/sun2.webp";
  }
  const meta = document.querySelector("#themeColorMeta");
  if (meta) meta.content = document.body.classList.contains("dark") ? "#101314" : "#f8fbf5";
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
  els.restartBtn?.addEventListener("click", () => showModal({ icon: `<img src="./assets/question-icon.webp" class="modal-icon-img" alt="">`, title: "重新刷题", body: "这会清空当前题库的刷题记录和收藏，是否继续？", confirmText: "确认重置", cancelText: "取消", onConfirm: resetRecords }));
  els.bankPicker?.addEventListener("click", e => {
    const del = e.target.closest(".bank-del");
    if (del) { e.stopPropagation(); deleteCustomBank(del.dataset.del); return; }
    const item = e.target.closest(".bank-item");
    if (item) { selectBank(item.dataset.bank); return; }
    const head = e.target.closest(".bank-group-head");
    if (head) {
      const subject = head.parentElement?.dataset.subject;
      if (subject) { openSubjects.has(subject) ? openSubjects.delete(subject) : openSubjects.add(subject); renderBankPicker(); }
    }
  });
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
    lines: [
      "满分节奏！你是我的神！",        // ≥90%
      "太强了，继续保持这个手感。",      // ≥80%
      "做得不错，稳稳推进中。",         // ≥70%
      "还可以，再专注一点更好。",       // ≥60%
      "有点磕绊，但方向是对的。",       // ≥40%
      "错得有点多，慢下来看看题。",     // ≥20%
      "稳住…先看清题目再说。"           // <20%
    ],
    darkLines: [
      "哟，居然全对？肯定是题太简单。",
      "运气不错嘛，下次可没这好运。",
      "还行吧，也就那样。",
      "勉勉强强，别太得意。",
      "我就知道你要错，果然没错。",
      "你这水平…是不是该回去翻书了？",
      "天哪，你是闭着眼睛在选吗？"
    ]
  },
  gru: {
    image: "./assets/gru-front.webp",
    darkImage: "./assets/gru-dark.webp",
    lines: [
      "无敌！这就是王者的实力！",
      "漂亮，这波节奏拉满了。",
      "继续冲，已经很强了。",
      "这题很稳，手感在线。",
      "还行，再调整一下会更顺。",
      "有点飘了，先稳住再说。",
      "别冲太快，基础先打牢。"
    ],
    darkLines: [
      "蒙的全对？我不信。",
      "哟，这次运气好，别嘚瑟。",
      "也就那样吧，没什么好吹的。",
      "对是对了，但速度也太慢了。",
      "开始掉链子了吧，意料之中。",
      "我就静静看着你错。",
      "喂，你是来刷题还是来刷存在感的？"
    ]
  },
  mimo: {
    image: "./assets/mimo-front.webp",
    darkImage: "./assets/mimo-dark.webp",
    lines: [
      "全对！今天状态爆棚！",
      "很好，一步一步都在掌控中。",
      "别急，慢一点更容易做对。",
      "卡住也没事，先看清题意。",
      "深呼吸，你可以的。",
      "错多了别慌，调整节奏。",
      "从基础开始，重新来过也不丢人。"
    ],
    darkLines: [
      "哦，全对？太阳打西边出来了。",
      "别高兴太早，下一题就翻车。",
      "急什么急，又错了是不是？",
      "看看题目再选，别瞎点。",
      "你这正确率…我都不忍心看了。",
      "是不是该考虑换个题库？",
      "放弃吧，今天不适合刷题。"
    ]
  },
  waiwai: {
    image: "./assets/waiwai-front.webp",
    darkImage: "./assets/waiwai-dark.webp",
    lines: [
      "不可思议！满分通过！",
      "想清楚再出手，节奏很好。",
      "先别慌，回到条件本身。",
      "错一道不影响后面发挥。",
      "思路是对的，执行再稳一点。",
      "出错是好事，知道哪里薄弱了。",
      "别怕错，每个错题都是机会。"
    ],
    darkLines: [
      "全对？是不是偷看答案了？",
      "这次算你走运，下次等着。",
      "又错了？意料之中。",
      "你这水平，还是背题吧。",
      "我都不想说话了，自己看。",
      "你是我带过最差的一届。",
      "算了，当我没来过。"
    ]
  },
  dodo: {
    image: "./assets/dodo-front.webp",
    darkImage: "./assets/dodo-dark.webp",
    lines: [
      "起飞！状态前所未有的好！",
      "继续加油，手感越来越好了。",
      "状态在慢慢起来，别停。",
      "保持专注，马上就顺了。",
      "稍微有点卡，但进步很明显。",
      "跌倒了爬起来，没什么大不了。",
      "慢慢来，每一步都算数。"
    ],
    darkLines: [
      "全对？看来题目难度该调高了。",
      "就这？我上我也行。",
      "加油？加什么油，加错吧。",
      "你这状态…没救了。",
      "再错下去要破纪录了，反向纪录。",
      "我劝你换个爱好吧。",
      "刷题救不了你，放弃吧。"
    ]
  }
};

// 根据最近10题正确率选语料索引（0=最好 → 6=最差）
function pickLineIndex() {
  const total = last15Results.length;
  if (total === 0) return 3; // 没有数据时用中间档
  const correctCount = last15Results.filter(r => r.correct).length;
  const accuracy = correctCount / total;
  if (accuracy >= 0.90) return 0;
  if (accuracy >= 0.80) return 1;
  if (accuracy >= 0.70) return 2;
  if (accuracy >= 0.60) return 3;
  if (accuracy >= 0.40) return 4;
  if (accuracy >= 0.20) return 5;
  return 6;
}

function pulseStreak() {
  const count = els.streakCount;
  const icon = document.getElementById("streakIcon");
  if (!count || !icon) return;
  count.textContent = getMoodWord(answeredCount);
  icon.classList.remove("streak-pop");
  count.classList.remove("streak-pop");
  requestAnimationFrame(() => {
    icon.classList.add("streak-pop");
    count.classList.add("streak-pop");
  });
}
function launchConfetti() {
  const burst = document.createElement("div");
  const lite = PERFORMANCE_MODE;
  const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#7b61ff"];
  const count = lite ? 25 : 30;
  burst.className = lite ? "confetti-burst confetti-lite" : "confetti-burst";
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    // 均匀分布在全屏宽度，避免扎堆
    const x = lite ? ((i / count) * 100) : (Math.random() * 100);
    piece.style.setProperty("--x", `${Math.round(x)}vw`);
    piece.style.setProperty("--dx", `${Math.round((Math.random() - .5) * (lite ? 140 : 170))}px`);
    piece.style.setProperty("--rot", `${Math.round((Math.random() - .5) * (lite ? 360 : 520))}deg`);
    piece.style.setProperty("--delay", `${(Math.random() * (lite ? .12 : .18)).toFixed(2)}s`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    frag.appendChild(piece);
  }
  burst.appendChild(frag);
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), lite ? 1600 : 1500);
}
function flashCorrect() {
  els.questionBody?.classList.remove("shake");
  launchConfetti();
  els.questionBody?.classList.add("correct-flash", "correct-border");
  setTimeout(() => els.questionBody?.classList.remove("correct-flash", "correct-border"), PERFORMANCE_MODE ? 420 : 620);
}
function shakeWrong(key) {
  if (key) {
    // 只抖动选错的选项按钮
    const btn = els.choiceArea?.querySelector(`[data-key="${CSS.escape(key)}"]`);
    if (btn) {
      btn.classList.add("shake");
      setTimeout(() => btn.classList.remove("shake"), PERFORMANCE_MODE ? 320 : 560);
    }
  } else {
    // 填空题抖动输入框
    els.questionBody?.classList.remove("correct-flash", "correct-border");
    els.questionBody?.classList.add("shake");
    setTimeout(() => els.questionBody?.classList.remove("shake"), PERFORMANCE_MODE ? 320 : 560);
  }
}
function addOptionRipple(btn) {
  if (PERFORMANCE_MODE) {
    btn.classList.add("tap-pop");
    setTimeout(() => btn.classList.remove("tap-pop"), 180);
    return;
  }
  btn.style.setProperty("--cx","50%");
  btn.style.setProperty("--cy","50%");
  btn.classList.add("ripple");
  setTimeout(()=>btn.classList.remove("ripple"), 400);
}
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
  if (!container || PERFORMANCE_MODE) return;
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
  const isDark = document.body.classList.contains("dark");
  overlay.className = `mascot-overlay show role-${role}`;
  img.src = isDark ? (cfg.darkImage || cfg.image) : cfg.image;
  const lines = (isDark && cfg.darkLines) ? cfg.darkLines : cfg.lines;
  bubble.textContent = lines[pickLineIndex()];
  createMascotParticles(role);
  clearTimeout(pendingMascot);
  pendingMascot = setTimeout(() => {
    overlay.classList.add("hide");
    setTimeout(() => {
      overlay.className = "mascot-overlay";
      overlay.classList.remove("hide");
      if (typeof onComplete === "function") onComplete();
    }, PERFORMANCE_MODE ? 120 : 260);
  }, PERFORMANCE_MODE ? 900 : 1800);
}

initTheme(); initFilters(); renderBankPicker(); bindEvents(); render();

Object.values(MASCOT_CONFIG).forEach(c => {
  if (PERFORMANCE_MODE) return;
  const i1 = new Image(); i1.src = c.image;
  if (c.darkImage) { const i2 = new Image(); i2.src = c.darkImage; }
});
// Preload feedback icon + option mark images
if (!PERFORMANCE_MODE) {
  new Image().src = "./assets/check-mark.webp";
  new Image().src = "./assets/x-mark.webp";
  new Image().src = "./assets/correct-sunglasses.webp";
  new Image().src = "./assets/correct-glow.webp";
  new Image().src = "./assets/correct-celebrate.webp";
  new Image().src = "./assets/wrong-speechless.webp";
}

// 每次渲染后自动保存状态
const _origRender = render;
render = function() { _origRender(); saveState(); };
render();
