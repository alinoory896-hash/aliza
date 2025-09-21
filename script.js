const form=document.getElementById('reportForm');
const reportList=document.getElementById('reportList');
const searchInput=document.getElementById('searchInput');
const filterStatus=document.getElementById('filterStatus');
const filterCategory=document.getElementById('filterCategory');
const sortOrder=document.getElementById('sortOrder');
const totalCount=document.getElementById('totalCount');
const doneCount=document.getElementById('doneCount');
const pendingCount=document.getElementById('pendingCount');
const failedCount=document.getElementById('failedCount');
const toggleDark=document.getElementById('toggleDark');
const deleteAllBtn=document.getElementById('deleteAll');
const exportDataBtn=document.getElementById('exportData');
const importDataInput=document.getElementById('importData');
const doneBar=document.getElementById('doneBar');
const pendingBar=document.getElementById('pendingBar');
const failedBar=document.getElementById('failedBar');

let reports=JSON.parse(localStorage.getItem('reports'))||[];
let editIndex=-1;
let darkMode=localStorage.getItem('darkMode')==='true';
if(darkMode) document.body.classList.add('dark');

const draft=JSON.parse(localStorage.getItem('formDraft'));
if(draft){
  ['date','title','description','status','category','tags'].forEach(id=>{
    if(document.getElementById(id)) document.getElementById(id).value=draft[id]||'';
  });
}

// ذخیره خودکار فرم
['date','title','description','status','category','tags'].forEach(id=>{
  document.getElementById(id).addEventListener('input',()=>{
    const draftData={};
    ['date','title','description','status','category','tags'].forEach(i=>{ draftData[i]=document.getElementById(i).value });
    localStorage.setItem('formDraft',JSON.stringify(draftData));
  });
});

function saveReports(){ localStorage.setItem('reports',JSON.stringify(reports)); }
function updateSummary(){
  const total=reports.length;
  const done=reports.filter(r=>r.status==="انجام شد").length;
  const pending=reports.filter(r=>r.status==="در حال انجام").length;
  const failed=reports.filter(r=>r.status==="انجام نشد").length;
  totalCount.textContent=`تعداد کل: ${total}`;
  doneCount.textContent=`انجام شده: ${done}`;
  pendingCount.textContent=`در حال انجام: ${pending}`;
  failedCount.textContent=`انجام نشد: ${failed}`;

  const percent=(val)=> total?Math.round((val/total)*100)+'%':'0%';
  doneBar.style.width=percent(done);
  pendingBar.style.width=percent(pending);
  failedBar.style.width=percent(failed);
}

function renderCategories(){
  const cats=[...new Set(reports.map(r=>r.category).filter(c=>c))];
  filterCategory.innerHTML='<option value="">همه دسته‌ها</option>';
  cats.forEach(c=>{
    const opt=document.createElement('option'); opt.value=c; opt.textContent=c; filterCategory.appendChild(opt);
  });
}

function renderReports(){
  const searchTerm=searchInput.value.toLowerCase();
  const statusFilterVal=filterStatus.value;
  const categoryFilterVal=filterCategory.value;
  const order=sortOrder.value;

  reportList.innerHTML='';
  let displayReports=[...reports];
  if(order==='oldest') displayReports.reverse();

  displayReports.forEach((report,index)=>{
    if(statusFilterVal && report.status!==statusFilterVal) return;
    if(categoryFilterVal && report.category!==categoryFilterVal) return;
    if(searchTerm && !report.title.toLowerCase().includes(searchTerm) && !(report.tags||'').toLowerCase().includes(searchTerm)) return;

    const li=document.createElement('li');
    const today=new Date().toISOString().split('T')[0];
    li.className=report.status==='انجام شد'?'done':report.status==='در حال انجام'?'pending':'failed';
    if(report.date===today) li.classList.add('today');
    li.innerHTML=`
      <strong>${report.date} - ${report.title}</strong>
      <p>${report.description}</p>
      <em>${report.status}${report.category?` | ${report.category}`:''}${report.tags?` | تگ‌ها: ${report.tags}`:''}</em>
      <button class="edit-btn" onclick="editReport(${index})">ویرایش</button>
      <button class="delete-btn" onclick="deleteReport(${index})">حذف</button>
    `;
    reportList.appendChild(li);
  });
  updateSummary();
  renderCategories();
  renderCharts();
}

