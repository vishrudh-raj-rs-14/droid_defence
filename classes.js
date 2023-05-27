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
      angle = Math.atan(Math.abs(y / x));
      if (x < 0 && y > 0) {
        angle = Math.PI - angle;
      } else if (x < 0 && y < 0) {
        angle = Math.PI + angle;
      } else if (x > 0 && y < 0) {
        angle = 2 * Math.PI - angle;
      }
    }
    angle = angle + Math.PI / 2;
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
  constructor() {
    this.x = generateRandomNumbberBtw(0, canvas.width);
    this.y = -1 * generateRandomNumbberBtw(7, 12);
    this.speed = generateRandomNumbberBtw(
      2 + speedincrementer,
      4 + speedincrementer
    );
    this.speed = 3;
    this.width = 40;
    this.height = 40;
    this.target = Math.floor(Math.random() * 2);
    this.sprite = meters[Math.floor(Math.random() * meters.length)];
    this.spriteWidth = this.sprite.width;
    this.sprite.onload = () => {
      ctx.drawImage(
        this.sprite,
        this.x,
        this.y,
        this.spriteWidth,
        this.sprite.height,
        (-1 * this.spriteWidth) / 2,
        (-1 * this.sprite.height) / 2,
        this.spriteWidth,
        this.sprite.height
      );
    };
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
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
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
    this.radius = 30;
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
  //   draw() {
  //     ctx.save();
  //     ctx.translate(this.x, this.y);
  //     let angle;
  //     let aim = this.target == 0 ? base : player;
  //     let y = aim.y - this.y;
  //     let x = aim.x - this.x;
  //     angle = Math.atan(Math.abs(y / x));
  //     if (x < 0 && y > 0) {
  //       angle = Math.PI - angle;
  //     } else if (x < 0 && y < 0) {
  //       angle = Math.PI + angle;
  //     } else if (x > 0 && y < 0) {
  //       angle = 2 * Math.PI - angle;
  //     }
  //     ctx.rotate(angle);
  //     ctx.fillStyle = `#9AA3B5`;
  //     ctx.fillRect(0, -10, 50, 20);
  //     ctx.restore();
  //     ctx.beginPath();
  //     ctx.moveTo(this.x, this.y);
  //     ctx.fillStyle = this.color;
  //     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  //     ctx.fill();
  //   }

  draw() {
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    // ctx.fill();
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
    // ctx.fillStyle = `#9AA3B5`;
    // ctx.fillRect(0, -10, 50, 20);
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
