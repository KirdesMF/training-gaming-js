export function createScore(score: number) {
  return {
    getScore: function () {
      return score;
    },
    addScore: function (value: number) {
      score += value;
    },
    resetScore: function () {
      score = 0;
    },
  };
}

export type Score = ReturnType<typeof createScore>;
