import { useEffect, useState } from "react";
import StageOne from "./StageOne.jsx";
import StageTwo from "./StageTwo.jsx";
import StageThree from "./StageThree.jsx";
import StageFour from "./StageFour.jsx";
import FinalStage from "./FinalStage.jsx";

const developmentBypass = {
  enabled: false,
  stage: 5,
  phase: 1,
};

export default function LoggedIn({ onLogout }) {
  const [stage, setStage] = useState(() => {
    try {
      const savedStage = Number(localStorage.getItem("mybeloved:stage"));
      if (Number.isInteger(savedStage) && savedStage >= 1 && savedStage <= 5) {
        return savedStage;
      }
    } catch {
      // Use the normal initial stage when local storage is unavailable.
    }
    return developmentBypass.enabled ? developmentBypass.stage : 1;
  });
  const [phase, setPhase] = useState(() => {
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

  const getInitialPhase = (currentStageNumber) => {
    if (stage === currentStageNumber) {
      return phase;
    }
    return 1;
  };

  function advanceToStage(nextStage) {
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
    stageContent = <FinalStage />;
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
    </>
  );
}
