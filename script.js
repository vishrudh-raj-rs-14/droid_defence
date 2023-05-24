let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pause = document.querySelector(".pause");
let paused = false;
let ctx = canvas.getContext("2d");
let spreadBullets = false;
let shielded = false;
let shieldInterval;
let bouncy = false;
let bouncyinterval;
let shoot = new Audio("./assets/shoot.mp3");
let damageAudio = new Audio("./assets/hurt.mp3");
shoot.volume = 0.6;
let gamebg = new Audio("./assets/gamebg.mpeg");
gamebg.loop = true;
gamebg.volume = 0.5;
gamebg.autoplay = true;
let spreadInterval;
let maxFPS = 50;
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

function distanceBetween(x, y) {
  return Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2);
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

let wdown = false;
let adown = false;
let sdown = false;
let ddown = false;

window.addEventListener("keydown", (e) => {
  if (e.key == "a") {
    adown = true;
    dir.x = -1;
  }
  if (e.key == "w") {
    wdown = true;
    dir.y = -1;
  }
  if (e.key == "s") {
    sdown = true;
    dir.y = 1;
  }
  if (e.key == "d") {
    ddown = true;
    dir.x = 1;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key == "a") {
    adown = false;
    if (!ddown) {
      dir.x = 0;
    } else {
      dir.x = -dir.x;
    }
  }
  if (e.key == "w") {
    wdown = false;
    if (!sdown) {
      dir.y = 0;
    } else {
      dir.y = -dir.y;
    }
  }
  if (e.key == "s") {
    sdown = false;
    if (!wdown) {
      dir.y = 0;
    } else {
      dir.y = -dir.y;
    }
  }
  if (e.key == "d") {
    ddown = false;
    if (!adown) {
      dir.x = 0;
    } else {
      dir.x = -dir.x;
    }
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
    this.width = 9;
    this.height = 50;
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
    ctx.fillRect(0, -this.width, this.height, this.width * 2);
    if (spreadBullets) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = `#9AA3B5`;
      ctx.fillRect(0, -this.width, this.height, this.width * 2);
      ctx.rotate((-1 * Math.PI) / 3);
      ctx.fillStyle = `#9AA3B5`;
      ctx.fillRect(0, -this.width, this.height, this.width * 2);
    }
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
    if (!shielded) {
      damageAudio.play();
      this.health -= amt;
      healthBar.playerHealth -= amt;
      scoreBoard.val -= 5;
    }
  }
}

class PowerUp {
  constructor() {
    this.radius = 18;
    this.x = generateRandomNumbberBtw(
      this.radius + 1,
      canvas.width - this.radius + 1
    );
    this.y = generateRandomNumbberBtw(
      this.radius + 1,
      canvas.height / 2 - this.radius + 1
    );
    this.color;
    this.there = true;
    this.dx = generateRandomNumbberBtw(5, 8);
    this.dy = generateRandomNumbberBtw(5, 8);
    setTimeout(
      (() => {
        this.there = false;
      }).bind(this),
      10000
    );
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.x -= this.dx;
      this.dx = -1 * this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.y -= this.dy;
      this.dy = -1 * this.dy;
    }
    this.draw();
  }
}

class HeavyBullet extends PowerUp {
  constructor() {
    super();
    this.color = `#027FFF`;
  }
  ability() {
    if (spreadBullets) {
      clearInterval(spreadInterval);
    }
    spreadBullets = true;
    spreadInterval = setTimeout(() => {
      spreadBullets = false;
    }, 12000);
  }
}

class Shield extends PowerUp {
  constructor() {
    super();
    this.color = "#720e9e";
  }
  ability() {
    if (shielded) {
      clearInterval(shieldInterval);
    }
    shielded = true;
    shieldInterval = setTimeout(() => {
      shielded = false;
    }, 10000);
  }
}

class BouncyBullet extends PowerUp {
  constructor() {
    super();
    this.color = "#FFC72C";
  }
  ability() {
    if (bouncy) {
      clearInterval(bouncyinterval);
    }
    bouncy = true;
    bouncyinterval = setTimeout(() => {
      bouncy = false;
    }, 10000);
  }
}

