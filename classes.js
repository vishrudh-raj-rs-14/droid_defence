class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.color = "#007FFF";
    this.speed = 7;
    this.health = 100;
    this.width = 9;
    this.height = 50;
    this.playerImg = playerImg;
    this.spriteWidth = this.playerImg.width;
    this.playerImg.onload = () => {
      ctx.drawImage(
        this.playerImg,
        0,
        0,
        this.spriteWidth,
        this.playerImg.height,
        (-1 * this.spriteWidth) / 2,
        (-1 * this.playerImg.height) / 2,
        this.spriteWidth,
        this.playerImg.height
      );
      loaded = true;
    };
  }

  //   draw() {
  //     ctx.save();
  //     ctx.translate(this.x, this.y);
  //     let angle;
  //     if (mouse.x && mouse.y) {
  //       let y = mouse.y - this.y;
  //       let x = mouse.x - this.x;
  //       angle = Math.atan(Math.abs(y / x));
  //       if (x < 0 && y > 0) {
  //         angle = Math.PI - angle;
  //       } else if (x < 0 && y < 0) {
  //         angle = Math.PI + angle;
  //       } else if (x > 0 && y < 0) {
  //         angle = 2 * Math.PI - angle;
  //       }
  //     }
  //     ctx.rotate(angle);
  //     ctx.fillStyle = `#9AA3B5`;
  //     ctx.fillRect(0, -this.width, this.height, this.width * 2);
  //     if (spreadBullets) {
  //       ctx.rotate(Math.PI / 6);
  //       ctx.fillStyle = `#9AA3B5`;
  //       ctx.fillRect(0, -this.width, this.height, this.width * 2);
  //       ctx.rotate((-1 * Math.PI) / 3);
  //       ctx.fillStyle = `#9AA3B5`;
  //       ctx.fillRect(0, -this.width, this.height, this.width * 2);
  //     }
  //     ctx.restore();
  //     ctx.beginPath();
  //     ctx.moveTo(this.x, this.y);
  //     ctx.fillStyle = this.color;
  //     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  //     ctx.fill();
  //   }

  draw() {
    if (shielded) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgb(255,255,255)";
      ctx.arc(this.x, this.y, this.radius + 5, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
      ctx.moveTo(this.x + this.radius + 5, this.y);
      ctx.beginPath();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    let angle;
    if (mouse.x && mouse.y) {
      let y = mouse.y - this.y;
      let x = mouse.x - this.x;
      angle = Math.atan2(y, x);
    }
    angle = angle + Math.PI / 2;
    // if (!angle) {
    // }d
    ctx.rotate(angle);
    ctx.drawImage(
      this.playerImg,
      0,
      0,
      this.spriteWidth,
      this.playerImg.height,
      (-1 * this.spriteWidth) / 2,
      (-1 * this.playerImg.height) / 2,
      this.spriteWidth,
      this.playerImg.height
    );
    ctx.restore();
    ctx.fillStyle = `#F9E5E3`;
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.radius - 5,
      this.y + this.radius + 5,
      this.radius * 2.3,
      7,
      10
    );
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = `#007FFF`;
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.radius - 5,
      this.y + this.radius + 5,
      (this.health / 100) * this.radius * 2.3,
      7,
      10
    );
    ctx.fill();
    ctx.closePath();
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    // ctx.fill();
    // console.log(this.spriteWidth);
    // ctx.drawImage(
    //   this.playerImg,
    //   this.x,
    //   this.y,
    //   this.playerImg.width,
    //   this.playerImg.height
    // );
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

