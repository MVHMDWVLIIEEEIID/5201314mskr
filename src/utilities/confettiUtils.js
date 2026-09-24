// src/utilities/confettiUtils.js
import confetti from "canvas-confetti";

export const CONFETTI_COLORS = [
  "#60a5fa",
  "#93c5fd",
  "#3b82f6",
  "#ffffff",
  "#bfdbfe",
];
export const CANDLE_COUNT = 19;
let hasFired = false;

export function fireConfettiFromTop() {
  if (hasFired) return;

  const defaults = {
    startVelocity: 28,
    spread: 360,
    ticks: 200,
    zIndex: 40,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: false,
  };

  // Calculates three distinct drop zones from the top axis (y: 0)
  confetti({ ...defaults, particleCount: 45, origin: { x: 0.2, y: 0 } });
  confetti({ ...defaults, particleCount: 45, origin: { x: 0.5, y: 0 } });
  confetti({ ...defaults, particleCount: 45, origin: { x: 0.8, y: 0 } });
  hasFired = true;
}
