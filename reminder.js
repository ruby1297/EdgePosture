// for testing, set to 10 seconds (10000 ms)
// if use real 60 minutes, set to 3600000 ms
const REMINDER_TOTAL_TIME = 3600000; 
let countdownInterval;

function startTimer() {
    const modal = document.getElementById("reminder-modal");
    const dashboard = document.getElementById("dashboard-container");
    const timeLeftEl = document.getElementById("time-left");

    console.log("倒數計時開始...");
    if (dashboard) dashboard.style.display = "flex";
    
    const endTime = Date.now() + REMINDER_TOTAL_TIME;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            if (timeLeftEl) timeLeftEl.innerText = "00:00";
            if (modal) modal.style.display = "flex";
        } else {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            if (timeLeftEl) {
                timeLeftEl.innerText = 
                    String(minutes).padStart(2, '0') + ":" + 
                    String(seconds).padStart(2, '0');
            }
        }
    }, 1000);
}

// logic for yoga.js
function updateClock() {
    const currentTimeEl = document.getElementById("current-time");
    if (currentTimeEl) {
        const now = new Date();
        currentTimeEl.innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
    }
}
setInterval(updateClock, 1000);

// logic for reminder.js
function startExercise() {
    document.getElementById("reminder-modal").style.display = "none";
    document.getElementById("dashboard-container").style.display = "none"; 
    if (typeof initYoga === "function") {
        initYoga(); 
    }
}


function snooze() {
    document.getElementById("reminder-modal").style.display = "none";
    startTimer(); 
}

function backToWork() {
    document.getElementById("game-container").style.display = "none";
    alert("休息結束，重新開始計時！");
    startTimer();
}

window.onload = () => {
    updateClock();
    startTimer();
};