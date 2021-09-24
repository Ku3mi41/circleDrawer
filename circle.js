function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  circleCtx.canvas.width = window.innerWidth;
  circleCtx.canvas.height = window.innerHeight;
}

function randomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function setRandomColors() {
  const strokeStyle = `#${randomColor()}`;
  ctx.strokeStyle = strokeStyle;
  circleCtx.strokeStyle = strokeStyle;
}

function initCanvas() {
  setRandomColors();
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  circleCtx.lineWidth = 5;
  circleCtx.lineCap = 'round';
}

function setCursorPosition(e) {
  cursorPosition.x = e.clientX;
  cursorPosition.y = e.clientY;
  circlePoints.push([e.clientX, e.clientY]);
}

function draw(e) {
  if (e.buttons !== 1) {
    return;
  }

  // fix glitch after window reload
  if (cursorPosition.x === 0 && cursorPosition.y === 0) {
    setCursorPosition(e);
  }

  ctx.beginPath();
  ctx.moveTo(cursorPosition.x, cursorPosition.y);
  setCursorPosition(e);
  ctx.lineTo(cursorPosition.x, cursorPosition.y);

  ctx.stroke();
}

function processCircle() {
  const [x, y] = getDiameterPoints(circlePoints);
  const centerOfCircle = [(x[0] + y[0]) / 2, (x[1] + y[1]) / 2];
  const radiusOfCircle = Math.hypot(centerOfCircle[0] - y[0], centerOfCircle[1] - y[1]);
  circlePoints = [];

  circleCtx.beginPath();
  circleCtx.arc(centerOfCircle[0], centerOfCircle[1], radiusOfCircle, 0, 2 * Math.PI);
  circleCtx.stroke();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setRandomColors();
}

const canvas = document.getElementById('inputCanvas');
const circleCanvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
const circleCtx = circleCanvas.getContext('2d');
let cursorPosition = {x: 0, y: 0};
let circlePoints = [];

resizeCanvas();
initCanvas();

window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousedown', setCursorPosition);
document.addEventListener('mousemove', draw);
document.addEventListener('mouseup', processCircle);
