const form = document.getElementById('reportForm');
const reportList = document.getElementById('reportList');

let reports = JSON.parse(localStorage.getItem('reports')) || [];

function saveReports() {
  localStorage.setItem('reports', JSON.stringify(reports));
}

function renderReports() {
  reportList.innerHTML = '';
  reports.forEach((report, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${report.date} - ${report.title}</strong>
      <p>${report.description}</p>
      <em>${report.status}</em>
      <button onclick="deleteReport(${index})">حذف</button>
    `;
    reportList.appendChild(li);
  });
}

function deleteReport(index) {
  reports.splice(index, 1);
  saveReports();
  renderReports();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const report = {
    date: document.getElementById('date').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value
  };
  reports.unshift(report);
  saveReports();
  renderReports();
  form.reset();
});

renderReports();
