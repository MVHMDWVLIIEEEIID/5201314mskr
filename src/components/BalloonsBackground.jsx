// BalloonsBackground.jsx
import { motion } from "motion/react";

const BALLOONS = [
  // Added a unique "sway" array to each balloon to randomize their rotation angles
  {
    x: "4%",
    delay: 0,
    color: "#60a5fa",
    size: 58,
    duration: 6.2,
    sway: [-10, 12, -8, 5],
  },
  {
    x: "14%",
    delay: 0.55,
    color: "#93c5fd",
    size: 44,
    duration: 5.4,
    sway: [8, -15, 10, -5],
  },
  {
    x: "24%",
    delay: 0.2,
    color: "#3b82f6",
    size: 52,
    duration: 6.8,
    sway: [-12, 8, -14, 6],
  },
  {
    x: "36%",
    delay: 0.9,
    color: "#bfdbfe",
    size: 40,
    duration: 5.1,
    sway: [15, -10, 12, -8],
  },
  {
    x: "72%",
    delay: 0.15,
    color: "#93c5fd",
    size: 50,
    duration: 6.4,
    sway: [-8, 15, -5, 10],
  },
  {
    x: "82%",
    delay: 0.75,
    color: "#60a5fa",
    size: 42,
    duration: 5.9,
    sway: [10, -12, 8, -15],
  },
  {
    x: "92%",
    delay: 0.45,
    color: "#3b82f6",
    size: 54,
    duration: 6.6,
    sway: [-15, 10, -12, 8],
  },
  {
    x: "8%",
    delay: 1.4,
    color: "#bfdbfe",
    size: 36,
    duration: 5.3,
    sway: [12, -8, 15, -10],
  },
  {
    x: "75%",
    delay: 1.25,
    color: "#93c5fd",
    size: 38,
    duration: 5.6,
    sway: [-10, 14, -8, 12],
  },
];

function Balloon({ x, delay, color, size, duration, sway }) {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 z-20 -translate-x-1/2"
      style={{ left: x }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{
        y: "-120vh",
        opacity: [0, 1, 1, 0],
        rotate: sway, // Dynamically maps to the unique sway pattern
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        opacity: { duration, times: [0, 0.08, 0.85, 1], delay },
        rotate: {
          duration: duration * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{ width: size, height: size * 1.25 }}
      >
        {/* Main Balloon Body */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff8, transparent 45%), ${color}`,
            boxShadow: `0 0 24px ${color}88`,
            // Custom border radius for a teardrop balloon shape
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          }}
        />
        {/* Balloon Knot */}
        <div
          className="absolute -bottom-1.5 w-0 h-0"
          style={{
            borderLeft: `${size * 0.15}px solid transparent`,
            borderRight: `${size * 0.15}px solid transparent`,
            borderBottom: `${size * 0.25}px solid ${color}`,
          }}
        />
        {/* Balloon String */}
        <div
          className="absolute top-full h-24 w-px mt-1"
          style={{ background: `linear-gradient(${color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

export default function BalloonsBackground() {
  return (
    // Changed from absolute to fixed with viewport dimensions
    <div className="pointer-events-none fixed inset-0 z-10 h-screen w-screen">
      {BALLOONS.map((balloon) => (
        <Balloon key={`${balloon.x}-${balloon.delay}`} {...balloon} />
      ))}
    </div>
  );
}
  