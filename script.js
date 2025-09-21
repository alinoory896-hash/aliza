const form = document.getElementById('dailyForm');
const log = document.getElementById('log');

// بارگذاری داده‌های قبلی
document.addEventListener('DOMContentLoaded', renderLog);

// ثبت فرم
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const exercise = document.getElementById('exerciseDone').value;
  const notes = document.getElementById('notes').value.trim();
  const today = new Date().toLocaleDateString();

  if (!exercise) return alert("لطفاً انتخاب کنید تمرین انجام شد یا خیر!");

  const entry = { date: today, exercise, notes };

  // گرفتن داده‌های قبلی
  const entries = JSON.parse(localStorage.getItem('dailyEntries')) || [];
  entries.push(entry);
  localStorage.setItem('dailyEntries', JSON.stringify(entries));

  form.reset();
  renderLog();
});

// نمایش داده‌ها
function renderLog() {
  const entries = JSON.parse(localStorage.getItem('dailyEntries')) || [];
  log.innerHTML = '';

  entries.reverse().forEach(e => {
    const p = document.createElement('p');
    p.textContent = `${e.date} - تمرین: ${e.exercise}${e.notes ? ' - یادداشت: ' + e.notes : ''}`;
    log.appendChild(p);
  });
}
