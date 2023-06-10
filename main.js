let canvas = document.querySelector("#main_bg");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stars = [];
let done = false;
setTimeout(() => {
  done = true;
}, 3000);
let gradient = new Image();
gradient.src = "./assets/gradient.png";
function generateRandomNumbberBtw(x, y) {
  return Math.floor(Math.random() * (y - x) + x);
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

function createStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    let star = new Star(
      generateRandomNumbberBtw(0, canvas.width),
      generateRandomNumbberBtw(0, canvas.height),
      1,
      1,
      0,
      0.25
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
      0.5
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
createStars();
window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
};
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((ele) => ele.update());
  ctx.globalAlpha = 0.4;
  ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / 60);
}

window.onload = () => {
  animate();
};

window.onclick = () => {
  if (done) {
    window.location.href = "./main.html";
  }
};
