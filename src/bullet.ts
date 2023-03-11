type Settings = {
  coord: Point;
  size: Size;
  speed: number;
};

export function createBullet(settings: Settings) {
  return {
    ...settings,
    draw: function (ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.coord.x, this.coord.y, this.size.w, this.size.h);
    },
    update: function (dx: number, dy: number) {
      this.coord.x += dx;
      this.coord.y += dy;
    },
  };
}

export type Bullet = ReturnType<typeof createBullet>;
