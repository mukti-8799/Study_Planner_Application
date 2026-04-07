// ============================================================
// APP.JS — renderAll() and init()
// This is the entry point. All feature files are loaded before this.
// ============================================================

function renderAll(){
  renderTasks(); renderSchedule(); renderExams(); renderResources();
  renderSubjectBars(); renderDonut(); renderStreak(); renderHours();
  renderNotifs(); updateAvatarUI();
  $id('qaMin').textContent=S.pomodoroMin+' min';
  if($id('sessionCount')) $id('sessionCount').textContent=S.sessions||0;
}

function init(){
  const session=localStorage.getItem('sp_loggedIn');
  if(!session){ window.location.href='login.html'; return; }
  const user=JSON.parse(session);
  if(user.name&&S.name==='Alex') S.name=user.name;
  if(user.avatar) S.avatar=user.avatar;
  $id('tbName').textContent=S.name;
  updateAvatarUI();
  timerMode='pomodoro'; timerSeconds=S.pomodoroMin*60; timerTotalSeconds=timerSeconds;
  updateTimerUI(); renderAll(); applyTheme(); applyLanguage();
  setInterval(checkScheduleReminders,60000);
  setInterval(renderSchedule,60000);
}

init();
