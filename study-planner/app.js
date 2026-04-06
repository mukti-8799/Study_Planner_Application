
// ===== DEFAULT STATE =====
const DEFAULT = {
  name: 'Alex',
  pomodoroMin: 25,
  breakMin: 5,
  studyCycleMin: 30,
  hoursLogged: 12,
  hoursGoal: 20,
  calOffset: 0,
  studyDays: [],
  notifications: [],
  sessions: 0,
  tasks: [
    { id: 1, text: 'Read Chapter 5 - Physics', done: true, subject: 'Physics', priority: 'normal' },
    { id: 2, text: 'Complete Math Homework', done: true, subject: 'Math', priority: 'high' },
    { id: 3, text: 'Review History Notes', done: false, subject: 'History', priority: 'normal' },
    { id: 4, text: 'Write English Essay', done: false, subject: 'English', priority: 'high' },
    { id: 5, text: 'Study Biology Chapter 3', done: true, subject: 'Biology', priority: 'low' },
    { id: 6, text: 'Chemistry Lab Report', done: true, subject: 'Chemistry', priority: 'normal' },
    { id: 7, text: 'Math Practice Problems', done: false, subject: 'Math', priority: 'normal' },
  ],
  schedule: [
    { id: 1, time: '09:00', label: 'Biology Review', color: '#10b981' },
    { id: 2, time: '11:00', label: 'Math Lecture', color: '#4f46e5' },
    { id: 3, time: '13:00', label: 'Break', color: '#f59e0b' },
    { id: 4, time: '15:00', label: 'History Notes', color: '#8b5cf6' },
    { id: 5, time: '16:30', label: 'English Essay', color: '#ef4444' },
  ],
  exams: [
    { id: 1, name: 'Chemistry Final', date: '2026-05-18', color: '#4f46e5' },
    { id: 2, name: 'History Exam', date: '2026-05-22', color: '#ef4444' },
    { id: 3, name: 'Math Test', date: '2026-05-25', color: '#10b981' },
    { id: 4, name: 'Biology Quiz', date: '2026-05-28', color: '#f59e0b' },
  ],
  resources: [
    { id: 1, name: 'Physics Notes.pdf', type: 'PDF', url: '', color: '#ef4444' },
    { id: 2, name: 'Math Formulas.pdf', type: 'PDF', url: '', color: '#3b82f6' },
    { id: 3, name: 'History Timeline.pdf', type: 'PDF', url: '', color: '#f59e0b' },
    { id: 4, name: 'Important Links', type: 'Link', url: '', color: '#10b981' },
  ],
  subjects: [
    { name: 'Biology', pct: 68, color: '#10b981' },
    { name: 'Math', pct: 52, color: '#3b82f6' },
    { name: 'History', pct: 81, color: '#8b5cf6' },
    { name: 'English', pct: 40, color: '#f59e0b' },
  ],
  notes: [],
  flashcards: [],
  avatar: '',
};

let S = JSON.parse(localStorage.getItem('sp3')) || JSON.parse(JSON.stringify(DEFAULT));
function save() { localStorage.setItem('sp3', JSON.stringify(S)); }
function $id(id) { return document.getElementById(id); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function offsetDate(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function fmtTime(t) { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; }
function fmtDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

// ===== SIDEBAR =====
function toggleSidebar() {
  const sb = $id('sidebar');
  const ov = $id('sidebarOverlay');
  if (window.innerWidth <= 768) {
    sb.classList.toggle('open');
    ov.classList.toggle('open');
  } else {
    sb.classList.toggle('collapsed');
  }
}

// ===== PAGES =====
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = $id('pg-' + name);
  if (pg) pg.classList.add('active');
  if (el) el.classList.add('active');
  else {
    const nav = document.querySelector(`[data-page="${name}"]`);
    if (nav) nav.classList.add('active');
  }
  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    $id('sidebar').classList.remove('open');
    $id('sidebarOverlay').classList.remove('open');
  }
  if (name === 'today') renderTodayPage();
  if (name === 'schedule') renderSchedulePage();
  if (name === 'tasks') renderTasksPage();
  if (name === 'exams') renderExamsPage();
  if (name === 'resources') renderResourcesPage();
  if (name === 'progress') renderProgressPage();
  if (name === 'analytics') renderAnalytics();
}

