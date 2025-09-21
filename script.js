// داده‌ها
let meals = JSON.parse(localStorage.getItem("meals")) || [];
let journals = JSON.parse(localStorage.getItem("journals")) || [];
let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory")) || [];
let streak = parseInt(localStorage.getItem("streak") || 0);
let level = parseInt(localStorage.getItem("level") || 1);
let workoutSeconds = 0;
let workoutInterval, restInterval;

// --- تم ---
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// --- مدیریت وعده‌ها ---
const mealForm = document.getElementById("mealForm");
const mealList = document.getElementById("mealList");
const mealSummary = document.getElementById("mealSummary");

mealForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("mealName").value;
    const calories = parseInt(document.getElementById("mealCalories").value) || 0;
    const protein = parseInt(document.getElementById("mealProtein").value) || 0;
    const carbs = parseInt(document.getElementById("mealCarbs").value) || 0;
    const fat = parseInt(document.getElementById("mealFat").value) || 0;
    meals.push({ name, calories, protein, carbs, fat });
    localStorage.setItem("meals", JSON.stringify(meals));
    renderMeals();
    mealForm.reset();
});

function renderMeals() {
    mealList.innerHTML = "";
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
    meals.forEach(m => {
        totalCal += m.calories;
        totalProt += m.protein;
        totalCarb += m.carbs;
        totalFat += m.fat;
        const li = document.createElement("li");
        li.textContent = `${m.name} - ${m.calories} کالری - ${m.protein} پروتئین - ${m.carbs} کربوهیدرات - ${m.fat} چربی`;
        mealList.appendChild(li);
    });
    mealSummary.textContent = `جمع کل کالری: ${totalCal} | پروتئین: ${totalProt} | کربوهیدرات: ${totalCarb} | چربی: ${totalFat}`;
}
renderMeals();

// --- تایمر تمرین ---
document.getElementById("startWorkout").addEventListener("click", () => {
    clearInterval(workoutInterval);
    workoutInterval = setInterval(() => {
        workoutSeconds++;
        document.getElementById("workoutTimer").textContent =
            `مدت تمرین: ${Math.floor(workoutSeconds/60)}:${("0"+workoutSeconds%60).slice(-2)}`;
    },1000);
});

document.getElementById("stopWorkout").addEventListener("click", () => {
    clearInterval(workoutInterval);
    if(workoutSeconds>0){
        workoutHistory.push(workoutSeconds);
        localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
        renderCharts();
        streak++; // افزایش استریک روزانه
        localStorage.setItem("streak", streak);
        if(streak % 5 === 0) level++; // افزایش سطح هر 5 روز
        localStorage.setItem("level", level);
        updateGamification();
    }
    workoutSeconds=0;
    document.getElementById("workoutTimer").textContent="مدت تمرین: 0:00";
});

// --- تایمر استراحت ---
document.getElementById("startRest").addEventListener("click", ()=>{
    let restTime = parseInt(document.getElementById("restInput").value);
    clearInterval(restInterval);
    restInterval = setInterval(()=>{
        if(restTime<=0){
            clearInterval(restInterval);
            document.getElementById("restTimer").textContent="زمان استراحت تمام شد!";
            if(Notification.permission==="granted") new Notification("⏱️ وقت تمرین شد!");
        }else{
            document.getElementById("restTimer").textContent=`زمان باقی‌مانده: ${restTime--} ثانیه`;
        }
    },1000);
});

// --- ژورنال ---
const journalInput = document.getElementById("journalInput");
const journalHistory = document.getElementById("journalHistory");
const journalSearch = document.getElementById("journalSearch");

document.getElementById("saveJournal").addEventListener("click", ()=>{
    const text = journalInput.value.trim();
    if(!text) return;
    const entry = {date:new Date().toLocaleDateString("fa-IR"), text};
    journals.push(entry);
    localStorage.setItem("journals", JSON.stringify(journals));
    renderJournal();
    journalInput.value="";
});

journalSearch.addEventListener("input", ()=>renderJournal(journalSearch.value));

function renderJournal(search=""){
    journalHistory.innerHTML="";
    journals.filter(j=>j.text.includes(search)).forEach(j=>{
        const li = document.createElement("li");
        li.textContent = `${j.date}: ${j.text}`;
        journalHistory.appendChild(li);
    });
}
renderJournal();

// --- گیمیفیکیشن ---
function updateGamification(){
    document.getElementById("streak").textContent=`Streak: ${streak} روز`;
    document.getElementById("level").textContent=`سطح: ${level}`;
    const medalsDiv=document.getElementById("medals");
    medalsDiv.innerHTML="";
    for(let i=0;i<streak;i++){
        const span=document.createElement("span");
        span.textContent="🏅";
        medalsDiv.appendChild(span);
    }
}
updateGamification();

// --- نمودارها ---
const progressCtx = document.getElementById("progressChart").getContext("2d");
const workoutCtx = document.getElementById("workoutChart").getContext("2d");

let progressChart = new Chart(progressCtx,{
    type:"doughnut",
    data:{ labels:["کالری مصرف‌شده","باقی‌مانده"], datasets:[{data:[0,2350], backgroundColor:["#4caf50","#ddd"]}] }
});

let workoutChart = new Chart(workoutCtx,{
    type:"line",
    data:{ labels:[], datasets:[{label:"مدت تمرین (ثانیه)", data:[], borderColor:"#007bff", fill:false}] }
});

function renderCharts(){
    let totalCal = meals.reduce((a,b)=>a+b.calories,0);
    progressChart.data.datasets[0].data=[totalCal,Math.max(0,2350-totalCal)];
    progressChart.update();

    workoutChart.data.labels = workoutHistory.map((w,i)=>`روز ${i+1}`);
    workoutChart.data.datasets[0].data = workoutHistory;
    workoutChart.update();
}
renderCharts();

// --- کارت انگیزشی ---
const motivations = ["💪 سخت تمرین کن، نتیجه‌اش شیرینه.","🔥 هر روز یه قدم به هدفت نزدیک‌تر شو.","🏆 موفقیت با استمرار ساخته میشه.","🥦 غذای سالم = انرژی بیشتر."];
document.getElementById("motivationCard").textContent = motivations[Math.floor(Math.random()*motivations.length)];

// --- نوتیفیکیشن ---
if(Notification.permission!=="granted") Notification.requestPermission();
