const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

let score = 0;
let lives = 3;
let level = 1;

let bullets = [];
let enemies = [];
let meteors = [];
let stars = [];

const keys = {
    left: false,
    right: false,
    fire: false
};

let lastTime = 0;
let enemyTimer = 0;
let bulletTimer = 0;
let gameRunning = true;

const player = {
    x: W / 2,
    y: H - 70,
    width: 35,
    height: 45,
    speed: 7
};

for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    bullets = [];
    enemies = [];
    meteors = [];
    lastTime = 0;
    enemyTimer = 0;
    bulletTimer = 0;
    gameRunning = true;
    player.x = W / 2;
    player.y = H - 70;
    requestAnimationFrame(update);
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);

    ctx.fillStyle = "#4d9dff";
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(-20, 22);
    ctx.lineTo(0, 12);
    ctx.lineTo(20, 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#dff7ff";
    ctx.beginPath();
    ctx.arc(0, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff7a3d";
    ctx.fillRect(-7, 18, 5, 10);
    ctx.fillRect(2, 18, 5, 10);

    ctx.restore();
}

function drawStars(delta) {
    ctx.fillStyle = "white";

    for (const star of stars) {
        star.y += star.speed * delta;

        if (star.y > H) {
            star.y = 0;
            star.x = Math.random() * W;
        }

        ctx.globalAlpha = 0.5;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    ctx.globalAlpha = 1;
}

function shoot() {
    bullets.push({
        x: player.x,
        y: player.y - 25,
        width: 5,
        height: 14,
        speed: 10
    });
}

function drawBullets(delta) {
    ctx.fillStyle = "#65e8ff";

    for (const bullet of bullets) {
        bullet.y -= bullet.speed * delta;
        ctx.fillRect(bullet.x - 2, bullet.y, bullet.width, bullet.height);
    }

    bullets = bullets.filter((bullet) => bullet.y > -20);
}

function spawnEnemy() {
    enemies.push({
        x: 25 + Math.random() * (W - 50),
        y: -40,
        width: 42,
        height: 35,
        speed: 2 + Math.random() * 2 + level * 0.25
    });
}

function drawEnemies(delta) {
    for (const enemy of enemies) {
        enemy.y += enemy.speed * delta;

        ctx.fillStyle = "#d94b63";
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + 20);
        ctx.lineTo(enemy.x - 22, enemy.y - 15);
        ctx.lineTo(enemy.x, enemy.y - 7);
        ctx.lineTo(enemy.x + 22, enemy.y - 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffd34d";
        ctx.fillRect(enemy.x - 5, enemy.y - 2, 10, 5);
    }
}

function spawnMeteor() {
    meteors.push({
        x: 20 + Math.random() * (W - 40),
        y: -40,
        radius: 12 + Math.random() * 14,
        speed: 2 + Math.random() * 2
    });
}

function drawMeteors(delta) {
    for (const meteor of meteors) {
        meteor.y += meteor.speed * delta;

        ctx.fillStyle = "#7d8798";
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function gameOver() {
    gameRunning = false;

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", W / 2, H / 2 - 30);

    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, W / 2, H / 2 + 10);
    ctx.fillText("Press R to play again", W / 2, H / 2 + 50);
}

function updateHud() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("level").textContent = level;
}

function hitPlayer() {
    lives--;
    updateHud();

    if (lives <= 0) {
        gameOver();
        return true;
    }

    return false;
}

function update(time) {
    if (!gameRunning) {
        return;
    }

    if (!lastTime) {
        lastTime = time;
    }

    const frameMs = Math.min(32, time - lastTime);
    const delta = frameMs / 16;
    lastTime = time;

    level = 1 + Math.floor(score / 500);
    updateHud();

    if (keys.left) {
        player.x -= player.speed * delta;
    }

    if (keys.right) {
        player.x += player.speed * delta;
    }

    player.x = Math.max(25, Math.min(W - 25, player.x));

    bulletTimer += frameMs;

    if (keys.fire && bulletTimer > 180) {
        bulletTimer = 0;
        shoot();
    }

    enemyTimer += frameMs;

    const spawnRate = Math.max(300, 850 - level * 45);

    if (enemyTimer > spawnRate) {
        enemyTimer = 0;
        spawnEnemy();

        if (Math.random() < 0.35) {
            spawnMeteor();
        }
    }

    ctx.fillStyle = "#050817";
    ctx.fillRect(0, 0, W, H);

    drawStars(delta);
    drawBullets(delta);
    drawEnemies(delta);
    drawMeteors(delta);
    drawPlayer();

    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            const b = bullets[i];
            const e = enemies[j];

            if (Math.abs(b.x - e.x) < 25 && Math.abs(b.y - e.y) < 25) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 100;
                break;
            }
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = meteors.length - 1; j >= 0; j--) {
            const b = bullets[i];
            const m = meteors[j];
            const distance = Math.hypot(b.x - m.x, b.y - m.y);

            if (distance < m.radius + 8) {
                bullets.splice(i, 1);
                meteors.splice(j, 1);
                score += 50;
                break;
            }
        }
    }

    for (const enemy of enemies) {
        if (Math.abs(player.x - enemy.x) < 30 && Math.abs(player.y - enemy.y) < 35) {
            enemy.y = H + 100;
            if (hitPlayer()) {
                return;
            }
        }
    }

    for (const meteor of meteors) {
        const distance = Math.hypot(player.x - meteor.x, player.y - meteor.y);

        if (distance < meteor.radius + 18) {
            meteor.y = H + 100;
            if (hitPlayer()) {
                return;
            }
        }
    }

    enemies = enemies.filter((e) => e.y < H + 70);
    meteors = meteors.filter((m) => m.y < H + 70);

    requestAnimationFrame(update);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        keys.left = true;
    }

    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        keys.right = true;
    }

    if (event.code === "Space") {
        keys.fire = true;
        event.preventDefault();
    }

    if (!gameRunning && (event.key === "r" || event.key === "R")) {
        resetGame();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        keys.left = false;
    }

    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        keys.right = false;
    }

    if (event.code === "Space") {
        keys.fire = false;
    }
});

function holdButton(id, property) {
    const button = document.getElementById(id);

    button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        keys[property] = true;
    });

    button.addEventListener("pointerup", () => {
        keys[property] = false;
    });

    button.addEventListener("pointerleave", () => {
        keys[property] = false;
    });

    button.addEventListener("pointercancel", () => {
        keys[property] = false;
    });
}

holdButton("left", "left");
holdButton("right", "right");
holdButton("fire", "fire");

requestAnimationFrame(update);
