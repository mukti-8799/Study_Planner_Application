// ============================================================
// STREAK.JS — Study streak, streak ring, calendar
// ============================================================

function checkStreak(){
  const today=todayISO();
  if(S.tasks.some(t=>t.done)&&!S.studyDays.includes(today)){ S.studyDays.push(today); save(); }
}

function getStreakCount(){
  let count=0;
  for(let i=0;i<365;i++){ if(S.studyDays.includes(offsetDate(-i))) count++; else if(i>0) break; }
  return count;
}

function getLongestStreak(){
  if(!S.studyDays.length) return 0;
  const sorted=[...S.studyDays].sort(); let max=1,cur=1;
  for(let i=1;i<sorted.length;i++){
    const diff=(new Date(sorted[i])-new Date(sorted[i-1]))/86400000;
    if(diff===1){ cur++; max=Math.max(max,cur); } else cur=1;
  }
  return max;
}

function renderStreak(){
  checkStreak();
  const count=getStreakCount(), today=todayISO(), studiedToday=S.studyDays.includes(today);
  $id('streakNum').textContent=count; $id('longestStreak').textContent=getLongestStreak()+' days';
  const msgs=['Study today to start your streak!','🔥 1 day — great start!','🔥 2 days in a row!','🔥 3 days! You\'re on fire!','🔥 4 days! Keep it up!','🔥 5 days! Amazing!'];
  $id('streakMsg').textContent=(!studiedToday&&count===0)?msgs[0]:!studiedToday?`⚠️ Study today to keep your ${count}-day streak!`:count>=5?`🏆 ${count} days! Legendary!`:(msgs[count]||`🔥 ${count} day streak!`);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; let html='';
  for(let i=6;i>=0;i--){
    const d=offsetDate(-i), dow=(new Date(d+'T00:00:00').getDay()+6)%7;
    const studied=S.studyDays.includes(d), isToday=d===today;
    html+=`<div class="sw-day ${studied?'studied':''} ${isToday?'today':''}">${studied?'✔':isToday?'·':''}<span class="sw-lbl">${days[dow]}</span></div>`;
  }
  $id('streakWeek').innerHTML=html; drawStreakRing(count); renderCalendar();
}

function drawStreakRing(count){
  const canvas=$id('streakRing'); if(!canvas) return;
  const ctx=canvas.getContext('2d'), cx=80,cy=80,r=65,lw=12, pct=Math.min(count/30,1);
  ctx.clearRect(0,0,160,160);
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.strokeStyle='#f3f4f6'; ctx.lineWidth=lw; ctx.stroke();
  if(pct>0){
    const grad=ctx.createLinearGradient(0,0,160,160);
    grad.addColorStop(0,'#f97316'); grad.addColorStop(1,'#fbbf24');
    ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+pct*Math.PI*2);
    ctx.strokeStyle=grad; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.stroke();
  }
}

function calNav(dir){ S.calOffset+=dir; save(); renderCalendar(); }

function renderCalendar(){
  const now=new Date(), d=new Date(now.getFullYear(),now.getMonth()+S.calOffset,1);
  const year=d.getFullYear(), month=d.getMonth();
  $id('calMonthLbl').textContent=d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const firstDow=(new Date(year,month,1).getDay()+6)%7, daysInMonth=new Date(year,month+1,0).getDate();
  const today=todayISO(), monthStr=`${year}-${String(month+1).padStart(2,'0')}`;
  let html='', studyCount=0;
  for(let i=0;i<firstDow;i++) html+='<div class="cal-day empty"></div>';
  for(let day=1;day<=daysInMonth;day++){
    const iso=`${monthStr}-${String(day).padStart(2,'0')}`;
    const studied=S.studyDays.includes(iso), isToday=iso===today;
    if(studied) studyCount++;
    html+=`<div class="cal-day ${studied?'studied':''} ${isToday?'today':''}">${day}</div>`;
  }
  $id('calGrid').innerHTML=html; $id('calTotal').textContent=studyCount;
}