// ===== MODALS =====
function openModal(id) {
  $id(id).classList.add('open');
  if (id === 'addTaskModal') refreshSubjectDL();
  if (id === 'settingsModal') {
    $id('setName').value = S.name;
    $id('setPomo').value = S.pomodoroMin;
    $id('setBreak').value = S.breakMin;
    $id('setStudyCycle').value = S.studyCycleMin;
    $id('setHrsGoal').value = S.hoursGoal;
    // Sync theme buttons
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const activeThemeBtn = (S.theme || 'light') === 'dark' ? $id('themeDarkBtn') : $id('themeLightBtn');
    if (activeThemeBtn) activeThemeBtn.classList.add('active');
    // Sync language
    const sel = $id('setLanguage');
    if (sel) sel.value = S.lang || 'en';
  }
  if (id === 'profileModal') {
    const user = JSON.parse(localStorage.getItem('sp_loggedIn') || '{}');
    $id('profileName').value = S.name;
    $id('profileEmail').value = user.email || '';
    $id('profileAvatarPreview').src = S.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${S.name}`;
  }
}
function closeModal(id) { $id(id).classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ===== TOAST =====
let toastTimer = null;
function showToast(icon, title, msg) {
  $id('toastIcon').textContent = icon;
  $id('toastTitle').textContent = title;
  $id('toastMsg').textContent = msg;
  $id('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 6000);
}
function hideToast() { $id('toast').classList.remove('show'); }

// ===== NOTIFICATIONS =====
function addNotif(msg) {
  S.notifications.unshift({ msg, time: new Date().toLocaleTimeString() });
  if (S.notifications.length > 20) S.notifications.pop();
  save();
  $id('notifBadge').textContent = S.notifications.length;
}
function renderNotifs() {
  $id('notifList').innerHTML = S.notifications.length
    ? S.notifications.map(n => `<li class="notif-item">🔔 ${n.msg} <span style="float:right;font-size:10px;color:#9ca3af">${n.time}</span></li>`).join('')
    : '<li class="notif-item" style="color:#9ca3af">No notifications</li>';
  $id('notifBadge').textContent = S.notifications.length;
}
function clearNotifs() { S.notifications = []; save(); renderNotifs(); closeModal('notifModal'); }

// ===== TIMER =====
// Modes: 'pomodoro' | 'tea' | 'study'
// Cycle: study (30min) -> tea break (5min) -> study -> ...
let timerInterval = null;
let timerRunning = false;
let timerMode = 'pomodoro'; // current mode
let timerSeconds = 0;
let timerTotalSeconds = 0;
let cyclePhase = 'study'; // 'study' or 'tea' for cycle mode

function setTimerMode(mode) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  $id('tab' + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add('active');

  if (mode === 'pomodoro') {
    timerSeconds = S.pomodoroMin * 60;
    timerTotalSeconds = timerSeconds;
    setTimerStatus('🍅 Pomodoro Ready', 'Focus ' + S.pomodoroMin + ' min → Break ' + S.breakMin + ' min');
  } else if (mode === 'tea') {
    timerSeconds = S.breakMin * 60;
    timerTotalSeconds = timerSeconds;
    setTimerStatus('☕ Tea Break Ready', 'Relax for ' + S.breakMin + ' minutes');
  } else if (mode === 'study') {
    cyclePhase = 'study';
    timerSeconds = S.studyCycleMin * 60;
    timerTotalSeconds = timerSeconds;
    setTimerStatus('📖 Study Cycle Ready', 'Study ' + S.studyCycleMin + ' min → ☕ Tea Break ' + S.breakMin + ' min');
  }
  updateTimerUI();
  updateStartBtn();
}

function setTimerStatus(status, cycleInfo) {
  if ($id('timerStatus')) $id('timerStatus').textContent = status;
  if ($id('timerCycleInfo')) $id('timerCycleInfo').textContent = cycleInfo;
  $id('timerLabel').textContent = status;
}

function updateTimerUI() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  const display = `${m}:${s}`;
  $id('timerDisplay').textContent = display;
  if ($id('timerBig')) $id('timerBig').textContent = display;
  // Progress bar
  const pct = timerTotalSeconds > 0 ? ((timerTotalSeconds - timerSeconds) / timerTotalSeconds) * 100 : 0;
  if ($id('timerProgressBar')) $id('timerProgressBar').style.width = pct + '%';
}

function updateStartBtn() {
  const label = timerRunning ? '⏸ Pause' : '▶ Start';
  $id('timerStartBtn').textContent = label;
  if ($id('timerMainBtn')) $id('timerMainBtn').textContent = label;
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    updateStartBtn();
    return;
  }
  timerRunning = true;
  updateStartBtn();
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerUI();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      onTimerComplete();
    }
  }, 1000);
}

function onTimerComplete() {
  S.sessions = (S.sessions || 0) + 1;
  save();
  if ($id('sessionCount')) $id('sessionCount').textContent = S.sessions;

  if (timerMode === 'pomodoro') {
    showToast('🍅', 'Pomodoro Complete!', 'Great focus session! Time for a break.');
    addNotif('Pomodoro session complete!');
    timerSeconds = S.breakMin * 60;
    timerTotalSeconds = timerSeconds;
    setTimerStatus('☕ Break Time!', 'Relax for ' + S.breakMin + ' minutes');
    timerMode = 'break-after-pomo';
  } else if (timerMode === 'break-after-pomo') {
    showToast('🍅', 'Break Over!', 'Back to focus mode. You got this!');
    timerSeconds = S.pomodoroMin * 60;
    timerTotalSeconds = timerSeconds;
    timerMode = 'pomodoro';
    setTimerStatus('🍅 Pomodoro Ready', 'Focus ' + S.pomodoroMin + ' min → Break ' + S.breakMin + ' min');
  } else if (timerMode === 'tea') {
    showToast('☕', 'Tea Break Over!', 'Feeling refreshed? Back to studying!');
    addNotif('Tea break finished!');
    timerSeconds = S.breakMin * 60;
    timerTotalSeconds = timerSeconds;
    setTimerStatus('☕ Tea Break Ready', 'Relax for ' + S.breakMin + ' minutes');
  } else if (timerMode === 'study') {
    if (cyclePhase === 'study') {
      showToast('☕', 'Study Session Done!', 'Time for a 5-minute tea break!');
      addNotif('Study cycle complete — tea break time!');
      cyclePhase = 'tea';
      timerSeconds = S.breakMin * 60;
      timerTotalSeconds = timerSeconds;
      setTimerStatus('☕ Tea Break!', 'Relax for ' + S.breakMin + ' minutes then continue studying');
    } else {
      showToast('📖', 'Tea Break Over!', 'Back to studying for ' + S.studyCycleMin + ' minutes!');
      addNotif('Tea break done — back to study cycle!');
      cyclePhase = 'study';
      timerSeconds = S.studyCycleMin * 60;
      timerTotalSeconds = timerSeconds;
      setTimerStatus('📖 Study Time!', 'Study ' + S.studyCycleMin + ' min → ☕ Tea Break ' + S.breakMin + ' min');
    }
    // Auto-start next phase
    timerRunning = true;
    updateStartBtn();
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerUI();
      if (timerSeconds <= 0) { clearInterval(timerInterval); timerRunning = false; onTimerComplete(); }
    }, 1000);
  }
  updateTimerUI();
  updateStartBtn();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerMode(timerMode === 'break-after-pomo' ? 'pomodoro' : timerMode);
}

function skipPhase() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  onTimerComplete();
}

function startFocusTimer() {
  openModal('timerModal');
  setTimerMode('study');
}

// ===== TASKS =====
function refreshSubjectDL() {
  const dl = $id('subjectDL');
  if (!dl) return;
  const subjects = [...new Set(S.tasks.map(t => t.subject).filter(Boolean))];
  dl.innerHTML = subjects.map(s => `<option value="${s}">`).join('');
}

function renderTasks() {
  const done = S.tasks.filter(t => t.done).length;
  const total = S.tasks.length;
  $id('tasksDone').textContent = done;
  $id('tasksTotal').textContent = total;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $id('taskBarFill').style.width = pct + '%';

  const html = S.tasks.slice(0, 6).map(t => taskHTML(t)).join('');
  $id('taskList').innerHTML = html;
}

function taskHTML(t) {
  return `<li class="task-item ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">
    <span class="task-check ${t.done ? 'done' : ''}">
      ${t.done ? '✔' : ''}
    </span>
    <span class="task-text">${t.text}</span>
    ${t.subject ? `<span class="task-subject">${t.subject}</span>` : ''}
    <button class="del-btn" onclick="event.stopPropagation();deleteTask(${t.id})">🗑</button>
  </li>`;
}

function toggleTask(id) {
  const t = S.tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); renderAll(); }
}

function deleteTask(id) {
  S.tasks = S.tasks.filter(t => t.id !== id);
  save(); renderAll();
}

function addTask() {
  const text = $id('newTaskText').value.trim();
  const subject = $id('newTaskSubject').value.trim() || 'General';
  const priority = $id('newTaskPriority').value;
  if (!text) return;
  S.tasks.push({ id: Date.now(), text, done: false, subject, priority });
  if (!S.subjects.find(s => s.name === subject)) {
    const colors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
    S.subjects.push({ name: subject, pct: 0, color: colors[S.subjects.length % colors.length] });
  }
  $id('newTaskText').value = '';
  $id('newTaskSubject').value = '';
  save(); renderAll(); closeModal('addTaskModal');
  addNotif(`Task added: "${text}"`);
  showToast('✅', 'Task Added', text);
}

function renderTodayPage() {
  $id('todayTaskList').innerHTML = S.tasks.map(t => taskHTML(t)).join('');
}

function renderTasksPage() {
  $id('allTaskList').innerHTML = S.tasks.map(t => taskHTML(t)).join('');
}

// ===== SCHEDULE =====
function renderSchedule() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const sorted = [...S.schedule].sort((a, b) => a.time.localeCompare(b.time));
  const html = sorted.map(s => {
    const [h, m] = s.time.split(':').map(Number);
    const itemMin = h * 60 + m;
    const isNow = Math.abs(itemMin - nowMin) <= 10;
    return `<li class="sched-item" style="${isNow ? 'background:#eff6ff' : ''}">
      <span class="sched-dot" style="background:${s.color}"></span>
      <span class="sched-time">${fmtTime(s.time)}</span>
      <span class="sched-label">${s.label}</span>
      <button class="del-btn" onclick="deleteSchedule(${s.id})">🗑</button>
    </li>`;
  }).join('');
  $id('schedList').innerHTML = html;
}

function renderSchedulePage() {
  const sorted = [...S.schedule].sort((a, b) => a.time.localeCompare(b.time));
  $id('fullSchedList').innerHTML = sorted.map(s =>
    `<li class="sched-item">
      <span class="sched-dot" style="background:${s.color}"></span>
      <span class="sched-time">${fmtTime(s.time)}</span>
      <span class="sched-label">${s.label}</span>
      <button class="del-btn" onclick="deleteSchedule(${s.id});renderSchedulePage()">🗑</button>
    </li>`
  ).join('');
}

function addScheduleItem() {
  const time = $id('newSchedTime').value;
  const label = $id('newSchedLabel').value.trim();
  const color = $id('newSchedColor').value;
  if (!time || !label) return;
  S.schedule.push({ id: Date.now(), time, label, color });
  $id('newSchedTime').value = '';
  $id('newSchedLabel').value = '';
  save(); renderSchedule(); closeModal('addScheduleModal');
}

function deleteSchedule(id) {
  S.schedule = S.schedule.filter(s => s.id !== id);
  save(); renderSchedule();
}

// ===== EXAMS =====
function renderExams() {
  const sorted = [...S.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  $id('examCount').textContent = sorted.length;
  const html = sorted.map(e => examHTML(e)).join('');
  $id('examList').innerHTML = html;
}

function examHTML(e) {
  return `<li class="exam-item">
    <span class="exam-icon-box" style="background:${e.color}22">
      <span style="color:${e.color}">📝</span>
    </span>
    <span class="exam-name">${e.name}</span>
    <span class="exam-date">${fmtDate(e.date)}</span>
    <div class="exam-actions">
      <button class="exam-edit-btn" title="Edit" onclick="event.stopPropagation();openEditExam(${e.id})">✏️</button>
      <button class="del-btn" onclick="event.stopPropagation();deleteExam(${e.id})">🗑</button>
    </div>
  </li>`;
}

function renderExamsPage() {
  const sorted = [...S.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  $id('allExamList').innerHTML = sorted.map(e => examHTML(e)).join('');
}

function addExam() {
  const name = $id('newExamName').value.trim();
  const date = $id('newExamDate').value;
  const color = $id('newExamColor').value;
  if (!name || !date) return;
  S.exams.push({ id: Date.now(), name, date, color });
  $id('newExamName').value = '';
  $id('newExamDate').value = '';
  save(); renderExams(); closeModal('addExamModal');
  addNotif(`Exam added: "${name}" on ${fmtDate(date)}`);
}

function deleteExam(id) {
  S.exams = S.exams.filter(e => e.id !== id);
  save(); renderExams(); renderExamsPage();
}

function openEditExam(id) {
  const e = S.exams.find(e => e.id === id);
  if (!e) return;
  $id('editExamId').value = e.id;
  $id('editExamName').value = e.name;
  $id('editExamDate').value = e.date;
  $id('editExamColor').value = e.color;
  openModal('editExamModal');
}

function saveEditExam() {
  const id = parseInt($id('editExamId').value);
  const e = S.exams.find(e => e.id === id);
  if (!e) return;
  e.name = $id('editExamName').value.trim() || e.name;
  e.date = $id('editExamDate').value || e.date;
  e.color = $id('editExamColor').value;
  save(); renderExams(); renderExamsPage(); closeModal('editExamModal');
  showToast('📝', 'Exam Updated', e.name);
}

// ===== RESOURCES =====
function resIconColor(type) {
  const map = { PDF: '#ef4444', Video: '#3b82f6', Link: '#10b981', Notes: '#f59e0b' };
  return map[type] || '#6b7280';
}
function resEmoji(type) {
  const map = { PDF: '📄', Video: '📹', Link: '🔗', Notes: '📝' };
  return map[type] || '📁';
}

function renderResources() {
  const html = S.resources.slice(0, 4).map(r => resHTML(r)).join('');
  $id('resList').innerHTML = html;
}

function resHTML(r) {
  const c = resIconColor(r.type);
  return `<li class="res-item">
    <span class="res-icon-box" style="background:${c}22;color:${c}" onclick="openResource('${r.url}')">${resEmoji(r.type)}</span>
    <div class="res-info" onclick="openResource('${r.url}')" style="cursor:pointer">
      <div class="res-name">${r.name}</div>
      <div class="res-type">${r.type}</div>
    </div>
    <div class="res-actions">
      <button class="res-edit-btn" title="Edit" onclick="openEditResource(${r.id})">✏️</button>
      <button class="res-del-btn" title="Delete" onclick="deleteResource(${r.id})">🗑️</button>
    </div>
  </li>`;
}

function openEditResource(id) {
  const r = S.resources.find(r => r.id === id);
  if (!r) return;
  $id('editResId').value = r.id;
  $id('editResName').value = r.name;
  $id('editResType').value = r.type;
  $id('editResUrl').value = r.url || '';
  openModal('editResourceModal');
}

function saveEditResource() {
  const id = parseInt($id('editResId').value);
  const r = S.resources.find(r => r.id === id);
  if (!r) return;
  r.name = $id('editResName').value.trim() || r.name;
  r.type = $id('editResType').value;
  r.url = $id('editResUrl').value.trim();
  r.color = resIconColor(r.type);
  save(); renderResources(); renderResourcesPage(); closeModal('editResourceModal');
  showToast('✅', 'Resource Updated', r.name);
}

function renderResourcesPage() {
  $id('allResList').innerHTML = S.resources.map(r => resHTML(r)).join('');
}

function openResource(url) { if (url) window.open(url, '_blank'); }

function addResource() {
  const name = $id('newResName').value.trim();
  const type = $id('newResType').value;
  const url = $id('newResUrl').value.trim();
  if (!name) return;
  S.resources.push({ id: Date.now(), name, type, url, color: resIconColor(type) });
  $id('newResName').value = '';
  $id('newResUrl').value = '';
  save(); renderResources(); closeModal('addResourceModal');
}

function deleteResource(id) {
  S.resources = S.resources.filter(r => r.id !== id);
  save(); renderResources(); renderResourcesPage();
}

// ===== SUBJECT BARS =====
function renderSubjectBars() {
  // Sync pct from tasks
  S.subjects.forEach(s => {
    const related = S.tasks.filter(t => t.subject === s.name);
    if (related.length) s.pct = Math.round((related.filter(t => t.done).length / related.length) * 100);
  });
  const html = S.subjects.map(s => `
    <div class="subj-row">
      <span class="subj-name">${s.name}</span>
      <div class="subj-bar-wrap">
        <div class="subj-bar-fill" style="width:${s.pct}%;background:${s.color}"></div>
      </div>
      <span class="subj-pct">${s.pct}%</span>
    </div>`).join('');
  $id('subjectBars').innerHTML = html;
  if ($id('progressBars')) $id('progressBars').innerHTML = html;
}

// ===== DONUT =====
function renderDonut() {
  const done = S.tasks.filter(t => t.done).length;
  const total = S.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $id('donutPct').textContent = pct + '%';
  const canvas = $id('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 70, cy = 70, r = 52, lw = 16;
  const angle = (pct / 100) * Math.PI * 2;
  ctx.clearRect(0, 0, 140, 140);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = lw; ctx.stroke();
  if (angle > 0) {
    const segs = [
      { c: '#1d4ed8', s: -Math.PI / 2, e: -Math.PI / 2 + angle * 0.4 },
      { c: '#fbbf24', s: -Math.PI / 2 + angle * 0.4, e: -Math.PI / 2 + angle * 0.7 },
      { c: '#10b981', s: -Math.PI / 2 + angle * 0.7, e: -Math.PI / 2 + angle },
    ];
    segs.forEach(seg => {
      if (seg.e > seg.s) {
        ctx.beginPath(); ctx.arc(cx, cy, r, seg.s, seg.e);
        ctx.strokeStyle = seg.c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
      }
    });
  }
}

// ===== STREAK =====
function checkStreak() {
  const today = todayISO();
  if (S.tasks.some(t => t.done) && !S.studyDays.includes(today)) {
    S.studyDays.push(today); save();
  }
}

function getStreakCount() {
  let count = 0;
  for (let i = 0; i < 365; i++) {
    if (S.studyDays.includes(offsetDate(-i))) count++;
    else if (i > 0) break;
  }
  return count;
}

function getLongestStreak() {
  if (!S.studyDays.length) return 0;
  const sorted = [...S.studyDays].sort();
  let max = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); } else cur = 1;
  }
  return max;
}

function renderStreak() {
  checkStreak();
  const count = getStreakCount();
  const today = todayISO();
  const studiedToday = S.studyDays.includes(today);
  $id('streakNum').textContent = count;
  $id('longestStreak').textContent = getLongestStreak() + ' days';
  const msgs = ['Study today to start your streak!', '🔥 1 day — great start!', '🔥 2 days in a row!', '🔥 3 days! You\'re on fire!', '🔥 4 days! Keep it up!', '🔥 5 days! Amazing!'];
  $id('streakMsg').textContent = !studiedToday && count === 0 ? msgs[0]
    : !studiedToday ? `⚠️ Study today to keep your ${count}-day streak!`
    : count >= 5 ? `🏆 ${count} days! Legendary!`
    : (msgs[count] || `🔥 ${count} day streak!`);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let html = '';
  for (let i = 6; i >= 0; i--) {
    const d = offsetDate(-i);
    const dt = new Date(d + 'T00:00:00');
    const dow = (dt.getDay() + 6) % 7;
    const studied = S.studyDays.includes(d);
    const isToday = d === today;
    html += `<div class="sw-day ${studied ? 'studied' : ''} ${isToday ? 'today' : ''}">
      ${studied ? '✔' : isToday ? '·' : ''}
      <span class="sw-lbl">${days[dow]}</span>
    </div>`;
  }
  $id('streakWeek').innerHTML = html;
  drawStreakRing(count);
  renderCalendar();
}

function drawStreakRing(count) {
  const canvas = $id('streakRing');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 65, lw = 12;
  const pct = Math.min(count / 30, 1);
  ctx.clearRect(0, 0, 160, 160);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = lw; ctx.stroke();
  if (pct > 0) {
    const grad = ctx.createLinearGradient(0, 0, 160, 160);
    grad.addColorStop(0, '#f97316'); grad.addColorStop(1, '#fbbf24');
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
    ctx.strokeStyle = grad; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
  }
}

// ===== CALENDAR =====
function calNav(dir) { S.calOffset += dir; save(); renderCalendar(); }

function renderCalendar() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + S.calOffset, 1);
  const year = d.getFullYear(), month = d.getMonth();
  $id('calMonthLbl').textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();
  let html = '';
  for (let i = 0; i < firstDow; i++) html += '<div class="cal-day empty"></div>';
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  let studyCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${monthStr}-${String(day).padStart(2, '0')}`;
    const studied = S.studyDays.includes(iso);
    const isToday = iso === today;
    if (studied) studyCount++;
    html += `<div class="cal-day ${studied ? 'studied' : ''} ${isToday ? 'today' : ''}">${day}</div>`;
  }
  $id('calGrid').innerHTML = html;
  $id('calTotal').textContent = studyCount;
}

