// ============================================================
// TASKS.JS — Tasks, Notes, Flashcards
// ============================================================

function refreshSubjectDL(){
  const dl=$id('subjectDL'); if(!dl) return;
  dl.innerHTML=[...new Set(S.tasks.map(t=>t.subject).filter(Boolean))].map(s=>`<option value="${s}">`).join('');
}

function renderTasks(){
  const done=S.tasks.filter(t=>t.done).length, total=S.tasks.length;
  $id('tasksDone').textContent=done; $id('tasksTotal').textContent=total;
  $id('taskBarFill').style.width=(total?Math.round(done/total*100):0)+'%';
  $id('taskList').innerHTML=S.tasks.slice(0,6).map(t=>taskHTML(t)).join('');
}

function taskHTML(t){
  return `<li class="task-item ${t.done?'done':''}" onclick="toggleTask(${t.id})">
    <span class="task-check ${t.done?'done':''}">${t.done?'✔':''}</span>
    <span class="task-text">${t.text}</span>
    ${t.subject?`<span class="task-subject">${t.subject}</span>`:''}
    <button class="del-btn" onclick="event.stopPropagation();deleteTask(${t.id})">🗑</button>
  </li>`;
}

function toggleTask(id){ const t=S.tasks.find(t=>t.id===id); if(t){ t.done=!t.done; save(); renderAll(); } }
function deleteTask(id){ S.tasks=S.tasks.filter(t=>t.id!==id); save(); renderAll(); }

function addTask(){
  const text=$id('newTaskText').value.trim(), subject=$id('newTaskSubject').value.trim()||'General', priority=$id('newTaskPriority').value;
  if(!text) return;
  S.tasks.push({id:Date.now(),text,done:false,subject,priority});
  if(!S.subjects.find(s=>s.name===subject)){
    const colors=['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
    S.subjects.push({name:subject,pct:0,color:colors[S.subjects.length%colors.length]});
  }
  $id('newTaskText').value=''; $id('newTaskSubject').value='';
  save(); renderAll(); closeModal('addTaskModal');
  addNotif(`Task added: "${text}"`); showToast('✅','Task Added',text);
}

function renderTodayPage(){ $id('todayTaskList').innerHTML=S.tasks.map(t=>taskHTML(t)).join(''); }
function renderTasksPage(){ $id('allTaskList').innerHTML=S.tasks.map(t=>taskHTML(t)).join(''); }

function addNote(){
  const title=$id('newNoteTitle').value.trim(), content=$id('newNoteContent').value.trim();
  if(!title) return;
  S.notes.push({id:Date.now(),title,content});
  $id('newNoteTitle').value=''; $id('newNoteContent').value='';
  save(); closeModal('addNoteModal'); showToast('📝','Note Saved',title);
}

function addFlashcard(){
  const q=$id('fcQuestion').value.trim(), a=$id('fcAnswer').value.trim();
  if(!q||!a) return;
  S.flashcards.push({id:Date.now(),q,a});
  $id('fcQuestion').value=''; $id('fcAnswer').value='';
  save(); closeModal('flashcardsModal'); showToast('🃏','Flashcard Created',q);
}
