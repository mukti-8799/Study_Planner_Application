// ============================================================
// SETTINGS.JS — Settings, Profile, Theme, Language
// ============================================================

function saveSettings(){
  S.name=$id('setName').value.trim()||'Alex';
  S.pomodoroMin=parseInt($id('setPomo').value)||25;
  S.breakMin=parseInt($id('setBreak').value)||5;
  S.studyCycleMin=parseInt($id('setStudyCycle').value)||30;
  S.hoursGoal=parseFloat($id('setHrsGoal').value)||20;
  $id('tbName').textContent=S.name; $id('qaMin').textContent=S.pomodoroMin+' min';
  updateAvatarUI(); renderHours(); resetTimer();
  save(); closeModal('settingsModal'); showToast('✅','Settings Saved','Your preferences have been updated.');
}

function renderHours(){
  $id('hoursLogged').textContent=S.hoursLogged; $id('hoursGoal').textContent=S.hoursGoal;
  $id('hoursBarFill').style.width=Math.min(Math.round(S.hoursLogged/S.hoursGoal*100),100)+'%';
}

function logout(){
  if(confirm('Log out of Study Planner?')){ localStorage.removeItem('sp_loggedIn'); window.location.href='login.html'; }
}

// Profile
function handleProfilePic(event){
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{ S.avatar=e.target.result; $id('profileAvatarPreview').src=S.avatar; save(); };
  reader.readAsDataURL(file);
}

function saveProfile(){
  const name=$id('profileName').value.trim(); if(!name) return;
  S.name=name;
  const user=JSON.parse(localStorage.getItem('sp_loggedIn')||'{}');
  user.name=name; if(S.avatar) user.avatar=S.avatar;
  localStorage.setItem('sp_loggedIn',JSON.stringify(user));
  $id('tbName').textContent=S.name; $id('setName').value=S.name;
  updateAvatarUI(); save(); closeModal('profileModal'); showToast('👤','Profile Updated',`Hello, ${name}!`);
}

function updateAvatarUI(){
  $id('tbAvatar').src=S.avatar||`https://api.dicebear.com/7.x/adventurer/svg?seed=${S.name}`;
}

// Theme
function setTheme(theme){
  S.theme=theme; document.body.setAttribute('data-theme',theme); save();
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
  const btn=theme==='dark'?$id('themeDarkBtn'):$id('themeLightBtn'); if(btn) btn.classList.add('active');
}

function applyTheme(){
  const theme=S.theme||'light'; document.body.setAttribute('data-theme',theme);
  const btn=theme==='dark'?$id('themeDarkBtn'):$id('themeLightBtn'); if(btn) btn.classList.add('active');
}

// Language
const TRANSLATIONS={
  en:{ dashboard:'Dashboard',today:'Today',schedule:'Schedule',tasks:'Tasks',exams:'Exams',resources:'Resources',progress:'Progress',analytics:'Analytics',settings:'Settings',help:'Help',todayTasks:"Today's Tasks",weeklyHours:'Weekly Study Hours',upcomingExams:'Upcoming Exams',focusTimer:'Focus Timer',saveSettings:'Save Settings',logout:'🚪 Logout' },
  hi:{ dashboard:'डैशबोर्ड',today:'आज',schedule:'समय-सारणी',tasks:'कार्य',exams:'परीक्षाएं',resources:'संसाधन',progress:'प्रगति',analytics:'विश्लेषण',settings:'सेटिंग्स',help:'सहायता',todayTasks:'आज के कार्य',weeklyHours:'साप्ताहिक अध्ययन घंटे',upcomingExams:'आगामी परीक्षाएं',focusTimer:'फोकस टाइमर',saveSettings:'सेटिंग्स सहेजें',logout:'🚪 लॉग आउट' },
  gu:{ dashboard:'ડેશબોર્ડ',today:'આજ',schedule:'સમયપત્રક',tasks:'કાર્યો',exams:'પરીક્ષાઓ',resources:'સ્ત્રોતો',progress:'પ્રગતિ',analytics:'વિશ્લેષણ',settings:'સેટિંગ્સ',help:'મદદ',todayTasks:'આજના કાર્યો',weeklyHours:'સાપ્તાહિક અભ્યાસ કલાકો',upcomingExams:'આગામી પરીક્ષાઓ',focusTimer:'ફોકસ ટાઇમર',saveSettings:'સેટિંગ્સ સાચવો',logout:'🚪 લૉગ આઉટ' },
};

function setLanguage(lang){ S.lang=lang; save(); applyLanguage(); }

function applyLanguage(){
  const lang=S.lang||'en', t=TRANSLATIONS[lang]||TRANSLATIONS.en;
  const navMap={dashboard:t.dashboard,today:t.today,schedule:t.schedule,tasks:t.tasks,exams:t.exams,resources:t.resources,progress:t.progress,analytics:t.analytics};
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>{ const lbl=el.querySelector('.nav-label'); if(lbl&&navMap[el.getAttribute('data-page')]) lbl.textContent=navMap[el.getAttribute('data-page')]; });
  const statKeys=[t.todayTasks,t.weeklyHours,t.upcomingExams,t.focusTimer];
  document.querySelectorAll('.stat-title').forEach((el,i)=>{ if(statKeys[i]) el.textContent=statKeys[i]; });
  const submitBtn=document.querySelector('#settingsModal .modal-submit'); if(submitBtn) submitBtn.textContent=t.saveSettings;
  const logoutBtn=document.querySelector('.modal-logout'); if(logoutBtn) logoutBtn.textContent=t.logout;
  const sel=$id('setLanguage'); if(sel) sel.value=lang;
}