let powerUps = [Shield, HeavyBullet, BouncyBullet];

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
      this.angle = Math.atan(
        Math.abs(
          (base.y + base.height / 2 - this.y) /
            (base.x + base.width / 2 - this.x)
        )
      );
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

class ShootingEnemy {
  constructor() {
    this.x = generateRandomNumbberBtw(0, canvas.width);
    this.y = -1 * generateRandomNumbberBtw(55, 75);
    this.speed = generateRandomNumbberBtw(2, 4);
    this.speed = 2;
    this.radius = 25;
    this.color = "#E54645";
    this.interval;
    this.health = 10;
    this.target = Math.floor(Math.random() * 2);
    this.angle = Math.atan(Math.abs((base.y - this.y) / (base.x - this.x)));
    this.posTo = [
      [50, generateRandomNumbberBtw(50, canvas.height / 2 - 10)],
      [canvas.width / 2, generateRandomNumbberBtw(0, 40)],
      [canvas.width - 50, generateRandomNumbberBtw(50, canvas.height / 2 - 10)],
      [canvas.width / 2, generateRandomNumbberBtw(0, 40)],
    ];
    this.cur = Math.floor(Math.random() * this.posTo.length);
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    let angle;
    let aim = this.target == 0 ? base : player;
    let y = aim.y - this.y;
    let x = aim.x - this.x;
    angle = Math.atan(Math.abs(y / x));
    if (x < 0 && y > 0) {
      angle = Math.PI - angle;
    } else if (x < 0 && y < 0) {
      angle = Math.PI + angle;
    } else if (x > 0 && y < 0) {
      angle = 2 * Math.PI - angle;
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
    this.angle = Math.atan(
      Math.abs(
        (this.posTo[this.cur][1] - this.y) / (this.posTo[this.cur][0] - this.x)
      )
    );
    this.dx =
      this.x <= this.posTo[this.cur][0]
        ? this.speed * Math.cos(this.angle)
        : -1 * this.speed * Math.cos(this.angle);
    this.dy =
      this.y <= this.posTo[this.cur][1]
        ? this.speed * Math.sin(this.angle)
        : -1 * this.speed * Math.sin(this.angle);
    if (
      Math.floor(distanceBetween([this.x, this.y], this.posTo[this.cur])) <= 5
    ) {
      this.cur = (this.cur + 1) % this.posTo.length;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  shoot() {
    if (!paused) {
      let angle;
      let aim = this.target == 0 ? base : player;
      let y;
      let x;
      if (this.target == 0) {
        y = aim.y + aim.height / 2 - this.y;
        x = aim.x + aim.width / 2 - this.x;
      } else {
        y = aim.y - this.y;
        x = aim.x - this.x;
      }
      angle = Math.atan(Math.abs(y / x));
      if (x < 0 && y > 0) {
        angle = Math.PI - angle;
      } else if (x < 0 && y < 0) {
        angle = Math.PI + angle;
      } else if (x > 0 && y < 0) {
        angle = 2 * Math.PI - angle;
      }
      let newBullet = new EnemyBullets(this.x, this.y, angle);
      enemyBullets.push(newBullet);
    }
    if (!checkGameOver()) {
      this.interval = setTimeout(
        this.shoot.bind(this),
        generateRandomNumbberBtw(2, 5) * 1000
      );
    }
  }
}

class Score {
  constructor() {
    this.val = 0;
    this.x = canvas.width - 180;
    this.highVal = !localStorage.getItem("highscore")
      ? 0
      : parseInt(localStorage.getItem("highscore"));
    this.y = 30;
  }
  write() {
    ctx.font = "25px Poppins";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.val}`, this.x, this.y);
    ctx.fillText(`High Score: ${this.highVal}`, this.x, this.y + 25);
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
    this.radius = 7;
    this.x = x + (player.radius + 20) * Math.cos(angle);
    this.y = y + (player.radius + 20) * Math.sin(angle);
    this.speed = 14;
    this.dx = this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
    this.color = "rgba(2,127,255,";

    // #027FFF
  }

  draw() {
    ctx.fillStyle = `${this.color}1)`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    ctx.fill();
    for (let i = 1; i < 10; i++) {
      ctx.fillStyle = `${this.color}${0.15})`;
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
    if (bouncy) {
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.x -= this.dx;
        this.dx = -1 * this.dx;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.y -= this.dy;
        this.dy = -1 * this.dy;
      }
    }
    this.draw();
  }
}

class EnemyBullets extends Bullet {
  constructor(x, y, angle = (-1 * Math.PI) / 2) {
    super(x, y, angle);
    this.color = "rgba(239,1,7,";
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
    if (shielded) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgb(255,255,255)";
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2),
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.closePath();
      ctx.moveTo(
        this.x + Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2),
        this.y
      );
      ctx.beginPath();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.restore();
    }
    ctx.fillStyle = `#FEBE10`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
  damage(amt) {
    if (!shielded) {
      damageAudio.play();
      this.health -= amt;
      healthBar.health -= amt;
      scoreBoard.val -= 10;
    }
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
    shoot.currentTime = 0;
    shoot.play();
    bullets.push(newBullet);

    if (spreadBullets) {
      let newBullet1 = new Bullet(player.x, player.y, angle + Math.PI / 6);
      let newBullet2 = new Bullet(player.x, player.y, angle - Math.PI / 6);
      bullets.push(newBullet1, newBullet2);
    }
  }
});