class Enemy {
  constructor(
    x = generateRandomNumbberBtw(0, canvas.width),
    y = -1 * generateRandomNumbberBtw(7, 12),
    tar = true
  ) {
    this.tar = tar;
    this.x = x;
    if (!tar) {
      this.x +=
        [1, -1][generateRandomNumbberBtw(0, 2)] *
        generateRandomNumbberBtw(3, 10);
    }
    this.y = y;
    this.speed = generateRandomNumbberBtw(
      2 + speedincrementer,
      4 + speedincrementer
    );
    this.speed = 3;
    this.width = 40;
    this.health = 5;
    this.height = 40;
    this.target = Math.floor(Math.random() * 2);
    this.sprite = meters[Math.floor(Math.random() * meters.length)];
    // this.sprite = missle;
    this.rotateangle = 0;
    this.spriteWidth = this.sprite.width;
  }
  draw() {
    // ctx.fillStyle = "#662d91";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(
    //   this.sprite,
    //   this.x,
    //   this.y,
    //   this.spriteWidth,
    //   this.sprite.height,
    //   0,
    //   0,
    //   this.width,
    //   this.height
    // );
    // let angle;
    // if (this.target == 0) {
    //   angle = Math.atan2(
    //     base.y + base.height / 2 - this.y,
    //     base.x + base.width / 2 - this.x
    //   );
    // } else {
    //   angle = Math.atan2(player.y - this.y, player.x - this.x);
    // }
    // angle -= Math.PI / 2;
    this.rotateangle += 0.1;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotateangle);
    ctx.drawImage(
      this.sprite,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
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
    if (this.tar) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.y += this.speed + generateRandomNumbberBtw(3, 6);
    }
    this.draw();
  }
}

