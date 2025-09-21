// === تاریخ شمسی ===
function toJalali(date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  const d = new Date(gYear, gMonth - 1, gDay);
  return d.toLocaleDateString("fa-IR");
}
document.getElementById("today").innerText = toJalali(new Date());

// === دارک/لایت مود ===
const toggleBtn = document.getElementById("toggle-theme");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

// === کالری ===
const mealCheckboxes = document.querySelectorAll(".meal");
const totalCalEl = document.getElementById("total-cal");
mealCheckboxes.forEach(cb => cb.addEventListener("change", updateCalories));
function updateCalories() {
  let total = 0;
  mealCheckboxes.forEach(cb => {
    if (cb.checked) total += parseInt(cb.dataset.cal);
  });
  totalCalEl.textContent = total;
}

// === تایمر تمرین ===
let timer;
document.getElementById("start-timer").addEventListener("click", () => {
  let seconds = 60; // 1 دقیقه استراحت
  clearInterval(timer);
  timer = setInterval(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer-display").textContent = `${m}:${s}`;
    if (seconds-- <= 0) clearInterval(timer);
  }, 1000);
});

// === نمودار ===
const ctx = document.getElementById("progressChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["غذا", "مکمل", "تمرین"],
    datasets: [{
      data: [0,0,0],
      backgroundColor: ["#ff6384","#36a2eb","#4caf50"]
    }]
  }
});
function updateChart() {
  const meals = document.querySelectorAll(".meal:checked").length;
  const sups = document.querySelectorAll(".supplement:checked").length;
  const workouts = document.querySelectorAll(".workout:checked").length;
  chart.data.datasets[0].data = [meals, sups, workouts];
  chart.update();
}
document.querySelectorAll("input").forEach(i => i.addEventListener("change", updateChart));

// === ذخیره سازی ===
document.getElementById("save-report").addEventListener("click", () => {
  const report = {
    date: toJalali(new Date()),
    calories: totalCalEl.textContent,
    meals: [...mealCheckboxes].map(cb => cb.checked),
    supplements: [...document.querySelectorAll(".supplement")].map(cb => cb.checked),
    workouts: [...document.querySelectorAll(".workout")].map(cb => cb.checked)
  };
  localStorage.setItem("report", JSON.stringify(report));
  alert("گزارش ذخیره شد ✅");
});

// === خروجی PDF ===
document.getElementById("download-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("گزارش روزانه", 10, 10);
  doc.text("تاریخ: " + toJalali(new Date()), 10, 20);
  doc.text("کالری: " + totalCalEl.textContent, 10, 30);
  doc.save("report.pdf");
});

// === نوتیفیکیشن ===
document.getElementById("notify").addEventListener("click", () => {
  if (Notification.permission === "granted") {
    new Notification("وقت تمرین شد 🏋️‍♂️");
  } else {
    Notification.requestPermission().then(p => {
      if (p === "granted") new Notification("یادآوری فعال شد ✅");
    });
  }
});
