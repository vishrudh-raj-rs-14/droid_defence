let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pause = document.querySelector(".pause");
let paused = false;
let crosshair = new Image();
crosshair.src = "./assets/crosshair.png";
let ctx = canvas.getContext("2d");
let spreadBullets = false;
let shielded = false;
let spawnRate = 1;
let decrementter = 0;
let commet = new Image();
commet.src = "./assets/commet.png";
let bg1 = new Image();
bg1.src = "./assets/bg5.jpg";
let gradient = new Image();
gradient.src = "./assets/gradient.png";
let bgAspectRatio;
let shieldInterval;
let speedincrementer = 0;
let start;
let bouncy = false;
let bouncyinterval;
let shoot = new Audio("./assets/shoot.mp3");
let powerAudio = new Audio("./assets/power.mp3");
let explosionSprite = new Image();
explosionSprite.src = "./assets/explosion.png";
let damageAudio = new Audio("./assets/hurt.mp3");
let img = document.querySelector(".bg");
let playerImg = new Image();
playerImg.src = "./assets/ship2.png";
let enemyShipImg = new Image();
enemyShipImg.src = "./assets/enemyShip.png";
let enemy1 = new Image();
let enemy2 = new Image();
let enemy3 = new Image();
let enemy4 = new Image();
let enemy5 = new Image();
let missle = new Image();
enemy1.src = "./assets/enemy 1.svg";
enemy2.src = "./assets/enemy 2.svg";
enemy3.src = "./assets/enemy 3.svg";
enemy4.src = "./assets/enemy 4.svg";
enemy5.src = "./assets/space-ship.png";
missle.src = "./assets/missile.png";
let baseImg = new Image();
baseImg.src = "./assets/base2.png";
let enemiesArr = [enemy1, enemy2, enemy3];
let bulletImg = new Image();
bulletImg.src = "./assets/trail.png";
let enemyBulletImg = new Image();
enemyBulletImg.src = "./assets/enemy_trail.png";
let meter1Img = new Image();
meter1Img.src = "./assets/meter1.png";
let meter2Img = new Image();
meter2Img.src = "./assets/meter2.png";
let meter3Img = new Image();
meter3Img.src = "./assets/meter3.png";
let meters = [meter1Img, meter3Img, meter2Img];
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
let loaded = false;

let dir = {
  x: 0,
  y: 0,
};

function generateRandomNumbberBtw(x, y) {
  return Math.floor(Math.random() * (y - x) + x);
}

// img.onload = () => {
//   loaded = true;
// };

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
  if (e.clientX && e.clientY) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
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
      dir.x = 1;
    }
  }
  if (e.key == "w") {
    wdown = false;
    if (!sdown) {
      dir.y = 0;
    } else {
      dir.y = 1;
    }
  }
  if (e.key == "s") {
    sdown = false;
    if (!wdown) {
      dir.y = 0;
    } else {
      dir.y = -1;
    }
  }
  if (e.key == "d") {
    ddown = false;
    if (!adown) {
      dir.x = 0;
    } else {
      dir.x = -1;
    }
  }
});

let powerUps = [Shield, HeavyBullet];
canvas.style.cursor = "none";
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  createStars();
  stars.forEach((ele) => ele.draw());
  if (bg1.height - imgheight <= canvas.height) {
    ctx.drawImage(
      bg1,
      0,
      0,
      bg1.width,
      bg1.height,
      0,
      bg1.height - imgheight,
      bg1.width,
      bg1.height
    );
  }
  //   imgheight += scrollSpeed;
  ctx.globalAlpha = 0.4;
  ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  // ctx.fillStyle = "rgba(0,0,0,0.4)";
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