class ShootingEnemy {
  constructor() {
    this.x = generateRandomNumbberBtw(0, canvas.width);
    this.y = -1 * generateRandomNumbberBtw(55, 75);
    this.speed = generateRandomNumbberBtw(2, 4);
    this.radius = 30;
    this.interval;
    this.health = 10;
    this.target = Math.floor(Math.random() * 2);
    this.angle = Math.atan(Math.abs((base.y - this.y) / (base.x - this.x)));
    this.posTo = [
      [70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
      [canvas.width - 70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
    ];
    this.cur = Math.floor(Math.random() * this.posTo.length);
    this.enemyShipImg =
      enemiesArr[Math.floor(Math.random() * enemiesArr.length)];
    this.spriteWidth = this.enemyShipImg.width;
    this.imgr = this.enemyShipImg.height / this.enemyShipImg.width;
    this.spritew = this.radius * 2;
    this.spriteh = this.spritew * this.imgr;
    this.enemyShipImg.onload = () => {
      ctx.drawImage(
        this.enemyShipImg,
        -1 * this.radius,
        -1 * this.radius,
        this.radius * 2,
        this.radius * 2
      );
    };
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
    angle = angle + Math.PI / 2;
    ctx.rotate(angle);
    ctx.drawImage(
      this.enemyShipImg,
      (-1 * this.spritew * 1.5) / 2,
      (-1 * this.spriteh * 1.5) / 2,
      this.spritew * 1.5,
      this.spriteh * 1.5
    );
    ctx.restore();
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

class Missile {
  constructor(x, y, angle = Math.PI / 2) {
    this.x = x;
    this.y = y;
    this.img = missle;
    this.health = 10;
    this.width = 40;
    this.speed = 4;
    this.angularSpeed = 0.05;
    this.angularacc = 0.00025;
    // this.radius = this.width / 2;
    this.acc = 0.05;
    this.height = (this.width * missle.height) / missle.width;
    this.rotateAngle = angle;
    if (
      distanceBetween(
        [this.x + this.width / 2, this.y + this.height / 2],
        [base.x + base.width / 2, base.y + base.height / 2]
      ) <=
      distanceBetween(
        [player.x + player.width / 2, player.y + player.height / 2],
        [this.x + this.width / 2, this.y + this.height / 2]
      )
    ) {
      this.target = base;
    } else {
      this.target = player;
    }
    this.angle = Math.atan2(
      this.target.y + this.target.height / 2 - this.y - this.height / 2,
      this.target.x + this.target.width / 2 - this.x - this.width / 2
    );
  }
  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    ctx.rotate(this.rotateAngle - Math.PI / 2);
    ctx.drawImage(
      this.img,
      (-1 * this.width) / 2,
      (-1 * this.height) / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update() {
    this.speed += this.acc;
    if (this.angularSpeed <= 0.5) this.angularSpeed += this.angularacc;
    this.angle = Math.atan(
      Math.abs(
        (this.target.y + this.target.height / 2 - this.y - this.height / 2) /
          (this.target.x + this.target.width / 2 - this.x - this.width / 2)
      )
    );
    let x = this.target.x + this.target.width / 2 - this.x - this.width / 2;
    let y = this.target.y + this.target.height / 2 - this.y - this.height / 2;
    if (x > 0 && y <= 0) {
      this.angle = 2 * Math.PI - this.angle;
    } else if (x < 0 && y >= 0) {
      this.angle = Math.PI - this.angle;
    } else if (x < 0 && y < 0) {
      this.angle = Math.PI + this.angle;
    }
    // console.log(
    //   (this.angle * 180) / Math.PI,
    //   (this.rotateAngle * 180) / Math.PI
    // );
    if (
      Math.min(
        Math.abs(this.angle - this.rotateAngle),
        2 * Math.PI - Math.abs(this.angle - this.rotateAngle)
      ) >= this.angularSpeed
    ) {
      if (
        Math.abs(this.angle - this.rotateAngle) <=
        2 * Math.PI - Math.abs(this.angle - this.rotateAngle)
      ) {
        this.rotateAngle +=
          Math.sign(this.angle - this.rotateAngle) * this.angularSpeed;
      } else {
        this.rotateAngle -=
          Math.sign(this.angle - this.rotateAngle) * this.angularSpeed;
      }
    }

    this.rotateAngle = this.rotateAngle % (2 * Math.PI);
    if (this.rotateAngle <= 0) {
      this.rotateAngle += Math.PI * 2;
    }
    this.dx = Math.cos(this.rotateAngle) * this.speed;
    this.dy = Math.sin(this.rotateAngle) * this.speed;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

class MissileEnemy {
  constructor() {
    this.x = generateRandomNumbberBtw(0, canvas.width);
    this.y = -1 * generateRandomNumbberBtw(55, 75);
    this.speed = generateRandomNumbberBtw(2, 4);
    this.radius = 30;
    this.interval;
    this.health = 25;
    this.posTo = [
      [70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
      [canvas.width - 70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
    ];
    this.cur = Math.floor(Math.random() * this.posTo.length);
    this.enemyShipImg = enemyMissileShip;
    this.spriteWidth = this.enemyShipImg.width;
    this.imgr = this.enemyShipImg.height / this.enemyShipImg.width;
    this.spritew = this.radius * 2;
    this.spriteh = this.spritew * this.imgr;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI);
    ctx.drawImage(
      this.enemyShipImg,
      (-1 * this.spritew * 1.2) / 2,
      (-1 * this.spriteh * 1.2) / 2,
      this.spritew * 1.2,
      this.spriteh * 1.2
    );
    ctx.restore();
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
      let newBullet = new Missile(
        this.x - this.radius / 2,
        this.y + this.radius
      );
      missileEnemyBullets.push(newBullet);
    }
    if (!checkGameOver()) {
      this.interval = setTimeout(
        this.shoot.bind(this),
        generateRandomNumbberBtw(2, 4) * 1000
      );
    }
  }
}

class Boss {
  constructor(interval) {
    this.interval;
    this.x = window.innerWidth / 2;
    this.speed = 2;
    this.y = -50;
    this.health = 250;
    this.posTo = [
      [70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
      [canvas.width - 70, generateRandomNumbberBtw(150, canvas.height / 2)],
      [canvas.width / 2, generateRandomNumbberBtw(20, 80)],
    ];
    this.cur = 0;
    this.radius = 85;
    this.enemyShipImg = bossImg;
    this.spriteWidth = this.enemyShipImg.width;
    this.imgr = this.enemyShipImg.height / this.enemyShipImg.width;
    this.spritew = this.radius * 2;
    this.spriteh = this.spritew * this.imgr;
    this.healthBarWidth = 275;
    this.healthBarHeight = 20;
    this.spinner = false;
    this.spinAngle = 0;
    this.shielded = true;
    this.shooterInterval;
    this.meteroiteShower = false;
    this.attacks = [this.missileBlast, this.metShower];
  }

  attack() {
    console.log(this.attacks);
    if (!checkGameOver()) {
      this.attacks[generateRandomNumbberBtw(0, this.attacks.length)].bind(
        this
      )();
    }
  }

  draw() {
    // ctx.fillStyle = "red";
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    if (this.shielded) {
      let grd = ctx.createRadialGradient(
        this.x,
        this.y + 30,
        0,
        this.x,
        this.y,
        this.radius + 25
      );
      grd.addColorStop(0, "rgba(255,255,255,0");
      grd.addColorStop(1, "rgba(255, 3, 62, 0.7)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y + 30,
        this.radius + 25,
        (-25 * Math.PI) / 180,
        Math.PI + (25 * Math.PI) / 180
      );
      // ctx.globalAlpha = 0.5;
      ctx.fill();
      // ctx.globalAlpha = 1;
      ctx.closePath();
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.spinner) {
      ctx.rotate(this.spinAngle);
    }
    ctx.drawImage(
      this.enemyShipImg,
      (-1 * this.spritew * 1.2) / 2,
      (-1 * this.spriteh * 1.2) / 2,
      this.spritew * 1.2,
      this.spriteh * 1.2
    );
    ctx.restore();
    ctx.fillStyle = `#F9E5E3`;
    ctx.beginPath();
    ctx.roundRect(
      window.innerWidth / 2 - this.healthBarWidth / 2,
      20,
      this.healthBarWidth,
      this.healthBarHeight,
      10
    );
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = `#F40009`;
    ctx.beginPath();
    ctx.roundRect(
      window.innerWidth / 2 - this.healthBarWidth / 2,
      20,
      (this.health / 250) * this.healthBarWidth,
      this.healthBarHeight,
      10
    );
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.spinner) {
      this.spinAngle += (2 * Math.PI) / 180;
      if (this.spinAngle >= 2 * Math.PI) {
        this.spinAngle = 0;
        this.spinner = false;
        clearInterval(this.shooterInterval);
      }
    }
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
    // console.log(this.angle, this.dx, this.dy);
    if (
      Math.floor(distanceBetween([this.x, this.y], this.posTo[this.cur])) <= 5
    ) {
      this.cur = (this.cur + 1) % this.posTo.length;
    }
    if (!this.meteroiteShower && !this.spinner) {
      this.x += this.dx;
      this.y += this.dy;
    }

    this.draw();
  }

  missileBlast() {
    if (!paused) {
      this.shoot();
      setTimeout(this.shoot.bind(this), 400);
    }
    setTimeout(
      (() => {
        if (!paused) this.shoot.bind(this)();
        this.interval = setTimeout(
          (() => {
            this.attack.bind(this)();
          }).bind(this),
          generateRandomNumbberBtw(4, 8) * 1000
        );
      }).bind(this),
      800
    );
  }
  metShower() {
    this.meteroiteShower = true;
    this.shielded = false;
    if (!paused) {
      for (let i = 0; i < 15; i++) {
        let enemy = new Enemy(
          (canvas.width / 15) * i,
          -1 * generateRandomNumbberBtw(10, 75),
          false
        );
        enemy.draw();
        enemies.push(enemy);
      }
    }
    this.interval = setTimeout(
      (() => {
        this.meteroiteShower = false;
        this.shielded = true;
        if (!checkGameOver()) {
          setTimeout(
            this.attack.bind(this),
            generateRandomNumbberBtw(4, 8) * 1000
          );
        }
      }).bind(this),
      5000
    );
  }

  spinAttack() {
    this.spinner = true;
    this.spinAngle = 0;
    this.shooterInterval = setInterval(() => {
      let newBullet = new EnemyBullets(
        this.x,
        this.y,
        this.spinAngle + Math.PI / 2
      );
      enemyBullets.push(newBullet);
    }, 300);
  }

  shoot() {
    if (!paused) {
      let newBullet = new Missile(this.x, this.y + this.radius);
      let newBullet2 = new Missile(
        this.x - this.radius,
        this.y + 5,
        Math.PI / 2 + Math.PI / 3
      );
      let newBullet3 = new Missile(
        this.x + this.radius,
        this.y + 5,
        Math.PI / 2 - Math.PI / 3
      );
      missileEnemyBullets.push(newBullet);
      missileEnemyBullets.push(newBullet2);
      missileEnemyBullets.push(newBullet3);
    }
  }
}

class Score {
  constructor() {
    this.val = 0;
    this.x = canvas.width - 210;
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
    this.x = canvas.width - 210;
    this.y = 30;
  }
}

class HealthBar {
  constructor() {
    this.health = 100;
    this.width = 400;
    this.height = 30;
    this.playerHealth = 100;
    this.x = 25;
    this.y = 25;
  }

  draw() {
    // ctx.fillStyle = `#F9E5E3`;
    // ctx.beginPath();
    // ctx.roundRect(this.x, this.y, this.width, this.height, 10);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillStyle = `#27A313`;
    // ctx.beginPath();
    // ctx.roundRect(
    //   this.x,
    //   this.y,
    //   (this.health / 100) * this.width,
    //   this.height,
    //   10
    // );
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillStyle = `#F9E5E3`;
    // ctx.beginPath();
    // ctx.roundRect(
    //   this.x,
    //   this.y + this.height + 20,
    //   this.width,
    //   this.height,
    //   10
    // );
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillStyle = `#007FFF`;
    // ctx.beginPath();
    // ctx.roundRect(
    //   this.x,
    //   this.y + this.height + 20,
    //   (this.playerHealth / 100) * this.width,
    //   this.height,
    //   10
    // );
    // ctx.fill();
    // ctx.closePath();
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
    this.speed = 30;
    this.dx = this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
    this.angle = angle;
    this.color = "rgba(2,127,255,";
    this.bulletImg = bulletImg;
    this.state = 0;
    this.spriteWidth = this.bulletImg.width;

    this.bulletImg.onload = () => {
      ctx.drawImage(
        this.bulletImg,
        this.state * this.spriteWidth,
        0,
        (this.state + 1) * this.spriteWidth,
        this.bulletImg.height,
        (-1 * this.spriteWidth) / 2,
        (-1 * this.bulletImg.height) / 2,
        this.spriteWidth,
        this.bulletImg.height
      );
      loaded = true;
    };

    // #027FFF
  }

  //   draw() {
  //     ctx.fillStyle = `${this.color}1)`;
  //     ctx.beginPath();
  //     ctx.moveTo(this.x, this.y);
  //     ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  //     ctx.fill();
  //     for (let i = 1; i < 10; i++) {
  //       ctx.fillStyle = `${this.color}${0.15})`;
  //       ctx.moveTo(this.x - i * 0.2 * this.dx, this.y - i * 0.2 * this.dy);
  //       ctx.arc(
  //         this.x - i * 0.2 * this.dx,
  //         this.y - i * 0.2 * this.dy,
  //         this.radius,
  //         2 * Math.PI,
  //         false
  //       );
  //       ctx.fill();
  //     }
  //   }

  draw() {
    // ctx.fillStyle = `${this.color}1)`;
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    // ctx.fill();
    // for (let i = 1; i < 10; i++) {
    //   ctx.fillStyle = `${this.color}${0.15})`;
    //   ctx.moveTo(this.x - i * 0.2 * this.dx, this.y - i * 0.2 * this.dy);
    //   ctx.arc(
    //     this.x - i * 0.2 * this.dx,
    //     this.y - i * 0.2 * this.dy,
    //     this.radius,
    //     2 * Math.PI,
    //     false
    //   );
    //   ctx.fill();
    // }
    ctx.save();
    ctx.translate(this.x, this.y);
    // angle = angle + Math.PI / 2;
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.bulletImg,
      0,
      0,
      this.spriteWidth,
      this.bulletImg.height,
      (-1 * this.spriteWidth) / 2,
      (-1 * this.bulletImg.height) / 2,
      this.spriteWidth,
      this.bulletImg.height
    );
    ctx.restore();
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

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.spriteSheet = explosionSprite;
    this.frame = 1;
    this.totalFrames = 6;
    this.done = false;
    this.spriteWidth = this.spriteSheet.width / (this.totalFrames + 1);
    this.spriteSheet.onload = () => {
      ctx.drawImage(
        this.spriteSheet,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteSheet.height,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    };
  }

  draw() {
    ctx.drawImage(
      this.spriteSheet,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteSheet.height,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  update() {
    this.frame += 1;
    this.draw();
    if (this.frame >= this.totalFrames) {
      this.done = true;
    }
  }
}

class EnemyBullets extends Bullet {
  constructor(x, y, angle = (-1 * Math.PI) / 2) {
    super(x, y, angle);
    this.color = "rgba(239,1,7,";
    this.bulletImg = enemyBulletImg;
  }
}

class Base {
  constructor(x, y) {
    this.health = 100;
    this.sprite = baseImg;
    this.aspectRatio = this.sprite.height / this.sprite.width;
    this.width = 90;
    this.imgwidth = 170;
    this.playerTurretRadius = 350;
    this.target;
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.height = 200;
    this.imgheight = this.imgwidth * this.aspectRatio;
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    this.playerHealthWidth = 300;
    this.playerHealthHeight = 15;
    this.shooted = false;
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
        Math.sqrt((this.imgwidth / 2) ** 2 + (this.imgheight / 2) ** 2),
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.closePath();
      ctx.moveTo(
        this.x +
          Math.sqrt((this.imgwidth / 2) ** 2 + (this.imgheight / 2) ** 2),
        this.y
      );
      ctx.beginPath();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.restore();
    }
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.playerTurretRadius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.save();
    ctx.setLineDash([30, 30]);
    // ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.currentAngle);
    ctx.drawImage(
      this.sprite,
      -this.imgwidth / 2,
      -this.imgheight / 2,
      this.imgwidth,
      this.imgheight
    );
    ctx.restore();
    // ctx.fillStyle = `#FEBE105A`;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = `#F9E5E3`;
    ctx.beginPath();
    ctx.roundRect(
      window.innerWidth / 2 - this.playerHealthWidth / 2,
      window.innerHeight - this.playerHealthHeight - 10,
      this.playerHealthWidth,
      this.playerHealthHeight,
      10
    );
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = `#27A313`;
    ctx.beginPath();
    ctx.roundRect(
      window.innerWidth / 2 - this.playerHealthWidth / 2,
      window.innerHeight - this.playerHealthHeight - 10,
      (this.health / 100) * this.playerHealthWidth,
      this.playerHealthHeight,
      10
    );
    ctx.fill();
    ctx.closePath();
  }

  findTarget() {
    // console.log(
    //   distanceBetween(
    //     [enemies.x + enemies.width / 2, enemies.y + enemies.height / 2],
    //     [[this.x + this.width / 2, this.y + this.height / 2]]
    //   )
    // );
    let found = false;
    for (let i = 0; i < enemies.length; i++) {
      if (
        distanceBetween(
          [
            enemies[i].x + enemies[i].width / 2,
            enemies[i].y + enemies[i].height / 2,
          ],
          [this.x + this.width / 2, this.y + this.height / 2]
        ) <= this.playerTurretRadius
      ) {
        this.target = enemies[i];
        this.targetAngle =
          Math.atan2(
            enemies[i].y + enemies[i].height / 2 - this.y - this.height / 2,
            enemies[i].x + enemies[i].width / 2 - this.x - this.width / 2
          ) +
          Math.PI / 2;
        found = true;
        break;
      }
    }
    if (!found) {
      this.target = undefined;
      this.targetAngle = 0;
    }
  }

  update() {
    if (this.target) {
      this.targetAngle =
        Math.atan2(
          this.target.y + this.target.height / 2 - this.y - this.height / 2,
          this.target.x + this.target.width / 2 - this.x - this.width / 2
        ) +
        Math.PI / 2;
    }
    if (
      !this.target ||
      this.target.health <= 0 ||
      this.target.y >= window.innerHeight
    ) {
      this.findTarget();
    }
    if (this.currentAngle - this.targetAngle >= 0.02) {
      this.currentAngle -= 0.02;
    } else if (this.currentAngle - this.targetAngle < -0.02) {
      this.currentAngle += 0.02;
    } else if (this.target && !this.shooted) {
      let newBullet = new Bullet(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.targetAngle - Math.PI / 2
      );
      shoot.currentTime = 0;
      shoot.play();
      this.shooted = true;
      bullets.push(newBullet);
      setTimeout(
        (() => {
          this.shooted = false;
        }).bind(this),
        500
      );
    }
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
    this.y = canvas.height - this.height / 2 - 160;
  }
}

class Star {
  constructor(x, y, width, height, dx = 0, dy = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x > canvas.width + 10) {
      this.x = canvas.x - 5;
    }
    if (this.y > canvas.height) {
      this.y = -5;
    }
    this.draw();
  }
}

class Commet {
  constructor(x, y, toX, toY) {
    this.x = x;
    this.y = y;
    this.speed = 25;
    this.toX = toX;
    this.toY = toY;
    this.sprite = commet;
    this.angle = Math.atan2(this.toY - this.y, this.toX - this.x);
    this.dx = Math.cos(this.angle) * this.speed;
    this.dy = Math.sin(this.angle) * this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.sprite,
      0,
      0,
      this.sprite.width / 2,
      this.sprite.height / 1.5
    );
    ctx.restore();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}