// ===== HOURS =====
function renderHours() {
  $id('hoursLogged').textContent = S.hoursLogged;
  $id('hoursGoal').textContent = S.hoursGoal;
  const pct = Math.round((S.hoursLogged / S.hoursGoal) * 100);
  $id('hoursBarFill').style.width = Math.min(pct, 100) + '%';
}

// ===== SETTINGS =====
function saveSettings() {
  S.name = $id('setName').value.trim() || 'Alex';
  S.pomodoroMin = parseInt($id('setPomo').value) || 25;
  S.breakMin = parseInt($id('setBreak').value) || 5;
  S.studyCycleMin = parseInt($id('setStudyCycle').value) || 30;
  S.hoursGoal = parseFloat($id('setHrsGoal').value) || 20;
  $id('tbName').textContent = S.name;
  updateAvatarUI();
  $id('qaMin').textContent = S.pomodoroMin + ' min';
  renderHours();
  resetTimer();
  save(); closeModal('settingsModal');
  showToast('✅', 'Settings Saved', 'Your preferences have been updated.');
}

function logout() {
  if (confirm('Log out of Study Planner?')) {
    localStorage.removeItem('sp_loggedIn');
    window.location.href = '../login.html';
  }
}

// ===== THEME =====
function setTheme(theme) {
  S.theme = theme;
  document.body.setAttribute('data-theme', theme);
  save();
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  const btn = theme === 'dark' ? $id('themeDarkBtn') : $id('themeLightBtn');
  if (btn) btn.classList.add('active');
}