canvas.addEventListener("click", (e) => {
  if (!paused) {
    let angle;
    let y = e.clientY - player.y;
    let x = e.clientX - player.x;
    angle = Math.atan2(y, x);
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

let player;
let base;
let healthBar = new HealthBar();
let scoreBoard = new Score();
let bullets = [];
let explosions = [];
let enemyBullets = [];
let enemies = [];
let shootingEnemies = [];
let inPowerUps = [];
let stars = [];
let spawned = false;
let shootingStars = [];
let imgheight = 0;
let scrollSpeed = 0.6;

function spawnEnemies() {
  if (!paused) {
    for (let i = 0; i < spawnRate; i++) {
      let enemy = new Enemy();
      enemy.draw();
      enemies.push(enemy);
    }
    spawned = true;
  }
  if (!checkGameOver()) {
    setTimeout(
      () => requestAnimationFrame(spawnEnemies),
      generateRandomNumbberBtw(5 - decrementter - 0.5, 5 - decrementter) * 1000
    );
  } else {
    return;
  }
}

function spawnPowerUp() {
  if (!paused && inPowerUps.length <= 3) {
    let power = new powerUps[generateRandomNumbberBtw(0, powerUps.length)]();
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
  if (!paused && shootingEnemies.length <= (decrementter >= 3.5 ? 3 : 2)) {
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
      generateRandomNumbberBtw(6 - decrementter, 11 - decrementter) * 1000
    );
  }
}

pause.addEventListener("click", () => {
  if (pause.dataset.state == 0) {
    pause.dataset.state = 1;
    gamebg.pause();
    canvas.style.cursor = "default";
    pause.innerHTML = `<img src="./assets/play.png" />`;
  } else {
    pause.dataset.state = 0;
    gamebg.play();
    canvas.style.cursor = "none";
    pause.innerHTML = `<img src="./assets/pause.png" />`;
  }
  paused = !paused;
});

window.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    if (pause.dataset.state == 0) {
      pause.dataset.state = 1;
      gamebg.pause();
      canvas.style.cursor = "default";
      pause.innerHTML = `<img src="./assets/play.png" />`;
    } else {
      pause.dataset.state = 0;
      gamebg.play();
      canvas.style.cursor = "none";

      pause.innerHTML = `<img src="./assets/pause.png" />`;
    }
    paused = !paused;
  }
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
  base = new Base(canvas.width / 2, canvas.height - 140);
  player = new Player(50, canvas.height - 60);
  healthBar = new HealthBar();
  scoreBoard = new Score();
  shielded = false;
  spreadBullets = false;
  clearInterval(spreadInterval);
  clearInterval(shieldInterval);
  bullets = [];
  start = Date.now();
  enemyBullets = [];
  decrementter = 0;
  shootingEnemies.forEach((ele) => {
    clearInterval(ele.interval);
  });
  shootingEnemies = [];
  enemies = [];
  gameLoop();
  spawnEnemies();
  difficultiyChange();
  spawnShootingEnemies();
  setTimeout(
    () => requestAnimationFrame(spawnPowerUp),
    generateRandomNumbberBtw(8, 15) * 1000
  );
}

function difficultiyChange() {
  if (decrementter < 3.68) {
    decrementter += 0.1;
  } else {
    if (speedincrementer < 2.2) {
      speedincrementer += 0.1;
    }
  }
  if (!checkGameOver()) {
    setTimeout(() => requestAnimationFrame(difficultiyChange), 1500);
  } else {
    decrementter = 0;
    return;
  }
}

function createStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    let star = new Star(
      generateRandomNumbberBtw(0, canvas.width),
      generateRandomNumbberBtw(0, canvas.height),
      1,
      1,
      0,
      0.5
    );
    stars.push(star);
  }
  for (let i = 0; i < 100; i++) {
    let star = new Star(
      generateRandomNumbberBtw(0, canvas.width),
      generateRandomNumbberBtw(0, canvas.height),
      2,
      2,
      0,
      0.75
    );
    stars.push(star);
  }
  for (let i = 0; i < 50; i++) {
    let star = new Star(
      generateRandomNumbberBtw(0, canvas.width),
      generateRandomNumbberBtw(0, canvas.height),
      3,
      3,
      0,
      1
    );
    stars.push(star);
  }
}

function shootCommet() {
  let y = generateRandomNumbberBtw(0, canvas.height);
  let shootingStar = new Commet(-2, y, canvas.width + 2, canvas.height - y);
  console.log(y);
  shootingStars.push(shootingStar);
  console.log(shootingStars);
}