let base = new Base(canvas.width / 2, canvas.height - 100);
let player = new Player(50, canvas.height - 20);
let healthBar = new HealthBar();
let scoreBoard = new Score();
let bullets = [];
let enemyBullets = [];
let enemies = [];
let shootingEnemies = [];
let inPowerUps = [];

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
  } else {
    return;
  }
}

function spawnPowerUp() {
  if (!paused && inPowerUps.length <= 3) {
    let power = new powerUps[generateRandomNumbberBtw(0, powerUps.length)]();
    console.log(power);
    power.draw();
    inPowerUps.push(power);
  }
  if (!checkGameOver()) {
    setTimeout(
      () => requestAnimationFrame(spawnPowerUp),
      generateRandomNumbberBtw(8, 15) * 1000
    );
  }
}

function spawnShootingEnemies() {
  if (!paused && shootingEnemies.length <= 2) {
    let enemy = new ShootingEnemy();
    let inteval = setTimeout(
      enemy.shoot.bind(enemy),
      generateRandomNumbberBtw(3, 5) * 1000
    );
    enemy.interval = inteval;
    enemy.draw();
    shootingEnemies.push(enemy);
  }
  if (!checkGameOver()) {
    setTimeout(
      () => requestAnimationFrame(spawnShootingEnemies),
      generateRandomNumbberBtw(4, 12) * 1000
    );
  }
}

pause.addEventListener("click", () => {
  if (pause.dataset.state == 0) {
    pause.dataset.state = 1;
    gamebg.pause();
    pause.innerHTML = `<img src="./assets/play.png" />`;
  } else {
    pause.dataset.state = 0;
    gamebg.play();
    pause.innerHTML = `<img src="./assets/pause.png" />`;
  }
  paused = !paused;
});

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState != "visible") {
    pause.dataset.state = 1;
    pause.innerHTML = `<img src="./assets/play.png" />`;
    gamebg.pause();
    paused = true;
  }
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
  enemyBullets = [];
  shootingEnemies.forEach((ele) => {
    clearInterval(ele.interval);
  });
  shootingEnemies = [];
  enemies = [];
  gameLoop();
  spawnEnemies();
  spawnShootingEnemies();
  setTimeout(
    () => requestAnimationFrame(spawnPowerUp),
    generateRandomNumbberBtw(8, 15) * 1000
  );
}