function applyTheme() {
  const theme = S.theme || 'light';
  document.body.setAttribute('data-theme', theme);
  const btn = theme === 'dark' ? $id('themeDarkBtn') : $id('themeLightBtn');
  if (btn) btn.classList.add('active');
}

// ===== LANGUAGE =====
const TRANSLATIONS = {
  en: {
    dashboard:'Dashboard',today:'Today',schedule:'Schedule',tasks:'Tasks',
    exams:'Exams',resources:'Resources',progress:'Progress',analytics:'Analytics',
    settings:'Settings',help:'Help',todayTasks:"Today's Tasks",weeklyHours:'Weekly Study Hours',
    upcomingExams:'Upcoming Exams',focusTimer:'Focus Timer',
    saveSettings:'Save Settings',logout:'🚪 Logout',
  },
  hi: {
    dashboard:'डैशबोर्ड',today:'आज',schedule:'समय-सारणी',tasks:'कार्य',
    exams:'परीक्षाएं',resources:'संसाधन',progress:'प्रगति',analytics:'विश्लेषण',
    settings:'सेटिंग्स',help:'सहायता',todayTasks:'आज के कार्य',weeklyHours:'साप्ताहिक अध्ययन घंटे',
    upcomingExams:'आगामी परीक्षाएं',focusTimer:'फोकस टाइमर',
    saveSettings:'सेटिंग्स सहेजें',logout:'🚪 लॉग आउट',
  },
  gu: {
    dashboard:'ડેશબોર્ડ',today:'આજ',schedule:'સમયપત્રક',tasks:'કાર્યો',
    exams:'પરીક્ષાઓ',resources:'સ્ત્રોતો',progress:'પ્રગતિ',analytics:'વિશ્લેષણ',
    settings:'સેટિંગ્સ',help:'મદદ',todayTasks:'આજના કાર્યો',weeklyHours:'સાપ્તાહિક અભ્યાસ કલાકો',
    upcomingExams:'આગામી પરીક્ષાઓ',focusTimer:'ફોકસ ટાઇમર',
    saveSettings:'સેટિંગ્સ સાચવો',logout:'🚪 લૉગ આઉટ',
  }
};

