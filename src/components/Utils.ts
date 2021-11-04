  export function getRandomValue(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export const mixValue = (value: number, x: number, y: number) => {
    "worklet";
    return x * (1 - value) + y * value;
  };

  export const snapPoint = (
    value: number,
    velocity: number,
    points: ReadonlyArray<number>
  ): number => {
    "worklet";
    const point = value + 0.2 * velocity;
    const deltas = points.map((p) => Math.abs(point - p));
    const minDelta = Math.min.apply(null, deltas);
    return points.filter((p) => Math.abs(point - p) === minDelta)[0];
  };

  

  