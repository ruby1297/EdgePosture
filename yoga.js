const YOGA_TARGET_MS = 15000;   
const REST_DURATION_MS = 10000; 
const YOGA_TOTAL_REPS = 3;   

let yogaModel, yogaWebcam, yogaCtx, yogaMaxPredictions;
let isYogaDetecting = false;
let currentTargetPose = ""; 

let poseStartTime = null;      
let restStartTime = null;  
let completedReps = 0;
let isResting = false;

const yogaPoseDict = {
    "tree": { name: "樹式 (Tree Pose)", img: "./images/tree.jpg" },
    "downdog": { name: "下犬式 (Downward Dog)", img: "./images/downdog.jpg" },
    "warrior": { name: "戰士式 (Warrior Pose)", img: "./images/warrior.jpg" }
};

// initialize
async function initYoga() {
    const modelURL = "./model/model.json";
    const metadataURL = "./model/metadata.json";

    document.getElementById("yoga-container").style.display = "flex";
    const instructionText = document.getElementById("instruction-text");
    const poseImage = document.getElementById("pose-image");

    try {
        yogaModel = await tmPose.load(modelURL, metadataURL);
        yogaMaxPredictions = yogaModel.getTotalClasses();

        const keys = Object.keys(yogaPoseDict);
        currentTargetPose = keys[Math.floor(Math.random() * keys.length)];
        
        // Initalize state variables
        poseStartTime = null;
        restStartTime = null;
        completedReps = 0;
        isResting = false;
        
        const poseInfo = yogaPoseDict[currentTargetPose];
        instructionText.innerHTML = `準備開始：<span style="color:#4CAF50;">${poseInfo.name}</span><br>目標：15秒 × 3組 (組間休息10秒)`;
        
        if (poseImage) {
            poseImage.src = poseInfo.img;
            poseImage.style.display = "block";
        }

        const size = 400;
        yogaWebcam = new tmPose.Webcam(size, size, true);
        await yogaWebcam.setup(); 
        await yogaWebcam.play();
        
        isYogaDetecting = true;
        window.requestAnimationFrame(yogaLoop);

        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        yogaCtx = canvas.getContext("2d");

    } catch (error) {
        if (instructionText) instructionText.innerText = "載入失敗";
        console.error(error);
    }
}

// main loop
async function yogaLoop() {
    if (!isYogaDetecting) return; 
    yogaWebcam.update();
    await yogaPredict();
    window.requestAnimationFrame(yogaLoop);
}

async function yogaPredict() {
    const { pose, posenetOutput } = await yogaModel.estimatePose(yogaWebcam.canvas);
    const prediction = await yogaModel.predict(posenetOutput);

    if (yogaWebcam.canvas) {
        yogaCtx.drawImage(yogaWebcam.canvas, 0, 0);
        if (pose) {
            tmPose.drawKeypoints(pose.keypoints, 0.5, yogaCtx);
            tmPose.drawSkeleton(pose.keypoints, 0.5, yogaCtx);
        }
    }

    const instructionText = document.getElementById("instruction-text");
    const poseInfo = yogaPoseDict[currentTargetPose];

    // judge resting or exercising
    if (isResting) {
        // logic for resting
        if (restStartTime === null) restStartTime = Date.now();
        
        const elapsedRest = Date.now() - restStartTime;
        const restSecondsLeft = Math.ceil((REST_DURATION_MS - elapsedRest) / 1000);

        instructionText.innerHTML = `<b style="color:orange;"> 組間休息中...</b><br>下一組倒數 ${restSecondsLeft} 秒`;

        if (elapsedRest >= REST_DURATION_MS) {
            isResting = false;
            restStartTime = null;
            poseStartTime = null;
        }
    } else {
        // logic for exercising
        let prob = 0;
        for (let i = 0; i < yogaMaxPredictions; i++) {
            if (prediction[i].className.toLowerCase().includes(currentTargetPose)) {
                prob = prediction[i].probability;
                break; 
            }
        }

        if (prob > 0.8) {
            if (poseStartTime === null) poseStartTime = Date.now();

            const elapsed = Date.now() - poseStartTime;
            const seconds = Math.floor(elapsed / 1000);

            instructionText.innerHTML = `<b style="color:blue;">運動中！第 ${completedReps + 1} 組</b><br>已維持 ${seconds} 秒 / 15 秒`;

            if (elapsed >= YOGA_TARGET_MS) {
                completedReps++;
                poseStartTime = null;

                if (completedReps >= YOGA_TOTAL_REPS) {
                    isYogaDetecting = false;
                    yogaWebcam.stop(); 
                    setTimeout(() => {
                        alert(`太強了！完成 3 組 15 秒 ${poseInfo.name}！獎勵遊戲時間！`);
                        document.getElementById("yoga-container").style.display = "none";
                        document.getElementById("game-container").style.display = "flex";
                    }, 100);
                } else {
                    isResting = true;
                    restStartTime = Date.now();
                }
            }
        } else {
            // pose not detected or confidence too low only in exercise mode
            if (poseStartTime !== null) {
                poseStartTime = null; 
                instructionText.innerHTML = `<span style="color:red;">姿勢跑掉啦，重新計時！</span><br>目前進度：${completedReps}/${YOGA_TOTAL_REPS} 組`;
            } else if (completedReps < YOGA_TOTAL_REPS) {
                instructionText.innerHTML = `請做出：<span style="color:#4CAF50;">${poseInfo.name}</span><br>目前進度：${completedReps}/${YOGA_TOTAL_REPS} 組`;
            }
        }
    }
}