const form = document.getElementById('reportForm');
const reportList = document.getElementById('reportList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const sortOrder = document.getElementById('sortOrder');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');
const pendingCount = document.getElementById('pendingCount');
const toggleDark = document.getElementById('toggleDark');
const deleteAllBtn = document.getElementById('deleteAll');

let reports = JSON.parse(localStorage.getItem('reports')) || [];
let editIndex = -1;
let darkMode = localStorage.getItem('darkMode') === 'true';

if(darkMode) document.body.classList.add('dark');

function saveReports() {
  localStorage.setItem('reports', JSON.stringify(reports));
}

function updateSummary() {
  const total = reports.length;
  const done = reports.filter(r => r.status === "انجام شد").length;
  const pending = reports.filter(r => r.status === "در حال انجام").length;
  totalCount.textContent = `تعداد کل: ${total}`;
  doneCount.textContent = `انجام شده: ${done}`;
  pendingCount.textContent = `در حال انجام: ${pending}`;
}

function renderReports() {
  const searchTerm = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;
  const order = sortOrder.value;

  reportList.innerHTML = '';
  let displayReports = [...reports];

  if(order === 'oldest') displayReports.reverse();

  displayReports.forEach((report, index) => {
    if(statusFilter && report.status !== statusFilter) return;
    if(searchTerm && !report.title.toLowerCase().includes(searchTerm)) return;

    const li = document.createElement('li');
    li.className = report.status === "انجام شد" ? 'done' : 'pending';
    li.innerHTML = `
      <strong>${report.date} - ${report.title}</strong>
      <p>${report.description}</p>
      <em>${report.status}</em>
      <button class="edit-btn" onclick="editReport(${index})">ویرایش</button>
      <button class="delete-btn" onclick="deleteReport(${index})">حذف</button>
    `;
    reportList.appendChild(li);
  });
  updateSummary();
}

function deleteReport(index) {
  if(confirm("آیا مطمئن هستید می‌خواهید این گزارش را حذف کنید؟")) {
    reports.splice(index, 1);
    saveReports();
    renderReports();
  }
}

function editReport(index) {
  const report = reports[index];
  document.getElementById('date').value = report.date;
  document.getElementById('title').value = report.title;
  document.getElementById('description').value = report.description;
  document.getElementById('status').value = report.status;
  editIndex = index;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const report = {
    date: document.getElementById('date').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value
  };

  if(editIndex >= 0) {
    reports[editIndex] = report;
    editIndex = -1;
  } else {
    reports.unshift(report);
  }

  saveReports();
  renderReports();
  form.reset();
});

searchInput.addEventListener('input', renderReports);
filterStatus.addEventListener('change', renderReports);
sortOrder.addEventListener('change', renderReports);

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', darkMode);
});

deleteAllBtn.addEventListener('click', () => {
  if(confirm("آیا مطمئن هستید که می‌خواهید همه گزارش‌ها حذف شوند؟")) {
    reports = [];
    saveReports();
    renderReports();
  }
});

renderReports();
