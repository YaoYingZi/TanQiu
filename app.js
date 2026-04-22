const c = document.getElementById("myCanvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
let canvasHeight = c.height;
let canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let xSpeed = 20;
let ySpeed = 20;
let xDirection = 1;
let yDirection = 1;
let radius = 20;
let ground_x = 100;
let ground_y = 0.78 * canvasHeight;
let ground_height = 5;
let brickArray = [];
// let preX = [];
// let preY = [];
let bricks = [];
let count = 0;

document.getElementById("speed").addEventListener("input", (e) => {
  if (Number(e.target.value) > 20) {
    e.target.value = 20;
  } else if (Number(e.target.value) < 0) {
    e.target.value = 0;
  } else {
    e.target.value = Math.round(e.target.value);
  }
  if (Number(e.target.value) === 0) {
    if (xSpeed > 0) {
      xDirection = 1;
    } else {
      xDirection = -1;
    }
    if (ySpeed > 0) {
      yDirection = 1;
    } else {
      yDirection = -1;
    }
    xSpeed = 0;
    ySpeed = 0;
  }
  if (xSpeed > 0) {
    xSpeed = Number(e.target.value);
  } else if (xSpeed < 0) {
    xSpeed = -Number(e.target.value);
  } else {
    xSpeed = xDirection * Number(e.target.value);
  }
  if (ySpeed > 0) {
    ySpeed = Number(e.target.value);
  } else if (ySpeed < 0) {
    ySpeed = -Number(e.target.value);
  } else {
    ySpeed = yDirection * Number(e.target.value);
  }
});

c.addEventListener("mousemove", (e) => {
  if (e.clientX >= canvasWidth - 200) {
    ground_x = canvasWidth - 200;
  } else {
    ground_x = e.clientX;
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1000 || window.innerHeight > 800) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    canvasHeight = c.height;
    canvasWidth = c.width;
    ground_y = 0.78 * canvasHeight;
  } else {
    c.width = 1000;
    c.height = 800;
    canvasHeight = c.height;
    canvasWidth = c.width;
    ground_y = 0.78 * canvasHeight;
  }
});

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
  }

  drawBrick() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX > this.x - radius &&
      ballX < this.x + radius + this.width &&
      ballY > this.y - radius &&
      ballY < this.y + radius + this.height
    );
  }
}

// 如果内存溢出就是这里for的问题;
// for (let i = 0; i < 10; i++) {
//   let x = Math.round(Math.random() * (canvasWidth - 50));
//   if (preX.length > 0) {
//     for (let j = 0; j < preX.length; j++) {
//       if (Math.abs(x - preX[j]) < 50) {
//         x = Math.round(Math.random() * (canvasWidth - 50));
//         j = -1;
//       }
//     }
//   }
//   preX.push(x);
//   let y = Math.round(Math.random() * (canvasHeight - 50));
//   if (preY.length > 0) {
//     for (let j = 0; j < preY.length; j++) {
//       if (Math.abs(y - preY[j]) < 50) {
//         y = Math.round(Math.random() * (canvasHeight - 50));
//         j = -1;
//       }
//     }
//   }
//   preY.push(y);
//   console.log(x, y);
//   new Brick(x, y);
// }

for (let i = 0; i < 10; i++) {
  let x, y;
  let ok = false;

  while (!ok) {
    x = Math.random() * (canvasWidth - 50);
    y = Math.random() * (canvasHeight - 50);

    ok = true;

    for (let b of bricks) {
      if (Math.abs(x - b.x) < 60 && Math.abs(y - b.y) < 60) {
        ok = false;
        break;
      }
    }
  }

  let brick = new Brick(x, y);
  bricks.push(brick);
}

function draw() {
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      if (circle_y >= brick.y + brick.height) {
        circle_y += 90;
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        circle_y -= 90;
        ySpeed *= -1;
      } else if (circle_x <= brick.x) {
        circle_x -= 90;
        xSpeed *= -1;
      } else if (circle_x >= brick.x + brick.width) {
        circle_x += 90;
        xSpeed *= -1;
      }
      if (count == 10) {
        alert("游戏結束");
        clearInterval(game);
      }
    }
  });

  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + ground_height + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 30;
    } else {
      circle_y += 30;
    }
    ySpeed = -ySpeed;
  }

  circle_x += xSpeed;
  circle_y += ySpeed;
  if (circle_x + radius > canvasWidth) {
    circle_x = canvasWidth - radius;
    xSpeed = -xSpeed;
  } else if (circle_x - radius < 0) {
    circle_x = radius;
    xSpeed = -xSpeed;
  }
  if (circle_y + radius > canvasHeight) {
    circle_y = canvasHeight - radius;
    ySpeed = -ySpeed;
  } else if (circle_y - radius < 0) {
    circle_y = radius;
    ySpeed = -ySpeed;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // 砖块
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });
  // 跳板
  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fill();
}
let game = setInterval(draw, 1000 / 60);