function setLanguage(lang) {
  S.lang = lang;
  save();
  applyLanguage();
}

function applyLanguage() {
  const lang = S.lang || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const navMap = {dashboard:t.dashboard,today:t.today,schedule:t.schedule,tasks:t.tasks,
    exams:t.exams,resources:t.resources,progress:t.progress,analytics:t.analytics};
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    const page = el.getAttribute('data-page');
    const lbl = el.querySelector('.nav-label');
    if (lbl && navMap[page]) lbl.textContent = navMap[page];
  });
  const statTitles = document.querySelectorAll('.stat-title');
  const statKeys = [t.todayTasks, t.weeklyHours, t.upcomingExams, t.focusTimer];
  statTitles.forEach((el, i) => { if (statKeys[i]) el.textContent = statKeys[i]; });
  const submitBtn = document.querySelector('#settingsModal .modal-submit');
  if (submitBtn) submitBtn.textContent = t.saveSettings;
  const logoutBtn = document.querySelector('.modal-logout');
  if (logoutBtn) logoutBtn.textContent = t.logout;
  const sel = $id('setLanguage');
  if (sel) sel.value = lang;
}

// ===== PROFILE =====
function openProfileModal() {
  const user = JSON.parse(localStorage.getItem('sp_loggedIn') || '{}');
  $id('profileName').value = S.name;
  $id('profileEmail').value = user.email || '';
  $id('profileAvatarPreview').src = S.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${S.name}`;
  openModal('profileModal');
}

function handleProfilePic(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    S.avatar = e.target.result;
    $id('profileAvatarPreview').src = S.avatar;
    save();
  };
  reader.readAsDataURL(file);
}

function saveProfile() {
  const name = $id('profileName').value.trim();
  if (!name) return;
  S.name = name;
  // Update logged-in user name
  const user = JSON.parse(localStorage.getItem('sp_loggedIn') || '{}');
  user.name = name;
  if (S.avatar) user.avatar = S.avatar;
  localStorage.setItem('sp_loggedIn', JSON.stringify(user));
  $id('tbName').textContent = S.name;
  $id('setName').value = S.name;
  updateAvatarUI();
  save(); closeModal('profileModal');
  showToast('👤', 'Profile Updated', `Hello, ${name}!`);
}

function updateAvatarUI() {
  const src = S.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${S.name}`;
  $id('tbAvatar').src = src;
}

