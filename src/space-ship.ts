import { createBullet, type Bullet } from "./bullet";

export type Settings = {
  canvas: HTMLCanvasElement;
  coord: Point;
  size: number;
  life: number;
  speed: number;
  color?: string;
};

export function createSpaceShip(settings: Settings) {
  const bulletCooldown = 250; // ms
  let lastBulletTime = 0;
  return {
    ...settings,
    bullets: [] as Bullet[],
    draw: function (ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color || "white";
      ctx.fillRect(this.coord.x, this.coord.y, this.size, this.size);

      for (let bullet of this.bullets) {
        bullet.draw(ctx);
        bullet.update(0, -bullet.speed);

        if (bullet.coord.y + bullet.size.h < 0) {
          this.bullets = this.bullets.filter((b) => b !== bullet);
        }
      }
    },
    update: function (dx: number, dy: number) {
      this.coord.x += dx;
      this.coord.y += dy;

      if (this.coord.x < 0) this.coord.x = 0;
      if (this.coord.y < 0) this.coord.y = 0;
      if (this.coord.x + this.size > this.canvas.width) {
        this.coord.x = this.canvas.width - this.size;
      }
      if (this.coord.y + this.size > this.canvas.height) {
        this.coord.y = this.canvas.height - this.size;
      }
    },
    shoot: function () {
      const now = Date.now();
      if (now - lastBulletTime >= bulletCooldown) {
        const bullet = createBullet({
          coord: { x: this.coord.x, y: this.coord.y },
          size: { w: 20, h: 15 },
          speed: 10,
        });

        this.bullets.push(bullet);
        lastBulletTime = now;
      }
    },
  };
}

export type SpaceShip = ReturnType<typeof createSpaceShip>;