function gameLoop() {
  if (!paused) {
    // ctx.fillStyle = `rgba(0,0,0,0.4)`;
    // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let offscreen = [];
    let offscreenE = [];
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
    inPowerUps.forEach((ele) => {
      ele.update();
    });
    for (let i = 0; i < inPowerUps.length; i++) {
      if (!inPowerUps[i].there) {
        delete inPowerUps[i];
      }
    }
    enemyBullets.forEach((ele, index) => {
      ele.update();
      if (
        ele.x < 0 ||
        ele.x > canvas.width ||
        ele.y < 0 ||
        ele.y > canvas.height
      ) {
        offscreenE.push(index);
      }
    });

    offscreen.sort();
    offscreenE.sort();

    for (let i = offscreen.length - 1; i >= 0; i--) {
      bullets.splice(offscreen[i], 1);
    }
    for (let i = offscreenE.length - 1; i >= 0; i--) {
      enemyBullets.splice(offscreenE[i], 1);
    }
    enemies.forEach((ele) => {
      ele.update();
    });
    shootingEnemies.forEach((ele) => {
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
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < shootingEnemies.length; j++) {
        if (
          bullets[i] &&
          shootingEnemies[j] &&
          circleCollision(bullets[i], shootingEnemies[j])
        ) {
          scoreBoard.val += 5;
          removeFromCanvas(bullets[i]);
          removeFromCanvas(shootingEnemies[j]);
          delete bullets[i];
          shootingEnemies[j].health -= 5;
          if (shootingEnemies[j].health <= 0) {
            clearInterval(shootingEnemies[j].interval);
            delete shootingEnemies[j];
          }
        }
      }
    }
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemyBullets.length; j++) {
        if (
          bullets[i] &&
          enemyBullets[j] &&
          circleCollision(bullets[i], enemyBullets[j])
        ) {
          removeFromCanvas(bullets[i]);
          removeFromCanvas(enemyBullets[j]);
          delete bullets[i];
          delete enemyBullets[j];
        }
      }
    }

    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < inPowerUps.length; j++) {
        if (
          bullets[i] &&
          inPowerUps[j] &&
          circleCollision(bullets[i], inPowerUps[j])
        ) {
          inPowerUps[j].ability();
          removeFromCanvas(bullets[i]);
          removeFromCanvas(inPowerUps[j]);
          delete bullets[i];
          delete inPowerUps[j];
        }
      }
    }
    for (let j = 0; j < inPowerUps.length; j++) {
      if (inPowerUps[j] && circleCollision(player, inPowerUps[j])) {
        inPowerUps[j].ability();
        removeFromCanvas(inPowerUps[j]);
        delete inPowerUps[j];
      }
    }

    for (let i = 0; i < enemyBullets.length; i++) {
      if (enemyBullets[i] && circleRectCollision(enemyBullets[i], base)) {
        base.damage(5);
        removeFromCanvas(enemyBullets[i]);
        delete enemyBullets[i];
      }
    }

    for (let i = 0; i < enemyBullets.length; i++) {
      if (enemyBullets[i] && circleCollision(enemyBullets[i], player)) {
        player.damagePlayer(5);
        removeFromCanvas(enemyBullets[i]);
        delete enemyBullets[i];
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

    for (let i = bullets.length - 1; i >= 0; i--) {
      if (!bullets[i]) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (!enemies[i]) {
        enemies.splice(i, 1);
      }
    }
    for (let i = shootingEnemies.length - 1; i >= 0; i--) {
      if (!shootingEnemies[i]) {
        shootingEnemies.splice(i, 1);
      }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      if (!enemyBullets[i]) {
        enemyBullets.splice(i, 1);
      }
    }
    for (let i = inPowerUps.length - 1; i >= 0; i--) {
      if (!inPowerUps[i]) {
        inPowerUps.splice(i, 1);
      }
    }

    healthBar.draw();
    scoreBoard.write();
  }
  // if()
  if (!checkGameOver()) {
    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / maxFPS);
  } else {
    // !localStorage.getItem("highscore")
    //   ? 0
    //   : parseInt(localStorage.getItem("highscore"));
    if (scoreBoard.val > scoreBoard.highVal) {
      scoreBoard.highVal = scoreBoard.val;
      localStorage.setItem("highscore", scoreBoard.val);
    }
    setTimeout(reset, 1000);
  }
  //   requestAnimationFrame(gameLoop);
}

spawnEnemies();
spawnShootingEnemies();
setTimeout(
  () => requestAnimationFrame(spawnPowerUp),
  generateRandomNumbberBtw(8, 15) * 1000
);
gameLoop();
