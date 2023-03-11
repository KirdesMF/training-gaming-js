const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

export function resize() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function clear() {
  if (!canvas) return;
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

resize();

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

const player = {
  coord: { x: canvas.width / 2, y: canvas.height / 2 },
  size: 25,
  life: 1,
  speed: 5,
  missile: [],
  draw: function () {
    if (!ctx) return;
    ctx.fillRect(this.coord.x, this.coord.y, this.size, this.size);
  },
  move: function () {
    if (keys.ArrowUp) this.coord.y -= this.speed;
    if (keys.ArrowDown) this.coord.y += this.speed;
    if (keys.ArrowRight) this.coord.x += this.speed;
    if (keys.ArrowLeft) this.coord.x -= this.speed;
    if (keys.Space) this.shoot();

    if (this.coord.y < 0) this.coord.y = 0;
    if (this.coord.x < 0) this.coord.x = 0;

    if (this.coord.y + this.size > canvas.height) {
      this.coord.y = canvas.height - this.size;
    }

    if (this.coord.x + this.size > canvas.width) {
      this.coord.x = canvas.width - this.size;
    }
  },
  shoot: function () {},
};

const missile = {
  coord: { x: player.coord.x, y: player.coord.y },
  size: { w: 10, h: 20 },
  speed: 2,
  draw: function () {
    if (!ctx) return;
    ctx.fillRect(this.coord.x, this.coord.y, this.size.w, this.size.h);
  },
  move: function () {
    if (keys.Space) this.coord.y -= this.speed;
  },
};

function drawGame() {
  clear();
  player.move();
  player.draw();

  missile.draw();
  missile.move();

  requestAnimationFrame(drawGame);
}

drawGame();

function keyboardEvent(event: KeyboardEvent) {
  const code = event.code as keyof typeof keys;
  if (keys[code] === undefined) return;
  keys[code] = event.type === "keydown";
}

window.addEventListener("keydown", keyboardEvent);
window.addEventListener("keyup", keyboardEvent);
