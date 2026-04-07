// ============================================================
// RESOURCES.JS — Resources CRUD, edit & render
// ============================================================

function resIconColor(type){ return {PDF:'#ef4444',Video:'#3b82f6',Link:'#10b981',Notes:'#f59e0b'}[type]||'#6b7280'; }
function resEmoji(type){ return {PDF:'📄',Video:'📹',Link:'🔗',Notes:'📝'}[type]||'📁'; }

function renderResources(){ $id('resList').innerHTML=S.resources.slice(0,4).map(r=>resHTML(r)).join(''); }

function resHTML(r){
  const c=resIconColor(r.type);
  return `<li class="res-item">
    <span class="res-icon-box" style="background:${c}22;color:${c}" onclick="openResource('${r.url}')">${resEmoji(r.type)}</span>
    <div class="res-info" onclick="openResource('${r.url}')" style="cursor:pointer">
      <div class="res-name">${r.name}</div><div class="res-type">${r.type}</div>
    </div>
    <div class="res-actions">
      <button class="res-edit-btn" onclick="openEditResource(${r.id})">✏️</button>
      <button class="res-del-btn"  onclick="deleteResource(${r.id})">🗑️</button>
    </div>
  </li>`;
}

function openEditResource(id){
  const r=S.resources.find(r=>r.id===id); if(!r) return;
  $id('editResId').value=r.id; $id('editResName').value=r.name;
  $id('editResType').value=r.type; $id('editResUrl').value=r.url||'';
  openModal('editResourceModal');
}

function saveEditResource(){
  const id=parseInt($id('editResId').value), r=S.resources.find(r=>r.id===id); if(!r) return;
  r.name=$id('editResName').value.trim()||r.name; r.type=$id('editResType').value;
  r.url=$id('editResUrl').value.trim(); r.color=resIconColor(r.type);
  save(); renderResources(); renderResourcesPage(); closeModal('editResourceModal');
  showToast('✅','Resource Updated',r.name);
}

function renderResourcesPage(){ $id('allResList').innerHTML=S.resources.map(r=>resHTML(r)).join(''); }
function openResource(url){ if(url) window.open(url,'_blank'); }

function addResource(){
  const name=$id('newResName').value.trim(), type=$id('newResType').value, url=$id('newResUrl').value.trim();
  if(!name) return;
  S.resources.push({id:Date.now(),name,type,url,color:resIconColor(type)});
  $id('newResName').value=''; $id('newResUrl').value='';
  save(); renderResources(); closeModal('addResourceModal');
}

function deleteResource(id){ S.resources=S.resources.filter(r=>r.id!==id); save(); renderResources(); renderResourcesPage(); }
