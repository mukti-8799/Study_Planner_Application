// ============================================================
// EXAMS.JS — Exams CRUD, edit & render
// ============================================================

function renderExams(){
  const sorted=[...S.exams].sort((a,b)=>new Date(a.date)-new Date(b.date));
  $id('examCount').textContent=sorted.length;
  $id('examList').innerHTML=sorted.map(e=>examHTML(e)).join('');
}

function examHTML(e){
  return `<li class="exam-item">
    <span class="exam-icon-box" style="background:${e.color}22"><span style="color:${e.color}">📝</span></span>
    <span class="exam-name">${e.name}</span>
    <span class="exam-date">${fmtDate(e.date)}</span>
    <div class="exam-actions">
      <button class="exam-edit-btn" onclick="event.stopPropagation();openEditExam(${e.id})">✏️</button>
      <button class="del-btn" onclick="event.stopPropagation();deleteExam(${e.id})">🗑</button>
    </div>
  </li>`;
}

function renderExamsPage(){
  const sorted=[...S.exams].sort((a,b)=>new Date(a.date)-new Date(b.date));
  $id('allExamList').innerHTML=sorted.map(e=>examHTML(e)).join('');
}

function addExam(){
  const name=$id('newExamName').value.trim(), date=$id('newExamDate').value, color=$id('newExamColor').value;
  if(!name||!date) return;
  S.exams.push({id:Date.now(),name,date,color});
  $id('newExamName').value=''; $id('newExamDate').value='';
  save(); renderExams(); closeModal('addExamModal');
  addNotif(`Exam added: "${name}" on ${fmtDate(date)}`);
}

function deleteExam(id){ S.exams=S.exams.filter(e=>e.id!==id); save(); renderExams(); renderExamsPage(); }

function openEditExam(id){
  const e=S.exams.find(e=>e.id===id); if(!e) return;
  $id('editExamId').value=e.id; $id('editExamName').value=e.name;
  $id('editExamDate').value=e.date; $id('editExamColor').value=e.color;
  openModal('editExamModal');
}

function saveEditExam(){
  const id=parseInt($id('editExamId').value), e=S.exams.find(e=>e.id===id); if(!e) return;
  e.name=$id('editExamName').value.trim()||e.name;
  e.date=$id('editExamDate').value||e.date;
  e.color=$id('editExamColor').value;
  save(); renderExams(); renderExamsPage(); closeModal('editExamModal');
  showToast('📝','Exam Updated',e.name);
}
