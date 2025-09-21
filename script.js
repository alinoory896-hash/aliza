// نمایش تاریخ شمسی
const dateEl = document.getElementById("date");
const today = new Date().toLocaleDateString("fa-IR", { 
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
});
dateEl.textContent = today;

// تمرینات روز بر اساس شماره روز هفته
const workoutsByDay = {
  0: ["استراحت کامل", "کشش سبک"],
  1: ["پرس سینه دمبل", "پرس بالا سینه", "جلو بازو", "Face Pull"],
  2: ["اسکوات", "لانج", "Hip Thrust", "Glute Bridge"],
  3: ["استراحت فعال", "Plank", "Dead Bug"],
  4: ["بارفیکس/لت پول‌داون", "پارو هالتر", "پشت بازو", "Superman"],
  5: ["پرس سرشانه", "نشر جانب", "شکم با کابل"],
  6: ["فول بادی", "HIIT", "Hip Thrust"]
};

const day = new Date().getDay(); // 0=یکشنبه تا 6=شنبه
const workouts = workoutsByDay[day] || [];
const workoutDiv = document.getElementById("workouts");
workouts.forEach(w => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<span>${w}</span><input type="checkbox" class="check" data-type="workout">`;
  workoutDiv.appendChild(div);
});

// محاسبه درصد پیشرفت
const checks = document.querySelectorAll(".check");
checks.forEach(chk => chk.addEventListener("change", updateProgress));

function updateProgress() {
  const total = checks.length;
  const done = [...checks].filter(c => c.checked).length;
  const percent = Math.round((done / total) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent = percent + "%";
  localStorage.setItem("progress-" + today, JSON.stringify([...checks].map(c => c.checked)));
}

// بازیابی از localStorage
const saved = JSON.parse(localStorage.getItem("progress-" + today) || "[]");
if (saved.length) {
  saved.forEach((val, i) => { checks[i].checked = val; });
  updateProgress();
}