// ===== NOTES & FLASHCARDS =====
function addNote() {
  const title = $id('newNoteTitle').value.trim();
  const content = $id('newNoteContent').value.trim();
  if (!title) return;
  S.notes.push({ id: Date.now(), title, content });
  $id('newNoteTitle').value = '';
  $id('newNoteContent').value = '';
  save(); closeModal('addNoteModal');
  showToast('📝', 'Note Saved', title);
}

function addFlashcard() {
  const q = $id('fcQuestion').value.trim();
  const a = $id('fcAnswer').value.trim();
  if (!q || !a) return;
  S.flashcards.push({ id: Date.now(), q, a });
  $id('fcQuestion').value = '';
  $id('fcAnswer').value = '';
  save(); closeModal('flashcardsModal');
  showToast('🃏', 'Flashcard Created', q);
}

// ===== PROGRESS PAGE =====
function renderProgressPage() {
  if ($id('progressBars')) {
    $id('progressBars').innerHTML = S.subjects.map(s => `
      <div class="subj-row">
        <span class="subj-name">${s.name}</span>
        <div class="subj-bar-wrap">
          <div class="subj-bar-fill" style="width:${s.pct}%;background:${s.color}"></div>
        </div>
        <span class="subj-pct">${s.pct}%</span>
      </div>`).join('');
  }
}

