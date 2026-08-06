
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hue = 0;
let balls = [];

for (let i = 0; i < 10; i++) {
  balls.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 40 + 20,
    dx: Math.random() * 0.3 - 0.15,
    dy: Math.random() * 0.3 - 0.15,
    baseHue: Math.random() * 360
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball) => {
    let dynamicHue = (ball.baseHue + hue) % 360;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${dynamicHue}, 100%, 60%, 0.3)`;
    ctx.shadowColor = `hsla(${dynamicHue}, 100%, 70%, 0.8)`;
    ctx.shadowBlur = 25;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy *= -1;
  });

  hue += 0.5;
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const robot = document.getElementById('robot');
  const hand = document.getElementById('hand');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    hand.style.display = 'none';
  } else {
    passwordInput.type = 'password';
    hand.style.display = 'block';
  }
}
