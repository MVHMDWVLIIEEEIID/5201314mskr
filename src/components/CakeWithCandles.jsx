// CakeWithCandles.jsx
import { motion } from "motion/react";
import { CANDLE_COUNT } from "../utilities/confettiUtils";

export default function CakeWithCandles({
  litCandles,
  revealedCandles,
  turnOffCandle,
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-[58%] z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
    >
      <div className="relative flex flex-col items-center">
        <div className="mb-1 flex flex-col items-center">
          <div className="flex gap-1">
            {Array.from({ length: CANDLE_COUNT }, (_, i) => i).map((i) => (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  role="button"
                  tabIndex={litCandles[i] && revealedCandles[i] ? 0 : -1}
                  aria-label={`Turn off candle ${i + 1}`}
                  className={`mb-0.5 rounded-full bg-amber-300 ${i % 2 == 0 ? "h-5 w-2 -mt-2" : i === 9 ? "h-8 w-2 -mt-5" : "h-3 w-2"}`}
                  initial={{ opacity: 0 }}
                  animate={
                    litCandles[i] && revealedCandles[i]
                      ? {
                          scaleY: [1, 1.35, 0.85, 1.2, 1],
                          opacity: [0.85, 1, 0.7, 1, 0.85],
                          boxShadow: [
                            "0 0 6px rgba(252,211,77,0.5)",
                            "0 0 14px rgba(252,211,77,0.95)",
                            "0 0 6px rgba(252,211,77,0.5)",
                          ],
                        }
                      : { opacity: 0, scaleY: 0.4, boxShadow: "none" }
                  }
                  transition={{
                    duration: 0.7,
                    repeat: litCandles[i] && revealedCandles[i] ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  onMouseEnter={() => {
                    if (revealedCandles[i]) turnOffCandle(i);
                  }}
                  onFocus={() => {
                    if (revealedCandles[i]) turnOffCandle(i);
                  }}
                  onKeyDown={(event) => {
                    if (event.code === "Enter" || event.code === "Space") {
                      event.preventDefault();
                      turnOffCandle(i);
                    }
                  }}
                />
                <div className="h-5 w-1 rounded-sm bg-blue-200/80" />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="h-12 w-64 rounded-t-xl bg-blue-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.div
          className="h-18 w-74 rounded-b-2xl border border-blue-400/40 bg-blue-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ boxShadow: "0 18px 40px rgba(37,99,235,0.35)" }}
        />
      </div>
    </motion.div>
  );
}