// ===== ANALYTICS =====
function renderAnalytics() {
  const canvas = $id('analyticsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = days.map(() => Math.floor(Math.random() * 5) + 1);
  const W = canvas.width, H = canvas.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const maxVal = Math.max(...data, 6);
  const barW = chartW / days.length * 0.5;
  const gap = chartW / days.length;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, W, H);
  // Grid lines
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + chartH - (i / 5) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px Inter,sans-serif';
    ctx.fillText(Math.round(i / 5 * maxVal), 4, y + 4);
  }
  // Bars
  days.forEach((day, i) => {
    const x = pad.left + i * gap + gap / 2 - barW / 2;
    const barH = (data[i] / maxVal) * chartH;
    const y = pad.top + chartH - barH;
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#3b82f6'); grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 4) : ctx.rect(x, y, barW, barH);
    ctx.fill();
    ctx.fillStyle = '#374151'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(day, pad.left + i * gap + gap / 2, H - 10);
    ctx.fillText(data[i] + 'h', pad.left + i * gap + gap / 2, y - 5);
  });
}

// ===== SEARCH =====
function doSearch() {
  const q = $id('searchInput').value.toLowerCase();
  if (!q) { $id('searchResults').innerHTML = ''; return; }
  const results = [
    ...S.tasks.filter(t => t.text.toLowerCase().includes(q)).map(t => `<li class="notif-item">✅ ${t.text}</li>`),
    ...S.exams.filter(e => e.name.toLowerCase().includes(q)).map(e => `<li class="notif-item">📝 ${e.name} — ${fmtDate(e.date)}</li>`),
    ...S.resources.filter(r => r.name.toLowerCase().includes(q)).map(r => `<li class="notif-item">📄 ${r.name}</li>`),
  ];
  $id('searchResults').innerHTML = results.length ? results.join('') : '<li class="notif-item" style="color:#9ca3af">No results found</li>';
}

