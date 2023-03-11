import type { Bullet } from "./bullet";
import { createMob, type Mob } from "./mob";
import { createScore, type Score } from "./score";
import { createSpaceShip, type SpaceShip } from "./space-ship";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const div = document.querySelector(".score") as HTMLDivElement;

let spaceShip: SpaceShip;
let mobs: Mob[] = [];
let score: Score;

export function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function clear() {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
  div.textContent = `Score: ${score.getScore()}`;
}

function isColliding(bullet: Bullet, mob: Mob) {
  return (
    bullet.coord.x + bullet.size.w > mob.coord.x &&
    bullet.coord.x < mob.coord.x + mob.size &&
    bullet.coord.y + bullet.size.h > mob.coord.y &&
    bullet.coord.y < mob.coord.y + mob.size
  );
}

const keys: Record<Keys, boolean> = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
  Escape: false,
  KeyP: false,
};

function keyboardEvent(event: KeyboardEvent) {
  const code = event.code as keyof typeof keys;
  if (keys[code] === undefined) return;
  keys[code] = event.type === "keydown";
}

const minY = -25;
const maxY = 0;
function init() {
  resize();
  score = createScore(0);

  // init player
  spaceShip = createSpaceShip({
    canvas,
    coord: { x: canvas.width / 2, y: canvas.height / 2 },
    size: 25,
    life: 1,
    speed: 8,
  });

  // init mobs
  for (let i = 0; i < 20; i++) {
    const mob = createMob({
      coord: {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
      },
      size: Math.floor(Math.random() * 15) + 15,
      life: 1,
      speed: Math.floor(Math.random() * 3) + 1,
    });
    mobs.push(mob);
  }

  window.addEventListener("keydown", keyboardEvent);
  window.addEventListener("keyup", keyboardEvent);
}

function draw() {
  clear();

  // space ship
  spaceShip.draw(ctx);
  spaceShip.move(keys);

  // mobs
  for (let mob of mobs) {
    mob.draw(ctx);
    mob.update(0, mob.speed);

    if (mob.life <= 0 || mob.coord.y > canvas.height) {
      mobs = mobs.filter((m) => m !== mob);
    }

    for (let bullet of spaceShip.bullets) {
      if (isColliding(bullet, mob)) {
        mob.life--;
        spaceShip.bullets = spaceShip.bullets.filter((b) => b !== bullet);
        score.addScore(1);
        updateScore();
      }
    }
  }

  // add new mobs
  if (mobs.length < 20) {
    const mob = createMob({
      coord: { x: Math.random() * canvas.width, y: -25 },
      size: Math.floor(Math.random() * 15) + 15,
      life: 1,
      speed: Math.floor(Math.random() * 2) + 1,
    });
    mobs.push(mob);
  }

  requestAnimationFrame(draw);
}

function start() {
  init();
  updateScore();
  draw();
}

function reset() {
  spaceShip.bullets = [];
  mobs = [];
  score.resetScore();
}

export const game = {
  start,
  stop,
  resize,
  reset,
};
