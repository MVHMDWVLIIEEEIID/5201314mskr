import { useEffect, useRef, useState } from "react";
import StageOne from "./StageOne.jsx";
import StageTwo from "./StageTwo.jsx";
import StageThree from "./StageThree.jsx";
import StageFour from "./StageFour.jsx";
import FinalStage from "./FinalStage.jsx";
import finalStageTrack from "./assets/Floating in Reverie.mp3";
import { preloadStageAssets } from "./lib/stageAssetPreloader.js";

// Edit these while developing to choose where the app starts.
// This configuration is ignored in production builds.
const developmentBypass = {
  enabled: false,
  stage: 4,
  phase: 10,
};
const shouldBypassProgress = import.meta.env.DEV && developmentBypass.enabled;

export default function LoggedIn({ onLogout }) {
  const finalAudioRef = useRef(null);
  const [stage, setStage] = useState(() => {
    if (shouldBypassProgress) {
      return developmentBypass.stage;
    }

    try {
      const savedStage = Number(localStorage.getItem("mybeloved:stage"));
      if (Number.isInteger(savedStage) && savedStage >= 1 && savedStage <= 5) {
        return savedStage;
      }
    } catch {
      // Use the normal initial stage when local storage is unavailable.
    }
    return 1;
  });
  const [phase, setPhase] = useState(() => {
    if (shouldBypassProgress) {
      return developmentBypass.phase;
    }

    try {
      const savedPhase = Number(localStorage.getItem("mybeloved:phase"));
      return Number.isInteger(savedPhase) && savedPhase >= 1 ? savedPhase : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mybeloved:stage", String(stage));
      localStorage.setItem("mybeloved:phase", String(phase));
    } catch {
      // Progress remains available for this session if local storage is unavailable.
    }
  }, [stage, phase]);

  useEffect(() => {
    // On login this warms stages 1 and 2. Each later stage warms itself and
    // the following stage while the visitor is still progressing.
    preloadStageAssets(stage);
    preloadStageAssets(stage + 1);
  }, [stage]);

  const getInitialPhase = (currentStageNumber) => {
    if (stage === currentStageNumber) {
      return phase;
    }
    return 1;
  };

  function advanceToStage(nextStage) {
    // Calling play in this click handler retains the browser's user activation.
    // Calling it only after FinalStage renders can be rejected as autoplay.
    if (nextStage === 5 && finalAudioRef.current) {
      const audio = finalAudioRef.current;
      audio.volume = 0.75;
      audio.play().catch((err) => console.log("Playback blocked:", err));
    }

    setStage(nextStage);
    setPhase(1);
  }

  function handlePhaseChange(nextPhase) {
    setPhase(nextPhase);
  }

  let stageContent;

  if (stage === 1) {
    stageContent = (
      <StageOne
        onNextStage={() => advanceToStage(2)}
        onPhaseChange={handlePhaseChange}
        initialPhase={getInitialPhase(1)}
      />
    );
  } else if (stage === 2) {
    stageContent = (
      <StageTwo
        onNextStage={() => advanceToStage(3)}
        onPhaseChange={handlePhaseChange}
        initialPhase={getInitialPhase(2)}
      />
    );
  } else if (stage === 3) {
    stageContent = (
      <StageThree
        onNextStage={() => advanceToStage(4)}
        onPhaseChange={handlePhaseChange}
        initialPhase={getInitialPhase(3)}
      />
    );
  } else if (stage === 4) {
    stageContent = (
      <StageFour
        onNextStage={() => advanceToStage(5)}
        onPhaseChange={handlePhaseChange}
        initialPhase={getInitialPhase(4)}
      />
    );
  } else {
    stageContent = <FinalStage audioRef={finalAudioRef} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={onLogout}
        className="fixed left-3 top-3 z-10000 rounded-md opacity-60 bg-black border border-red-500 text-red-500 px-3 py-1.5 text-xs font-bold shadow-lg shadow-red-950/40 transition hover:opacity-100 hover:bg-red-500 hover:text-black active:scale-95"
        aria-label="Log out"
      >
        Logout
      </button>
      {stageContent}
      <audio
        ref={finalAudioRef}
        src={finalStageTrack}
        preload={stage >= 4 ? "auto" : "none"}
        playsInline
      />
    </>
  );
}
