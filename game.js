const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Constants
const rocketSpeed = 3;
const enemySpeed = 2;
const starCount = 5;
const enemyCount = 3;

// Load Images
const rocketImg = new Image();
rocketImg.src = "https://upload.wikimedia.org/wikipedia/commons/3/3d/Rocket-icon.svg";

const asteroidImg = new Image();
asteroidImg.src = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Asteroid_icon.svg";

const alienImg = new Image();
alienImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/4f/Alien_Emoji.png";

// Player Rocket
let rocket = { x: 50, y: 50, width: 40, height: 40 };

// Enemies (Asteroids and Aliens)
let enemies = [];
for (let i = 0; i < enemyCount; i++) {
    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 40,
        height: 40,
        type: Math.random() > 0.5 ? "asteroid" : "alien",
        dx: (Math.random() > 0.5 ? 1 : -1) * enemySpeed,
        dy: (Math.random() > 0.5 ? 1 : -1) * enemySpeed
    });
}

// Stars for collection
let stars = [];
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        width: 20,
        height: 20
    });
}

// Game State
let score = 0;
let gameOver = false;

// Keyboard Controls
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Update Rocket Position
function updateRocket() {
    if (keys["ArrowUp"] && rocket.y > 0) rocket.y -= rocketSpeed;
    if (keys["ArrowDown"] && rocket.y + rocket.height < canvas.height) rocket.y += rocketSpeed;
    if (keys["ArrowLeft"] && rocket.x > 0) rocket.x -= rocketSpeed;
    if (keys["ArrowRight"] && rocket.x + rocket.width < canvas.width) rocket.x += rocketSpeed;
}

// Update Enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        // Bounce off walls
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) enemy.dx *= -1;
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) enemy.dy *= -1;

        // Check collision with player
        if (isColliding(rocket, enemy)) {
            gameOver = true;
        }
    });
}

// Check Collision
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Collect Stars
function collectStars() {
    for (let i = 0; i < stars.length; i++) {
        if (isColliding(rocket, stars[i])) {
            score++;
            stars.splice(i, 1);
            break;
        }
    }
}

// Draw Rocket
function drawRocket() {
    ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Draw Enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        let img = enemy.type === "asteroid" ? asteroidImg : alienImg;
        ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Draw Stars
function drawStars() {
    ctx.fillStyle = "yellow";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x + 10, star.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw Score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Game Loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateRocket();
    updateEnemies();
    collectStars();
    drawStars();
    drawRocket();
    drawEnemies();
    drawScore();
    requestAnimationFrame(gameLoop);
}

// Start Game
gameLoop();
