// ============================================================
// TIMER.JS — Pomodoro, Tea Break, Study Cycle
// ============================================================

let timerInterval=null, timerRunning=false, timerMode='pomodoro';
let timerSeconds=0, timerTotalSeconds=0, cyclePhase='study';

function setTimerMode(mode){
  clearInterval(timerInterval); timerRunning=false; timerMode=mode;
  document.querySelectorAll('.mode-tab').forEach(t=>t.classList.remove('active'));
  $id('tab'+mode.charAt(0).toUpperCase()+mode.slice(1)).classList.add('active');
  if(mode==='pomodoro'){ timerSeconds=S.pomodoroMin*60; setTimerStatus('🍅 Pomodoro Ready',`Focus ${S.pomodoroMin} min → Break ${S.breakMin} min`); }
  else if(mode==='tea'){ timerSeconds=S.breakMin*60; setTimerStatus('☕ Tea Break Ready',`Relax for ${S.breakMin} minutes`); }
  else if(mode==='study'){ cyclePhase='study'; timerSeconds=S.studyCycleMin*60; setTimerStatus('📖 Study Cycle Ready',`Study ${S.studyCycleMin} min → ☕ Tea Break ${S.breakMin} min`); }
  timerTotalSeconds=timerSeconds; updateTimerUI(); updateStartBtn();
}

function setTimerStatus(status,cycleInfo){
  if($id('timerStatus')) $id('timerStatus').textContent=status;
  if($id('timerCycleInfo')) $id('timerCycleInfo').textContent=cycleInfo;
  $id('timerLabel').textContent=status;
}

function updateTimerUI(){
  const m=String(Math.floor(timerSeconds/60)).padStart(2,'0'), s=String(timerSeconds%60).padStart(2,'0');
  const display=`${m}:${s}`;
  $id('timerDisplay').textContent=display;
  if($id('timerBig')) $id('timerBig').textContent=display;
  const pct=timerTotalSeconds>0?((timerTotalSeconds-timerSeconds)/timerTotalSeconds)*100:0;
  if($id('timerProgressBar')) $id('timerProgressBar').style.width=pct+'%';
}

function updateStartBtn(){
  const label=timerRunning?'⏸ Pause':'▶ Start';
  $id('timerStartBtn').textContent=label;
  if($id('timerMainBtn')) $id('timerMainBtn').textContent=label;
}

function toggleTimer(){
  if(timerRunning){ clearInterval(timerInterval); timerRunning=false; updateStartBtn(); return; }
  timerRunning=true; updateStartBtn();
  timerInterval=setInterval(()=>{ timerSeconds--; updateTimerUI(); if(timerSeconds<=0){ clearInterval(timerInterval); timerRunning=false; onTimerComplete(); } },1000);
}

function onTimerComplete(){
  S.sessions=(S.sessions||0)+1; save();
  if($id('sessionCount')) $id('sessionCount').textContent=S.sessions;
  if(timerMode==='pomodoro'){
    showToast('🍅','Pomodoro Complete!','Great focus session! Time for a break.'); addNotif('Pomodoro session complete!');
    timerSeconds=S.breakMin*60; timerTotalSeconds=timerSeconds; timerMode='break-after-pomo';
    setTimerStatus('☕ Break Time!',`Relax for ${S.breakMin} minutes`);
  } else if(timerMode==='break-after-pomo'){
    showToast('🍅','Break Over!','Back to focus mode. You got this!');
    timerSeconds=S.pomodoroMin*60; timerTotalSeconds=timerSeconds; timerMode='pomodoro';
    setTimerStatus('🍅 Pomodoro Ready',`Focus ${S.pomodoroMin} min → Break ${S.breakMin} min`);
  } else if(timerMode==='tea'){
    showToast('☕','Tea Break Over!','Feeling refreshed? Back to studying!'); addNotif('Tea break finished!');
    timerSeconds=S.breakMin*60; timerTotalSeconds=timerSeconds;
    setTimerStatus('☕ Tea Break Ready',`Relax for ${S.breakMin} minutes`);
  } else if(timerMode==='study'){
    if(cyclePhase==='study'){
      showToast('☕','Study Session Done!','Time for a tea break!'); addNotif('Study cycle complete — tea break time!');
      cyclePhase='tea'; timerSeconds=S.breakMin*60; timerTotalSeconds=timerSeconds;
      setTimerStatus('☕ Tea Break!',`Relax for ${S.breakMin} minutes then continue`);
    } else {
      showToast('📖','Tea Break Over!',`Back to studying for ${S.studyCycleMin} minutes!`); addNotif('Tea break done — back to study cycle!');
      cyclePhase='study'; timerSeconds=S.studyCycleMin*60; timerTotalSeconds=timerSeconds;
      setTimerStatus('📖 Study Time!',`Study ${S.studyCycleMin} min → ☕ Tea Break ${S.breakMin} min`);
    }
    timerRunning=true; updateStartBtn();
    timerInterval=setInterval(()=>{ timerSeconds--; updateTimerUI(); if(timerSeconds<=0){ clearInterval(timerInterval); timerRunning=false; onTimerComplete(); } },1000);
  }
  updateTimerUI(); updateStartBtn();
}

function resetTimer(){ clearInterval(timerInterval); timerRunning=false; setTimerMode(timerMode==='break-after-pomo'?'pomodoro':timerMode); }
function skipPhase(){ clearInterval(timerInterval); timerRunning=false; timerSeconds=0; onTimerComplete(); }
function startFocusTimer(){ openModal('timerModal'); setTimerMode('study'); }
