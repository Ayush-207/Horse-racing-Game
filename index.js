let canvas = document.getElementById('horseRaceCanvas');
let ctx = canvas.getContext('2d');
let CANVAS_WIDTH = canvas.width;
let CANVAS_HEIGHT = canvas.height;
let llimit = CANVAS_WIDTH / 2 - 150;
let ulimit = CANVAS_WIDTH / 2 + 80;

let val = 0;
let horses = [];
const horseCount = 6;
let winnerHorse = 1;
const spriteWidth = 300;
const spriteHeight = 215;
const raceDuration = 30;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrame = 7;
const delta = 110;
let horse1 = new Image();
let horse2 = new Image();
let horse3 = new Image();
let horse4 = new Image();
let horse5 = new Image();
let horse6 = new Image();
let horseImages = [horse1, horse2, horse3, horse4, horse5, horse6];
let gameEnd = false;
let startTime, currentTime;
const trackSpeed = -8;
let fps;

const mark1 = (4 / 30) * raceDuration;
const mark2 = (24 / 30) * raceDuration;
const mark3 = (29 / 30) * raceDuration;

let bgImage = new Image();
let bgFront = new Image();
let bgFront1 = new Image();
let img = new Image();
let progresBox = new Image();
let nums = new Image();
let leaderboard = new Image();

var bg1 = {
    width: 850,
    height: 380,
    x: 0,
    y: 40
}

var bg2 = {
    width: 850,
    height: 380,
    x: 850,
    y: 40
}

var vg1 = {
    width: 850,
    height: 380,
    x: -300,
    y: 0
}

var vg2 = {
    width: 850,
    height: 380,
    x: 550,
    y: 0
}

// loading images 

horse1.src = 'assets/horse1.png';
horse2.src = 'assets/horse2.png';
horse3.src = 'assets/horse3.png';
horse4.src = 'assets/horse4.png';
horse5.src = 'assets/horse5.png';
horse6.src = 'assets/horse6.png';
bgImage.src = 'assets/sky4.jpg';
bgFront.src = 'assets/bgfront2.png';
bgFront1.src = 'assets/bgfront3.png';
img.src = 'assets/bgfront4.png'
progresBox.src = 'assets/progressBox.png';
nums.src = 'assets/nums.png';
leaderboard.src = 'assets/leaderboard.png';

function drawHorse(x, y, id) {
    const elapsedTime = currentTime - startTime;
    const position1 = (Math.floor(elapsedTime / delta) + id * 10) % 3;
    const position2 = Math.floor(elapsedTime / delta) % 4;
    frameX = position1 * spriteWidth;
    frameY = position2 * spriteHeight;
    ctx.drawImage(horseImages[id - 1], frameX, frameY, spriteWidth, spriteHeight + 20, x, y, 250, 200);
}

function resetGame() {
    winnerHorse = document.getElementById('winner').value;
    canvas = document.getElementById('horseRaceCanvas');
    ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
    llimit = CANVAS_WIDTH / 2 - 150;
    ulimit = CANVAS_WIDTH / 2 + 80;
    gameFrame = 0;
    startTime = new Date();
    gameEnd = false;
    horses.length = 0;
    for (let i = 0; i < horseCount; i++) {
        horses.push({
            id: i + 1,
            x: -80,
            y: 130 + i * 40,
            speed: Math.random() * 2,
        })
    }
}

function part1() {
    for (let i = 0; i < horseCount; i++) {
        if (i == 1 && Math.random() < 0.2) horses[i].speed = Math.random();
        else if (i == 2 && Math.random() < 0.6) horses[i].speed = Math.random();
        else if (Math.random() < 0.8) horses[i].speed = Math.random();
    }
}

function part2() {
    const incLen = Math.floor(Math.random() * 3);
    const inc = [];
    for (let i = 0; i < incLen; i++) {
        inc.push(Math.floor(Math.random() * horseCount));
    }
    for (let i = 0; i < horseCount; i++) {
        if (horses[i].x > llimit && horses[i].x < ulimit) {
            if (i in inc) {
                horses[i].speed = Math.random() * Math.random();
            }
            else if (Math.random() < 0.5) {
                if (Math.random() < 0.5) horses[i].speed = -1.5 * Math.random();
                else if (Math.random() < 0.3) horses[i].speed = -1 * Math.random();
                else horses[i].speed = 0;
            }
        }
        else if (horses[i].x > ulimit) {
            if (Math.random() < 0.5)
                horses[i].speed = -1 * Math.random();
            else horses[i].speed = -0.5 * Math.random();
        }
        else if (horses[i].x < llimit) {
            if (Math.random() < 0.5)
                horses[i].speed = 1.3 * Math.random();
            else horses[i].speed = 0;
        }
        horses[i].x += horses[i].speed;
    }
}

