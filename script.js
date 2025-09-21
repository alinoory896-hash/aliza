// داده‌ها
let meals = JSON.parse(localStorage.getItem("meals")) || [];
let journals = JSON.parse(localStorage.getItem("journals")) || [];
let weightHistory = JSON.parse(localStorage.getItem("weightHistory")) || [];
let streak = parseInt(localStorage.getItem("streak") || 0);
let level = parseInt(localStorage.getItem("level") || 1);
let workoutSeconds = 0;
let workoutInterval, restInterval;

// --- تم ---
document.getElementById("toggleTheme").addEventListener("click",()=>document.body.classList.toggle("dark"));

// --- مدیریت وعده‌ها ---
const mealForm = document.getElementById("mealForm");
const mealList = document.getElementById("mealList");
const mealSummary = document.getElementById("mealSummary");

mealForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("mealName").value;
    const calories=parseInt(document.getElementById("mealCalories").value)||0;
    const protein=parseInt(document.getElementById("mealProtein").value)||0;
    const carbs=parseInt(document.getElementById("mealCarbs").value)||0;
    const fat=parseInt(document.getElementById("mealFat").value)||0;
    if(!name) return;
    meals.push({name,calories,protein,carbs,fat});
    localStorage.setItem("meals",JSON.stringify(meals));
    renderMeals();
    mealForm.reset();
});
function renderMeals(){
    mealList.innerHTML="";
    let totalCal=0;
    meals.forEach((m)=>{
        totalCal+=m.calories;
        const li=document.createElement("li");
        li.textContent=`${m.name} - ${m.calories} کالری - ${m.protein} پروتئین - ${m.carbs} کربوهیدرات - ${m.fat} چربی`;
        mealList.appendChild(li);
    });
    mealSummary.textContent=`جمع کل کالری: ${totalCal}`;
}
renderMeals();

// --- تایمر تمرین ---
document.getElementById("startWorkout").addEventListener("click",()=>{
    clearInterval(workoutInterval);
    workoutInterval=setInterval(()=>{
        workoutSeconds++;
        document.getElementById("workoutTimer").textContent=`مدت تمرین: ${Math.floor(workoutSeconds/60)}:${("0"+workoutSeconds%60).slice(-2)}`;
    },1000);
});
document.getElementById("stopWorkout").addEventListener("click",()=>{
    clearInterval(workoutInterval);
    workoutSeconds=0;
    document.getElementById("workoutTimer").textContent="مدت تمرین: 0:00";
});
document.getElementById("startRest").addEventListener("click",()=>{
    let restTime=parseInt(document.getElementById("restInput").value);
    clearInterval(restInterval);
    restInterval=setInterval(()=>{
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
const journalInput=document.getElementById("journalInput");
const journalHistory=document.getElementById("journalHistory");
document.getElementById("saveJournal").addEventListener("click",()=>{
    const text=journalInput.value;
    if(!text) return;
    const entry={date:new Date().toLocaleDateString("fa-IR"),text};
    journals.push(entry);
    localStorage.setItem("journals",JSON.stringify(journals));
    renderJournal();
    journalInput.value="";
});
function
