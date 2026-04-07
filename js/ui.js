// ============================================================
// UI.JS — Sidebar, Pages, Modals, Toast, Notifications, Search
// ============================================================

function toggleSidebar() {
  const sb=$id('sidebar'), ov=$id('sidebarOverlay');
  if (window.innerWidth<=768) { sb.classList.toggle('open'); ov.classList.toggle('open'); }
  else sb.classList.toggle('collapsed');
}

function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=$id('pg-'+name); if(pg) pg.classList.add('active');
  if(el) el.classList.add('active');
  else { const nav=document.querySelector(`[data-page="${name}"]`); if(nav) nav.classList.add('active'); }
  if(window.innerWidth<=768){ $id('sidebar').classList.remove('open'); $id('sidebarOverlay').classList.remove('open'); }
  if(name==='today')     renderTodayPage();
  if(name==='schedule')  renderSchedulePage();
  if(name==='tasks')     renderTasksPage();
  if(name==='exams')     renderExamsPage();
  if(name==='resources') renderResourcesPage();
  if(name==='progress')  renderProgressPage();
  if(name==='analytics') renderAnalytics();
}

function openModal(id) {
  $id(id).classList.add('open');
  if(id==='addTaskModal') refreshSubjectDL();
  if(id==='settingsModal'){
    $id('setName').value=$id('setName') && S.name;
    $id('setPomo').value=S.pomodoroMin; $id('setBreak').value=S.breakMin;
    $id('setStudyCycle').value=S.studyCycleMin; $id('setHrsGoal').value=S.hoursGoal;
    document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
    const ab=(S.theme||'light')==='dark'?$id('themeDarkBtn'):$id('themeLightBtn');
    if(ab) ab.classList.add('active');
    const sel=$id('setLanguage'); if(sel) sel.value=S.lang||'en';
  }
  if(id==='profileModal'){
    const user=JSON.parse(localStorage.getItem('sp_loggedIn')||'{}');
    $id('profileName').value=S.name; $id('profileEmail').value=user.email||'';
    $id('profileAvatarPreview').src=S.avatar||`https://api.dicebear.com/7.x/adventurer/svg?seed=${S.name}`;
  }
}
function closeModal(id){ $id(id).classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(o=>{
  o.addEventListener('click',e=>{ if(e.target===o) o.classList.remove('open'); });
});

// Toast
let toastTimer=null;
function showToast(icon,title,msg){
  $id('toastIcon').textContent=icon; $id('toastTitle').textContent=title; $id('toastMsg').textContent=msg;
  $id('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(hideToast,6000);
}
function hideToast(){ $id('toast').classList.remove('show'); }

// Notifications
function addNotif(msg){
  S.notifications.unshift({msg,time:new Date().toLocaleTimeString()});
  if(S.notifications.length>20) S.notifications.pop();
  save(); $id('notifBadge').textContent=S.notifications.length;
}
function renderNotifs(){
  $id('notifList').innerHTML=S.notifications.length
    ? S.notifications.map(n=>`<li class="notif-item">🔔 ${n.msg} <span style="float:right;font-size:10px;color:#9ca3af">${n.time}</span></li>`).join('')
    : '<li class="notif-item" style="color:#9ca3af">No notifications</li>';
  $id('notifBadge').textContent=S.notifications.length;
}
function clearNotifs(){ S.notifications=[]; save(); renderNotifs(); closeModal('notifModal'); }

// Search
function doSearch(){
  const q=$id('searchInput').value.toLowerCase();
  if(!q){ $id('searchResults').innerHTML=''; return; }
  const r=[
    ...S.tasks.filter(t=>t.text.toLowerCase().includes(q)).map(t=>`<li class="notif-item">✅ ${t.text}</li>`),
    ...S.exams.filter(e=>e.name.toLowerCase().includes(q)).map(e=>`<li class="notif-item">📝 ${e.name} — ${fmtDate(e.date)}</li>`),
    ...S.resources.filter(r=>r.name.toLowerCase().includes(q)).map(r=>`<li class="notif-item">📄 ${r.name}</li>`),
  ];
  $id('searchResults').innerHTML=r.length?r.join(''):'<li class="notif-item" style="color:#9ca3af">No results found</li>';
}

// Schedule reminders
const reminded=new Set();
function checkScheduleReminders(){
  const now=new Date(), nowMin=now.getHours()*60+now.getMinutes();
  S.schedule.forEach(item=>{
    const [ih,im]=item.time.split(':').map(Number), diff=ih*60+im-nowMin;
    if((diff===5||diff===0)&&!reminded.has(`${item.id}_${diff}`)){
      reminded.add(`${item.id}_${diff}`);
      const msg=diff===5?`Starting in 5 min: ${item.label}`:`Time to start: ${item.label}`;
      showToast('⏰',diff===5?'Coming Up':'Time to Start!',msg); addNotif(msg);
    }
  });
}
