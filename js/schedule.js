// ============================================================
// SCHEDULE.JS — Schedule CRUD & render
// ============================================================

function renderSchedule(){
  const now=new Date(), nowMin=now.getHours()*60+now.getMinutes();
  const sorted=[...S.schedule].sort((a,b)=>a.time.localeCompare(b.time));
  $id('schedList').innerHTML=sorted.map(s=>{
    const [h,m]=s.time.split(':').map(Number), isNow=Math.abs(h*60+m-nowMin)<=10;
    return `<li class="sched-item" style="${isNow?'background:#eff6ff':''}">
      <span class="sched-dot" style="background:${s.color}"></span>
      <span class="sched-time">${fmtTime(s.time)}</span>
      <span class="sched-label">${s.label}</span>
      <button class="del-btn" onclick="deleteSchedule(${s.id})">🗑</button>
    </li>`;
  }).join('');
}

function renderSchedulePage(){
  const sorted=[...S.schedule].sort((a,b)=>a.time.localeCompare(b.time));
  $id('fullSchedList').innerHTML=sorted.map(s=>`<li class="sched-item">
    <span class="sched-dot" style="background:${s.color}"></span>
    <span class="sched-time">${fmtTime(s.time)}</span>
    <span class="sched-label">${s.label}</span>
    <button class="del-btn" onclick="deleteSchedule(${s.id});renderSchedulePage()">🗑</button>
  </li>`).join('');
}

function addScheduleItem(){
  const time=$id('newSchedTime').value, label=$id('newSchedLabel').value.trim(), color=$id('newSchedColor').value;
  if(!time||!label) return;
  S.schedule.push({id:Date.now(),time,label,color});
  $id('newSchedTime').value=''; $id('newSchedLabel').value='';
  save(); renderSchedule(); closeModal('addScheduleModal');
}

function deleteSchedule(id){ S.schedule=S.schedule.filter(s=>s.id!==id); save(); renderSchedule(); }
