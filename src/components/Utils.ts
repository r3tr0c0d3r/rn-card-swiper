import Animated, { interpolateColor, withSpring } from "react-native-reanimated";

  
  export function getRandomValue(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  type AnimatedColor = string | number;

  export const mixValue = (value: number, x: number, y: number) => {
    "worklet";
    return x * (1 - value) + y * value;
  };

  export const mixColor = (
    value: number,
    color1: AnimatedColor,
    color2: AnimatedColor,
    colorSpace: "RGB" | "HSV" = "RGB"
  ) => {
    "worklet";
    return interpolateColor(value, [0, 1], [color1, color2], colorSpace);
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

  

  