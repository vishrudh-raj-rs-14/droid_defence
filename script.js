let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pause = document.querySelector(".pause");
let paused = false;
let ctx = canvas.getContext("2d");
let maxFPS = 60;
let mouse = {
  x: undefined,
  y: undefined,
};

let dir = {
  x: 0,
  y: 0,
};

function generateRandomNumbberBtw(x, y) {
  return Math.floor(Math.random() * (y - x) + x);
}

function rectangleCollision(a, b) {
  if (
    a.x + a.width > b.x &&
    a.x < b.x + b.width &&
    a.y + a.height > b.y &&
    a.y < b.y + b.height
  ) {
    return true;
  } else {
    return false;
  }
}

function circleCollision(a, b) {
  if (Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) < a.radius + b.radius) {
    return true;
  }
  return false;
}

function circleRectCollision(cir, rect) {
  if (
    cir.x + cir.radius > rect.x &&
    cir.x - cir.radius < rect.x + rect.width &&
    cir.y + cir.radius > rect.y &&
    cir.y - cir.radius < rect.y + rect.height
  ) {
    return true;
  } else {
    return false;
  }
}

function removeFromCanvas(a) {
  ctx.clearRect(a.x, a.y, a.width, a.height);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("keydown", (e) => {
  if (e.key == "a") {
    dir.x = -1;
  }
  if (e.key == "w") {
    dir.y = -1;
  }
  if (e.key == "s") {
    dir.y = 1;
  }
  if (e.key == "d") {
    dir.x = 1;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key == "a") {
    dir.x = 0;
  }
  if (e.key == "w") {
    dir.y = 0;
  }
  if (e.key == "s") {
    dir.y = 0;
  }
  if (e.key == "d") {
    dir.x = 0;
  }
});

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.color = "#007FFF";
    this.speed = 5;
    this.health = 100;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let angle;
    if (mouse.x && mouse.y) {
      let y = mouse.y - this.y;
      let x = mouse.x - this.x;
      angle = Math.atan(Math.abs(y / x));
      if (x < 0 && y > 0) {
        angle = Math.PI - angle;
      } else if (x < 0 && y < 0) {
        angle = Math.PI + angle;
      } else if (x > 0 && y < 0) {
        angle = 2 * Math.PI - angle;
      }
    }
    ctx.rotate(angle);
    ctx.fillStyle = `#9AA3B5`;
    ctx.fillRect(0, -10, 50, 20);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  update() {
    this.x += dir.x * this.speed;
    if (
      this.x + dir.x * (this.speed + this.radius) > canvas.width ||
      this.x + dir.x * (this.speed + this.radius) < 0 ||
      this.y + dir.y * (this.speed + this.radius) > canvas.height ||
      this.y + dir.y * (this.speed + this.radius) < 0 ||
      (this.x + 1 * this.radius > base.x &&
        this.x + -1 * this.radius < base.x + base.width &&
        this.y + 1 * this.radius > base.y &&
        this.y + -1 * this.radius < base.y + base.height)
    ) {
      this.x -= dir.x * this.speed;
    }
    this.y += dir.y * this.speed;
    if (
      this.x + dir.x * (this.speed + this.radius) > canvas.width ||
      this.x + dir.x * (this.speed + this.radius) < 0 ||
      this.y + dir.y * (this.speed + this.radius) > canvas.height ||
      this.y + dir.y * (this.speed + this.radius) < 0 ||
      (this.x + 1 * this.radius > base.x &&
        this.x + -1 * this.radius < base.x + base.width &&
        this.y + 1 * this.radius > base.y &&
        this.y + -1 * this.radius < base.y + base.height)
    ) {
      this.y -= dir.y * this.speed;
    }

    this.draw();
  }

  damagePlayer(amt) {
    this.health -= amt;
    healthBar.playerHealth -= amt;
    scoreBoard.val -= 5;
  }
}

