import { createMob, type Mob } from "./mob";
import { createSpaceShip, type SpaceShip } from "./space-ship";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let spaceShip: SpaceShip;
let mobs: Mob[] = [];

export function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function clear() {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

function keyboardEvent(event: KeyboardEvent) {
  const code = event.code as keyof typeof keys;
  if (keys[code] === undefined) return;
  keys[code] = event.type === "keydown";
}

function init() {
  resize();

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
      coord: { x: i * 100, y: -25 },
      size: 25,
      life: 1,
      speed: 2,
    });
    mobs.push(mob);
  }

  window.addEventListener("keydown", keyboardEvent);
  window.addEventListener("keyup", keyboardEvent);
}

function draw() {
  clear();
  spaceShip.draw(ctx);

  for (let mob of mobs) {
    mob.draw(ctx);
    mob.update(0, mob.speed);

    if (mob.life <= 0) {
      mobs = mobs.filter((m) => m !== mob);
    }

    if (mob.coord.y > canvas.height) {
      mobs = mobs.filter((m) => m !== mob);
    }

    for (let bullet of spaceShip.bullets) {
      if (
        bullet.coord.x + bullet.size.w > mob.coord.x &&
        bullet.coord.x < mob.coord.x + mob.size &&
        bullet.coord.y + bullet.size.h > mob.coord.y &&
        bullet.coord.y < mob.coord.y + mob.size
      ) {
        mob.life--;
        spaceShip.bullets = spaceShip.bullets.filter((b) => b !== bullet);
      }
    }
  }

  if (keys.ArrowUp) spaceShip.update(0, -spaceShip.speed);
  if (keys.ArrowDown) spaceShip.update(0, spaceShip.speed);
  if (keys.ArrowRight) spaceShip.update(spaceShip.speed, 0);
  if (keys.ArrowLeft) spaceShip.update(-spaceShip.speed, 0);
  if (keys.Space) spaceShip.shoot();

  requestAnimationFrame(draw);
}

init();
draw();