// Delete & edit
function deleteReport(index){ if(confirm("آیا مطمئن هستید می‌خواهید این گزارش را حذف کنید؟")){ reports.splice(index,1); saveReports(); renderReports(); } }
function editReport(index){ const r=reports[index]; ['date','title','description','status','category','tags'].forEach(i=>document.getElementById(i).value=r[i]||''); editIndex=index; }

form.addEventListener('submit',e=>{
  e.preventDefault();
  const report={};
  ['date','title','description','status','category','tags'].forEach(i=>report[i]=document.getElementById(i).value);
  if(editIndex>=0){ reports[editIndex]=report; editIndex=-1; } else{ reports.unshift(report); }
  saveReports(); renderReports(); form.reset(); localStorage.removeItem('formDraft');
});

searchInput.addEventListener('input', renderReports);
filterStatus.addEventListener('change', renderReports);
filterCategory.addEventListener('change', renderReports);
sortOrder.addEventListener('change', renderReports);
toggleDark.addEventListener('click',()=>{ document.body.classList.toggle('dark'); darkMode=document.body.classList.contains('dark'); localStorage.setItem('darkMode',darkMode); });
deleteAllBtn.addEventListener('click',()=>{ if(confirm("آیا مطمئن هستید که همه گزارش‌ها حذف شوند؟")){ reports=[]; saveReports(); renderReports(); } });
exportDataBtn.addEventListener('click',()=>{
  const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(reports));
  const dl=document.createElement('a'); dl.setAttribute('href',dataStr); dl.setAttribute('download','reports.json'); dl.click();
});
importDataInput.addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const imported=JSON.parse(e.target.result);
      if(Array.isArray(imported)){ reports=imported; saveReports(); renderReports(); }
      else alert("فایل JSON معتبر نیست.");
    }catch{ alert("خطا در خواندن فایل."); }
  }
  reader.readAsText(file);
});

// Charts
function renderCharts(){
  const doneCountChart=reports.filter(r=>r.status==="انجام شد").length;
  const pendingCountChart=reports.filter(r=>r.status==="در حال انجام").length;
  const failedCountChart=reports.filter(r=>r.status==="انجام نشد").length;

  const categoryMap={}; reports.forEach(r=>{ if(r.category) categoryMap[r.category]=(categoryMap[r.category]||0)+1; });
  const dateMap={}; reports.forEach(r=>{ dateMap[r.date]=(dateMap[r.date]||0)+1; });

  const statusCtx=document.getElementById('statusChart').getContext('2d');
  if(window.statusChartInstance) window.statusChartInstance.destroy();
  window.statusChartInstance=new Chart(statusCtx,{ type:'doughnut', data:{ labels:['انجام شد','در حال انجام','انجام نشد'], datasets:[{ data:[doneCountChart,pendingCountChart,failedCountChart], backgroundColor:['#4caf50','#ff9800','#f44336'] }] } });

  const categoryCtx=document.getElementById('categoryChart').getContext('2d');
  if(window.categoryChartInstance) window.categoryChartInstance.destroy();
  window.categoryChartInstance=new Chart(categoryCtx,{ type:'bar', data:{ labels:Object.keys(categoryMap), datasets:[{ label:'تعداد گزارش‌ها', data:Object.values(categoryMap), backgroundColor:'#007bff' }] } });

  const dateCtx=document.getElementById('dateChart').getContext('2d');
  if(window.dateChartInstance) window.dateChartInstance.destroy();
  window.dateChartInstance=new Chart(dateCtx,{ type:'line', data:{ labels:Object.keys(dateMap), datasets:[{ label:'گزارش‌ها', data:Object.values(dateMap), backgroundColor:'rgba(0,123,255,0.2)', borderColor:'#007bff', fill:true }] } });
}

// Notification روزانه و هفتگی
if("Notification" in window && Notification.permission!=="granted") Notification.requestPermission();

function notify(title,body){ if(Notification.permission==="granted"){ new Notification(title,{body}); } }
setInterval(()=>{ const today=new Date().toISOString().split('T')[0]; const pendingToday=reports.filter(r=>r.date===today && r.status!=="انجام شد"); if(pendingToday.length) notify("یادآوری گزارش امروز","شما "+pendingToday.length+" گزارش ثبت نشده دارید!"); },1000*60*60*12); // هر 12 ساعت

renderReports();