function gameLoop() {
  if (!paused) {
    if (imgheight >= bg1.height) {
      imgheight = 0;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((ele) => ele.update());

    // ctx.drawImage(
    bg1,
      0,
      imgheight,
      bg1.width,
      bg1.height - imgheight,
      0,
      0,
      bg1.width,
      bg1.height - imgheight;
    // );
    // if (bg1.height - imgheight <= canvas.height) {
    // ctx.drawImage(
    //   bg1,
    //   0,
    //   0,
    //   bg1.width,
    //   bg1.height,
    //   0,
    //   bg1.height - imgheight,
    //   bg1.width,
    //   bg1.height
    // );
    // }
    // imgheight += scrollSpeed;
    ctx.globalAlpha = 0.4;
    ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    shootingStars.forEach((ele) => ele.update());
    let x = shootingStars.length;
    for (let i = x - 1; i >= 0; i--) {
      if (shootingStars[i]) {
        shootingStars[i].update();
        if (
          shootingStars[i].x > canvas.width + 10 ||
          shootingStars[i].x <= -10 ||
          shootingStars[i].y > canvas.height + 10 ||
          shootingStars[i].y < -10
        ) {
          shootingStars.splice(i, 1);
        }
      }
    }
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
    if (mouse.x && mouse.y) {
      ctx.drawImage(
        crosshair,
        mouse.x - crosshair.width / 2,
        mouse.y - crosshair.height / 2
      );
    } else {
      ctx.drawImage(
        crosshair,
        canvas.width / 2 - crosshair.width / 2,
        canvas.height / 2 - crosshair.height / 2
      );
    }
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (
          bullets[i] &&
          enemies[j] &&
          circleRectCollision(bullets[i], enemies[j])
        ) {
          scoreBoard.val += 10;
          let exp = new Explosion(
            enemies[j].x + enemies[j].width / 2,
            enemies[j].y + enemies[j].height / 2
          );
          explosions.push(exp);
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
          let exp = new Explosion(shootingEnemies[j].x, shootingEnemies[j].y);
          explosions.push(exp);
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
          let exp = new Explosion(enemyBullets[j].x, enemyBullets[j].y);
          explosions.push(exp);
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
          powerAudio.play();
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
        powerAudio.play();
        inPowerUps[j].ability();
        removeFromCanvas(inPowerUps[j]);
        delete inPowerUps[j];
      }
    }

    for (let i = 0; i < enemyBullets.length; i++) {
      if (enemyBullets[i] && circleRectCollision(enemyBullets[i], base)) {
        let exp = new Explosion(enemyBullets[i].x, enemyBullets[i].y);
        explosions.push(exp);
        base.damage(5);
        removeFromCanvas(enemyBullets[i]);
        delete enemyBullets[i];
      }
    }

    for (let i = 0; i < enemyBullets.length; i++) {
      if (enemyBullets[i] && circleCollision(enemyBullets[i], player)) {
        let exp = new Explosion(enemyBullets[i].x, enemyBullets[i].y);
        explosions.push(exp);
        player.damagePlayer(5);
        removeFromCanvas(enemyBullets[i]);
        delete enemyBullets[i];
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i] && rectangleCollision(enemies[i], base)) {
        let exp = new Explosion(
          enemies[i].x + enemies[i].width / 2,
          enemies[i].y + enemies[i].height / 2
        );
        explosions.push(exp);
        base.damage(5);
        removeFromCanvas(enemies[i]);
        delete enemies[i];
      }
    }
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i] && circleRectCollision(player, enemies[i])) {
        let exp = new Explosion(
          enemies[i].x + enemies[i].width / 2,
          enemies[i].y + enemies[i].height / 2
        );
        explosions.push(exp);
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
  let doneExp = [];
  explosions.forEach((ele, index) => {
    ele.update();
    if (ele.done) {
      doneExp.push(index);
    }
  });
  doneExp.sort();
  for (let i = doneExp.length - 1; i >= 0; i--) {
    explosions.splice(doneExp[i], 1);
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
}

createStars();
window.onload = () => {
  player = new Player(50, canvas.height - 20);
  base = new Base(canvas.width / 2, canvas.height - 140);
  start = Date.now();
  bgAspectRatio = bg1.height / bg1.width;
  spawnEnemies();
  difficultiyChange();
  spawnShootingEnemies();
  setTimeout(
    () => requestAnimationFrame(spawnPowerUp),
    generateRandomNumbberBtw(8, 15) * 1000
  );
  gameLoop();
};
