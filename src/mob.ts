export type Settings = {
  coord: Point;
  size: number;
  life: number;
  speed: number;
};

export function createMob(settings: Settings) {
  return {
    ...settings,
    draw: function (ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "gold";
      ctx.fillRect(this.coord.x, this.coord.y, this.size, this.size);
    },

    update: function (dx: number, dy: number) {
      this.coord.x += dx;
      this.coord.y += dy;
    },
  };
}

export type Mob = ReturnType<typeof createMob>;
