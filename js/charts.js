// ============================================================
// CHARTS.JS — Donut chart, subject bars, analytics bar chart
// ============================================================

function renderSubjectBars(){
  S.subjects.forEach(s=>{ const rel=S.tasks.filter(t=>t.subject===s.name); if(rel.length) s.pct=Math.round(rel.filter(t=>t.done).length/rel.length*100); });
  const html=S.subjects.map(s=>`<div class="subj-row"><span class="subj-name">${s.name}</span><div class="subj-bar-wrap"><div class="subj-bar-fill" style="width:${s.pct}%;background:${s.color}"></div></div><span class="subj-pct">${s.pct}%</span></div>`).join('');
  $id('subjectBars').innerHTML=html;
  if($id('progressBars')) $id('progressBars').innerHTML=html;
}

function renderProgressPage(){
  if($id('progressBars')) $id('progressBars').innerHTML=S.subjects.map(s=>`<div class="subj-row"><span class="subj-name">${s.name}</span><div class="subj-bar-wrap"><div class="subj-bar-fill" style="width:${s.pct}%;background:${s.color}"></div></div><span class="subj-pct">${s.pct}%</span></div>`).join('');
}

function renderDonut(){
  const done=S.tasks.filter(t=>t.done).length, total=S.tasks.length, pct=total?Math.round(done/total*100):0;
  $id('donutPct').textContent=pct+'%';
  const canvas=$id('donutChart'); if(!canvas) return;
  const ctx=canvas.getContext('2d'), cx=70,cy=70,r=52,lw=16, angle=(pct/100)*Math.PI*2;
  ctx.clearRect(0,0,140,140);
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.strokeStyle='#f3f4f6'; ctx.lineWidth=lw; ctx.stroke();
  if(angle>0){
    [{c:'#1d4ed8',s:-Math.PI/2,e:-Math.PI/2+angle*0.4},{c:'#fbbf24',s:-Math.PI/2+angle*0.4,e:-Math.PI/2+angle*0.7},{c:'#10b981',s:-Math.PI/2+angle*0.7,e:-Math.PI/2+angle}]
    .forEach(seg=>{ if(seg.e>seg.s){ ctx.beginPath(); ctx.arc(cx,cy,r,seg.s,seg.e); ctx.strokeStyle=seg.c; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.stroke(); } });
  }
}

function renderAnalytics(){
  const canvas=$id('analyticsChart'); if(!canvas) return;
  const ctx=canvas.getContext('2d'), days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data=days.map(()=>Math.floor(Math.random()*5)+1);
  const W=canvas.width,H=canvas.height,pad={top:20,right:20,bottom:40,left:40};
  const chartW=W-pad.left-pad.right, chartH=H-pad.top-pad.bottom, maxVal=Math.max(...data,6);
  const barW=chartW/days.length*0.5, gap=chartW/days.length;
  ctx.clearRect(0,0,W,H); ctx.fillStyle='#f9fafb'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<=5;i++){
    const y=pad.top+chartH-(i/5)*chartH;
    ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#9ca3af'; ctx.font='11px Inter,sans-serif'; ctx.fillText(Math.round(i/5*maxVal),4,y+4);
  }
  days.forEach((day,i)=>{
    const x=pad.left+i*gap+gap/2-barW/2, barH=(data[i]/maxVal)*chartH, y=pad.top+chartH-barH;
    const grad=ctx.createLinearGradient(0,y,0,y+barH); grad.addColorStop(0,'#3b82f6'); grad.addColorStop(1,'#1d4ed8');
    ctx.fillStyle=grad; ctx.beginPath();
    ctx.roundRect?ctx.roundRect(x,y,barW,barH,4):ctx.rect(x,y,barW,barH); ctx.fill();
    ctx.fillStyle='#374151'; ctx.font='11px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(day,pad.left+i*gap+gap/2,H-10); ctx.fillText(data[i]+'h',pad.left+i*gap+gap/2,y-5);
  });
}