class Enemy {
  constructor() {
    this.x = generateRandomNumbberBtw(0, canvas.width);
    this.y = -1 * generateRandomNumbberBtw(3, 9);
    this.speed = generateRandomNumbberBtw(2, 4);
    this.speed = 2;
    this.width = 20;
    this.height = 20;
    this.target = Math.floor(Math.random() * 2);
  }
  draw() {
    ctx.fillStyle = "#662d91";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    if (this.target == 0) {
      this.angle = Math.atan(Math.abs((base.y - this.y) / (base.x - this.x)));
      this.dx =
        this.x <= canvas.width / 2
          ? this.speed * Math.cos(this.angle)
          : -1 * this.speed * Math.cos(this.angle);
      this.dy = this.speed * Math.sin(this.angle);
    } else {
      this.angle = Math.atan(
        Math.abs((player.y - this.y) / (player.x - this.x))
      );
      this.dx =
        this.x <= player.x
          ? this.speed * Math.cos(this.angle)
          : -1 * this.speed * Math.cos(this.angle);
      this.dy =
        this.y <= player.y
          ? this.speed * Math.sin(this.angle)
          : -1 * this.speed * Math.sin(this.angle);
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

// class ShootingEnemy {
//   constructor() {
//     this.x = generateRandomNumbberBtw(0, canvas.width);
//     this.y = -1 * generateRandomNumbberBtw(3, 9);
//     this.speed = generateRandomNumbberBtw(2, 4);
//     this.speed = 2;
//     this.radius = 25;
//     this.angle = Math.atan(Math.abs((base.y - this.y) / (base.x - this.x)));
//     this.dx =
//       this.x <= canvas.width / 2
//         ? this.speed * Math.cos(this.angle)
//         : -1 * this.speed * Math.cos(this.angle);
//     this.dy = this.speed * Math.sin(this.angle);
//   }
//   draw() {
//     ctx.fillStyle = "#662d91";
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//   }
//   update() {
//     this.x += this.dx;
//     this.y += this.dy;
//     this.draw();
//   }
// }

class Score {
  constructor() {
    this.val = 0;
    this.x = canvas.width - 150;
    this.y = 30;
  }
  write() {
    ctx.font = "25px Poppins";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.val}`, this.x, this.y);
  }
  resize() {
    this.x = canvas.width - 150;
    this.y = 30;
  }
}

class HealthBar {
  constructor() {
    this.health = 100;
    this.width = 400;
    this.height = 35;
    this.playerHealth = 100;
    this.x = 25;
    this.y = 25;
  }

  draw() {
    ctx.fillStyle = `#F9E5E3`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = `#27A313`;
    ctx.fillRect(this.x, this.y, (this.health / 100) * this.width, this.height);
    ctx.fillStyle = `#F9E5E3`;
    ctx.fillRect(this.x, this.y + this.height + 25, this.width, this.height);
    ctx.fillStyle = `#007FFF`;
    ctx.fillRect(
      this.x,
      this.y + this.height + 25,
      (this.playerHealth / 100) * this.width,
      this.height
    );
  }
  resize() {
    this.x = 25;
    this.y = 25;
  }
}

class Bullet {
  constructor(x, y, angle = (-1 * Math.PI) / 2) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 10;
    this.dx = this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
  }

  draw() {
    ctx.fillStyle = "rgba(239,1,7,1)";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    ctx.fill();
    for (let i = 1; i < 10; i++) {
      ctx.fillStyle = `rgba(239,1,7,${0.15})`;
      console.log(ctx.fillStyle);
      ctx.moveTo(this.x - i * 0.2 * this.dx, this.y - i * 0.2 * this.dy);
      ctx.arc(
        this.x - i * 0.2 * this.dx,
        this.y - i * 0.2 * this.dy,
        this.radius,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
  }

  update() {
    this.y += this.dy;
    this.x += this.dx;
    this.draw();
  }
}

class Base {
  constructor(x, y) {
    this.health = 100;
    this.width = 100;
    this.height = 100;
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
  }
  draw() {
    ctx.fillStyle = `#FEBE10`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
  damage(amt) {
    this.health -= amt;
    healthBar.health -= amt;
    scoreBoard.val -= 10;
  }
  resize() {
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height / 2 - 100;
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.draw();
  scoreBoard.resize();
  healthBar.resize();
  base.resize();
  scoreBoard.write();
  healthBar.draw();
  base.draw();
  bullets.forEach((ele) => {
    ele.draw();
  });
  enemies.forEach((ele) => {
    ele.draw();
  });
});

window.addEventListener("click", (e) => {
  if (!paused) {
    let angle;
    let y = e.clientY - player.y;
    let x = e.clientX - player.x;
    angle = Math.atan(Math.abs(y / x));
    if (x < 0 && y > 0) {
      angle = Math.PI - angle;
    } else if (x < 0 && y < 0) {
      angle = Math.PI + angle;
    } else if (x > 0 && y < 0) {
      angle = 2 * Math.PI - angle;
    }
    let newBullet = new Bullet(player.x, player.y, angle);
    bullets.push(newBullet);
  }
});

let base = new Base(canvas.width / 2, canvas.height - 100);
let player = new Player(50, canvas.height - 20);
let healthBar = new HealthBar();
let scoreBoard = new Score();
let bullets = [];
let enemies = [];

function spawnEnemies() {
  if (!paused) {
    let enemy = new Enemy();
    enemy.draw();
    enemies.push(enemy);
  }
  if (!checkGameOver()) {
    setTimeout(
      () => requestAnimationFrame(spawnEnemies),
      generateRandomNumbberBtw(30, 50) * 100
    );
  }
}

pause.addEventListener("click", () => {
  if (pause.dataset.state == 0) {
    pause.dataset.state = 1;
    pause.innerHTML = `<img src="./assets/play.png" />`;
  } else {
    pause.dataset.state = 0;
    pause.innerHTML = `<img src="./assets/pause.png" />`;
  }
  paused = !paused;
});

function checkGameOver() {
  if (base.health <= 0) {
    return true;
  }
  if (player.health <= 0) {
    return true;
  }
  return false;
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  base = new Base(canvas.width / 2, canvas.height - 100);
  player = new Player(50, canvas.height - 60);
  healthBar = new HealthBar();
  scoreBoard = new Score();
  bullets = [];
  enemies = [];
  gameLoop();
}

spawnEnemies();

function gameLoop() {
  if (!paused) {
    // ctx.fillStyle = `rgba(0,0,0,0.4)`;
    // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let offscreen = [];
    bullets.forEach((ele, index) => {
      ele.update();
      if (
        ele.x < 0 ||
        ele.x > canvas.width ||
        ele.y < 0 ||
        ele.y > canvas.height
      ) {
        offscreen.push(index);
      }
    });

    for (let i = offscreen.length - 1; i >= 0; i--) {
      bullets.splice(i, 1);
    }
    enemies.forEach((ele) => {
      ele.update();
    });
    base.update();
    player.update();
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (
          bullets[i] &&
          enemies[j] &&
          circleRectCollision(bullets[i], enemies[j])
        ) {
          scoreBoard.val += 10;
          removeFromCanvas(bullets[i]);
          removeFromCanvas(enemies[j]);
          delete bullets[i];
          delete enemies[j];
        }
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i] && rectangleCollision(enemies[i], base)) {
        base.damage(5);
        removeFromCanvas(enemies[i]);
        delete enemies[i];
      }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i] && circleRectCollision(player, enemies[i])) {
        player.damagePlayer(10);
        removeFromCanvas(enemies[i]);
        delete enemies[i];
      }
    }

    bullets.filter((ele) => ele);
    enemies.filter((ele) => ele);
    healthBar.draw();
    scoreBoard.write();
  }
  // if()
  if (!checkGameOver()) {
    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / maxFPS);
  } else {
    setTimeout(reset, 1000);
  }
  //   requestAnimationFrame(gameLoop);
}

gameLoop();
