const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Auto-size canvas
function resizeCanvas() {
    canvas.width = document.getElementById("gameContainer").clientWidth;
    canvas.height = document.getElementById("gameContainer").clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Rocket Properties
const rocket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 70,
    speed: 6
};

// Obstacles (Asteroids)
let asteroids = [];
let asteroidSpeed = 3;
let score = 0;
let gameOver = false;

// Load Images
const rocketImg = new Image();
rocketImg.src = "assets/rocket.png";  // Ensure this matches your uploaded path

const asteroidImg = new Image();
asteroidImg.src = "assets/asteroid.png";  // Ensure this matches your uploaded path

// Controls (Touch & Buttons)
let moveLeft = false, moveRight = false;
document.getElementById("leftBtn").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("leftBtn").addEventListener("touchend", () => moveLeft = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => moveRight = true);
document.getElementById("rightBtn").addEventListener("touchend", () => moveRight = false);

// Keyboard Controls (For Desktop)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

// Update Rocket Position
function updateRocket() {
    if (moveLeft && rocket.x > 0) rocket.x -= rocket.speed;
    if (moveRight && rocket.x + rocket.width < canvas.width) rocket.x += rocket.speed;
}

// Generate Asteroids
function spawnAsteroid() {
    asteroids.push({
        x: Math.random() * (canvas.width - 50),
        y: -60,
        width: 50,
        height: 50,
        speed: asteroidSpeed
    });
}

// Update Asteroids
function updateAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y += asteroids[i].speed;

        // Collision Detection
        if (isColliding(rocket, asteroids[i])) {
            gameOver = true;
        }

        // Remove Off-Screen Asteroids
        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
            score++;
        }
    }
}

// Check Collision
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Draw Rocket
function drawRocket() {
    ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Draw Asteroids
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });
}

// Draw Score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
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
    updateAsteroids();
    drawRocket();
    drawAsteroids();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Spawn Asteroids Every 1.5 Seconds
setInterval(spawnAsteroid, 1500);

// Increase Speed Every 10 Seconds
setInterval(() => { asteroidSpeed += 1; }, 10000);

// Start Game
gameLoop();