function part3() {
    for (let i = 0; i < horseCount; i++) {
        if (winnerHorse == horses[i].id) {
            if (i != 0) {
                const elapsedTime = (currentTime - startTime) / 1000;
                const remainingTime = mark3 - elapsedTime;
                const reqDist = (horses[0].x - horses[i].x);
                const speed = reqDist / (remainingTime * (fps - 5));
                horses[i].speed = Math.max(speed + 1, 0);
                console.log([reqDist, remainingTime, speed]);
            }
            else {
                horses[i].speed = (horses[0].x - horses[1].x) < 30 ? (horses[0].x - horses[1].x) / (fps) : 0;
            }
        }
        else horses[i].speed = 0;
    }
}

function part4() {
    let speed = (550 - horses[0].x) > 0 ? (550 - horses[0].x) / (fps - 5) : 0;
    horses[0].x += speed;
}

function updateDistances() {
    for (let i = 0; i < horseCount; i++) {
        const elapsedTime = currentTime - startTime;
        if (horses[i].x < ulimit || (elapsedTime > mark3 && horses[i].id == winnerHorse && horses[i].x < 550))
            horses[i].x += horses[i].speed;
    }
}

function updateBackground() {
    vg1.x += trackSpeed / 2.3;
    vg2.x += trackSpeed / 2.3;

    if (vg1.x + vg1.width <= 0) {
        vg1.x = vg2.x + vg2.width;
    }
    if (vg2.x + vg2.width <= 0) {
        vg2.x = vg1.x + vg1.width;
    }

    bg1.x += trackSpeed;
    bg2.x += trackSpeed;

    if (bg1.x + bg1.width <= 0) {
        bg1.x = bg2.x + bg2.width;
    }
    if (bg2.x + bg2.width <= 0) {
        bg2.x = bg1.x + bg1.width;
    }

    ctx.drawImage(bgImage, 0, CANVAS_HEIGHT * (5 / 6), 3000, 2000, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * (5 / 6));
    ctx.drawImage(bgFront1, vg1.x, vg1.y, CANVAS_WIDTH, (500 / 480) * CANVAS_HEIGHT);
    ctx.drawImage(bgFront1, vg2.x, vg2.y, CANVAS_WIDTH, (500 / 480) * CANVAS_HEIGHT);
    if (!gameEnd) {
        ctx.drawImage(bgFront, bg1.x, bg1.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
        ctx.drawImage(bgFront, bg2.x, bg2.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
    }
    else {
        if (bg1.x >= 0 && val == 0) val = 1;
        else if (bg2.x >= 0 && val == 0) val = 2;
        if (val == 1 && bg1.x > 100) {
            ctx.drawImage(bgFront, bg2.x, bg2.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
            ctx.drawImage(img, bg1.x, bg1.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
        }
        else if (val == 2 && bg2.x > 100) {
            ctx.drawImage(bgFront, bg1.x, bg1.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
            ctx.drawImage(img, bg2.x, bg2.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
        }
        else {
            ctx.drawImage(img, bg1.x, bg1.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
            ctx.drawImage(img, bg2.x, bg2.y, CANVAS_WIDTH, CANVAS_HEIGHT * (5.5 / 6));
        }
    }

    const x = 0;
    const y = 0;
    const w = 850;
    const h = 10;
    const r = 0;

    const elapsedTime = (currentTime - startTime) / 1000;
    const progress = Math.min((elapsedTime / raceDuration), 1);
    ctx.beginPath();
    if (progress != 1)
        ctx.roundRect(x, y, w * progress, h);
    else ctx.roundRect(x, y, w, h);
    ctx.closePath();
    ctx.fillStyle = "brown";
    ctx.fill();

    ctx.drawImage(leaderboard, 730, 20, 110, 180);
    for (let i = 0; i < horseCount; i++) {
        ctx.font = "10px Comic Sans MS";
        ctx.fillStyle = "#000";
        const name = `Player ${horses[i].id}`;
        ctx.strokeText(name, 750, 40 + 28 * i);
    }
}

function update() {
    currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;
    if (elapsedTime > 1 && elapsedTime < 1.1) {
        fps = gameFrame / elapsedTime;
        // console.log(fps);
    }
    horses.sort((a, b) => b.x - a.x);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    updateBackground();

    if (elapsedTime < mark1) {
        if (gameFrame % 60 == 0) part1();
        else updateDistances();
    }
    else if (elapsedTime < mark2) {
        if (gameFrame % 100 == 0) part2();
        else updateDistances();
    }
    else if (elapsedTime < mark3) {
        if (gameFrame % 20 == 0) part3();
        else updateDistances();
    }
    else if (elapsedTime < raceDuration) part4();
    else {
        gameEnd = true;
        if (val == 1 && horses[0].x > bg1.x + 550) {
            window.alert(`The winner of the horse race is ${horses[0].id}`);
            return;
        }
        else if (val == 2 && horses[0].x > bg2.x + 550) {
            window.alert(`The winner of the horse race is ${horses[0].id}`);
            return;
        }
    }
    horses.sort(function (a, b) { return a.id - b.id });
    for (let i = 0; i < horseCount; i++) {
        drawHorse(horses[i].x, horses[i].y, horses[i].id);
    }

    gameFrame++;
    window.requestAnimationFrame(update);
}

function startGame() {
    resetGame();
    update();
}