// ===== SCHEDULE REMINDERS =====
const reminded = new Set();
function checkScheduleReminders() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  S.schedule.forEach(item => {
    const [ih, im] = item.time.split(':').map(Number);
    const itemMin = ih * 60 + im;
    const diff = itemMin - nowMin;
    if ((diff === 5 || diff === 0) && !reminded.has(`${item.id}_${diff}`)) {
      reminded.add(`${item.id}_${diff}`);
      const msg = diff === 5 ? `Starting in 5 min: ${item.label}` : `Time to start: ${item.label}`;
      showToast('⏰', diff === 5 ? 'Coming Up' : 'Time to Start!', msg);
      addNotif(msg);
    }
  });
}

// ===== RENDER ALL =====
function renderAll() {
  renderTasks();
  renderSchedule();
  renderExams();
  renderResources();
  renderSubjectBars();
  renderDonut();
  renderStreak();
  renderHours();
  renderNotifs();
  updateAvatarUI();
  $id('qaMin').textContent = S.pomodoroMin + ' min';
  if ($id('sessionCount')) $id('sessionCount').textContent = S.sessions || 0;
}

// ===== INIT =====
function init() {
  // Load logged-in user info
  const user = JSON.parse(localStorage.getItem('sp_loggedIn') || '{}');
  if (!localStorage.getItem('sp_loggedIn')) {
    // Not logged in — redirect to login
    window.location.href = '../.vscode/login.html';
    return;
  }
  if (user.name && !localStorage.getItem('sp3')) S.name = user.name;
  if (user.avatar) S.avatar = user.avatar;
  if (user.name && S.name === 'Alex') S.name = user.name;

  $id('tbName').textContent = S.name;
  updateAvatarUI();
  timerMode = 'pomodoro';
  timerSeconds = S.pomodoroMin * 60;
  timerTotalSeconds = timerSeconds;
  updateTimerUI();
  renderAll();
  applyTheme();
  applyLanguage();
  setInterval(checkScheduleReminders, 60000);
  setInterval(renderSchedule, 60000);
}

init();
