// BirthdayMessageModal.jsx
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import enterKey from "../assets/enter.png";

// Generates 40 hearts distributed symmetrically for a continuous flow from the bottom
const HEARTS = Array.from({ length: 40 }, (_, i) => {
  const isLeft = i % 2 === 0;
  return {
    id: i,
    // Left side: 5% to 35%. Right side: 65% to 95%. This fixes the shift and makes them perfectly symmetric.
    left: isLeft ? `${Math.random() * 30 + 5}%` : `${Math.random() * 30 + 65}%`,
    // Positive delay (0 to 15s) ensures they all start from the bottom one by one, creating an endless stream without grouping.
    delay: Math.random() * 15,
    duration: Math.random() * 6 + 8, // 8 to 14 seconds to float to the top
    scale: Math.random() * 0.8 + 0.8, // Sizes between 0.8 and 1.6
    color: Math.random() > 0.5 ? "#60A5FA" : "#FFFFFF",
  };
});

export default function BirthdayMessageModal({ isOpen, onClose }) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 px-6 backdrop-blur-md overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="birthday-message-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Floating Hearts Animation */}
          {HEARTS.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute -bottom-20 z-0 pointer-events-none"
              style={{ left: heart.left }}
              initial={{ y: 0, opacity: 0, scale: heart.scale }}
              animate={{
                y: "-120vh",
                opacity: [0, 1, 1, 0],
                x: ["-20px", "20px", "-20px"],
              }}
              transition={{
                y: {
                  duration: heart.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: heart.delay,
                },
                opacity: {
                  duration: heart.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: heart.delay,
                },
                x: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: heart.delay,
                },
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={heart.color}
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 10px rgba(96,165,250,0.6))" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}

          {/* Modal Content */}
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-[24px] border border-blue-400 bg-black p-8 text-center text-white z-10 relative"
            initial={{ y: 24, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ boxShadow: "0 0 30px rgba(96,165,250,0.2)" }}
          >
            <div className="relative flex flex-col">
              <h2
                id="birthday-message-title"
                className="text-center text-3xl font-bold text-blue-400 sm:text-4xl"
              >
                Happy Birthday Kholoud
              </h2>
              <div className="mt-6 space-y-4 text-left text-[15px] leading-relaxed text-gray-200 sm:text-base">
                <p>
                  As you step into this new year of your life, my biggest wish
                  is that it brings you immense success, joy, and fulfillment. I
                  hope you achieve everything you set your mind to, and that
                  your path ahead is filled with the kind of bright, beautiful
                  moments you deserve in everything you do.
                </p>
                <p>
                  Also I want to tell you how incredibly thankful I am that you
                  are in my life. You bring a pure, overwhelming happiness to my
                  world that changes everything for the better.
                </p>
                <p>
                  Honestly, every single night since the exact day we met, you
                  have been the very last thought on my mind before I fall
                  asleep. I love you more deeply than words can ever capture,
                  and my greatest hope for you this year—and always—is that you
                  stay safe, protected, and truly happy.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={onClose}
            className="absolute bottom-4 right-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none z-10"
            aria-label="Press Enter to continue"
          >
            <span>Press</span>
            <img
              src={enterKey}
              alt="Enter key"
              className="h-7 object-contain"
            />
            <span>To Close The Message</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
