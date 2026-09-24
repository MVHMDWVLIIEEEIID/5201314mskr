// src/components/BirthdayCelebration.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { CANDLE_COUNT, fireConfettiFromTop } from "../utilities/confettiUtils";
import BalloonsBackground from "./BalloonsBackground";
import CakeWithCandles from "./CakeWithCandles";
import BirthdayMessageModal from "./BirthdayMessageModal";

export default function BirthdayCelebration({
  onCandlesCompleted,
  onCandlesStatusChange,
}) {
  const [litCandles, setLitCandles] = useState(() =>
    Array.from({ length: CANDLE_COUNT }, () => true),
  );
  const [revealedCandles, setRevealedCandles] = useState(() =>
    Array.from({ length: CANDLE_COUNT }, () => false),
  );
  const [isBirthdayMessageOpen, setIsBirthdayMessageOpen] = useState(false);
  const hasOpenedBirthdayMessage = useRef(false);

  const handleBirthdayMessageClose = useCallback(() => {
    setIsBirthdayMessageOpen(false);
    onCandlesCompleted?.();
  }, [onCandlesCompleted]);

  useEffect(() => {
    onCandlesStatusChange?.(litCandles.every(Boolean));
  }, [litCandles, onCandlesStatusChange]);

  useEffect(() => {
    const revealTimers = Array.from({ length: CANDLE_COUNT }, (_, index) =>
      window.setTimeout(() => {
        setRevealedCandles((current) =>
          current.map((isRevealed, candleIndex) =>
            candleIndex === index ? true : isRevealed,
          ),
        );
      }, index * 180),
    );

    return () => revealTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // Restored: Calculates and triggers the top cascade every 2800ms
  useEffect(() => {
    fireConfettiFromTop();

    const burst = window.setInterval(() => {
      fireConfettiFromTop();
    }, 2800);

    return () => window.clearInterval(burst);
  }, []);

  // Cleaned: Now strictly handles the Enter key event listener for the message
  useEffect(() => {
    if (!isBirthdayMessageOpen) return undefined;

    function handleCloseKey(event) {
      if (event.code === "Enter" && !event.repeat) {
        event.preventDefault();
        handleBirthdayMessageClose();
      }
    }

    window.addEventListener("keydown", handleCloseKey);
    return () => {
      window.removeEventListener("keydown", handleCloseKey);
    };
  }, [handleBirthdayMessageClose, isBirthdayMessageOpen]);

  function turnOffCandle(index) {
    setLitCandles((current) => {
      if (!current[index] || hasOpenedBirthdayMessage.current) return current;

      const next = current.map((isLit, candleIndex) =>
        candleIndex === index ? false : isLit,
      );

      if (!next.some((isLit) => isLit) && !hasOpenedBirthdayMessage.current) {
        hasOpenedBirthdayMessage.current = true;
        setIsBirthdayMessageOpen(true);
      }

      return next;
    });
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      <BalloonsBackground />
      <div className="absolute left-[25%] right-[25%] top-[-7%] z-20 flex justify-center">
        <svg viewBox="0 0 1200 300" className="h-auto w-full overflow-visible">
          <path
            d="M -72.5,50 L -72.5,160 L -50,130 L -27.5,160 L -27.5,50 Z"
            fill="white"
          />
          <path
            d="M 1227.5,50 L 1227.5,160 L 1250,130 L 1272.5,160 L 1272.5,50 Z"
            fill="white"
          />
          <path
            id="birthday-curve"
            d="M -50,50 Q 600,380 1250,50"
            fill="none"
            stroke="white"
            strokeWidth="55"
            strokeLinecap="round"
          />

          <text
            className="text-4xl font-extrabold uppercase"
            fill="black"
            dominantBaseline="central"
          >
            <textPath href="#birthday-curve" startOffset="4%">
              {"Stay Safe Babe 💙 HAPPY 19TH BIRTHDAY MY BELOVED 💙 I Love You MWAH".toUpperCase()}
            </textPath>
          </text>
        </svg>
      </div>
      <CakeWithCandles
        litCandles={litCandles}
        revealedCandles={revealedCandles}
        turnOffCandle={turnOffCandle}
      />
      <BirthdayMessageModal
        isOpen={isBirthdayMessageOpen}
        onClose={handleBirthdayMessageClose}
      />
    </div>
  );
}
