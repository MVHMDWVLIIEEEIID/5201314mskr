import { useEffect, useState } from "react";
import Phase from "./components/Phase.jsx";
import heyImage from "./assets/hey.jpg";
import sideLookCat from "./assets/sidelookcat.jpg";
import thumbUp from "./assets/thumbup.gif";

export default function StageOne({ onNextStage, onPhaseChange, initialPhase = 1 }) {
  const [phase, setPhase] = useState(initialPhase);

  useEffect(() => onPhaseChange?.(phase), [onPhaseChange, phase]);
  const phasesData = [
    {
      phaseNo: 1,
      text: "Hey Silly!",
      centerContent: (
        <img
          src={heyImage}
          alt="A minion saying hey"
          className="h-full w-full rounded-2xl object-cover"
        />
      ),
    },
    {
      phaseNo: 2,
      text: "How Did You Get In Here?",
      centerContent: (
        <img
          src={sideLookCat}
          alt="A cat looking to the side"
          className="h-full w-full rounded-2xl object-cover"
        />
      ),
    },
    {
      phaseNo: 3,
      text: "Ok, Let's Test If You're The Destined One.",
      centerContent: (
        <img
          src={thumbUp}
          alt="A thumbs-up emoji"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
      centerContentClassName:
        "absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl",
    },
  ];

  const FINAL_PHASE = phasesData.length;
  const isFinalPhase = phase === FINAL_PHASE;

  function handleNext() {
    if (!isFinalPhase) {
      setPhase((prev) => prev + 1);
    } else {
      onNextStage();
    }
  }

  function getPhaseContent() {
    for (let p of phasesData) {
      if (phase === p.phaseNo) {
        return p;
      }
    }
    return {};
  }

  return (
    <Phase
      key={phase}
      isFinalPhase={isFinalPhase}
      continueLabel={isFinalPhase ? "To Go to Next Stage" : "to continue"}
      onContinue={handleNext}
      {...getPhaseContent()}
    />
  );
}
