import { interpolate, Easing } from "remotion";

export const easeOutCubic = Easing.bezier(0.33, 1, 0.68, 1);
export const easeOutBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const easeOutQuart = Easing.bezier(0.25, 1, 0.5, 1);
export const materialStandard = Easing.bezier(0.4, 0, 0.2, 1);

export const fadeSlideUp = (localFrame: number, delay = 0, duration = 25) => ({
  opacity: interpolate(localFrame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic,
  }),
  transform: `translateY(${interpolate(localFrame, [delay, delay + duration], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic,
  })}px)`,
});

export const scalePop = (localFrame: number, delay = 0, duration = 25) => ({
  opacity: interpolate(localFrame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }),
  transform: `scale(${interpolate(localFrame, [delay, delay + duration], [0.85, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutBack,
  })})`,
});

export const countUp = (localFrame: number, target: number, duration = 50, delay = 0) =>
  Math.round(interpolate(localFrame, [delay, delay + duration], [0, target], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutQuart,
  }));

export const countUpFloat = (localFrame: number, target: number, decimals = 1, duration = 50, delay = 0) =>
  interpolate(localFrame, [delay, delay + duration], [0, target], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutQuart,
  }).toFixed(decimals);

export const staggerDelay = (index: number, baseDelay = 8) => index * baseDelay;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
