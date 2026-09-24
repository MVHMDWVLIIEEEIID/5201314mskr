import { useEffect, useState } from "react";
import Phase from "./components/Phase.jsx";
import talk from "./assets/talk.gif";
import myb from "./assets/myb.gif";
import shy from "./assets/shy.gif";
import fr from "./assets/fr.gif";
import happy from "./assets/happy.gif";

const correctAnswer = "كوتي كوتي كوتي";
const maxNoAttempts = 5;

export default function StageThree({ onNextStage, onPhaseChange, initialPhase = 1 }) {
  const [phase, setPhase] = useState(initialPhase);
  useEffect(() => onPhaseChange?.(phase), [onPhaseChange, phase]);
  const [answer, setAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("idle");
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [isNoChased, setIsNoChased] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCorrect = answerStatus === "correct";

  function normalizeAnswer(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function checkAnswer(event) {
    event.preventDefault();
    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);
    setAnswerStatus(
      normalizedAnswer === normalizedCorrectAnswer ? "correct" : "incorrect",
    );
  }

  function renderAnswerForm() {
    return (
      <form onSubmit={checkAnswer} className="flex flex-col items-center gap-5">
        <input
          type="text"
          autoFocus
          disabled={isCorrect}
          spellCheck={false}
          value={answer}
          placeholder="Type your answer here"
          onChange={(event) => {
            setAnswer(event.target.value);
            setAnswerStatus("idle");
          }}
          aria-label="Answer the question"
          className={`select-text rounded-lg border-2 bg-transparent px-8 py-4 text-center text-xl outline-none transition ${
            answerStatus === "correct"
              ? "border-green-500 text-green-500 focus:ring-green-500/50"
              : answerStatus === "incorrect"
                ? "border-red-500 text-red-500 focus:ring-red-500/50"
                : "border-blue-400 text-blue-400 focus:ring-blue-400/50"
          }`}
        />
        <button
          type="submit"
          className={`w-full rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none ${
            answerStatus === "correct"
              ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
              : answerStatus === "incorrect"
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
          }`}
        >
          {isCorrect ? "Correct!" : "Check"}
        </button>
      </form>
    );
  }

  function moveNoButton() {
    const x = Math.random() * 290 + 140;
    const y = Math.random() * 210 - 130;
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;

    setNoButtonOffset({
      x: x * directionX,
      y: y * directionY,
    });
  }

  function registerNoAttempt() {
    const nextCount = noAttempts + 1;
    setNoAttempts(nextCount);

    if (nextCount >= maxNoAttempts) {
      setIsNoChased(true);
    }

    moveNoButton();
  }

  function handleYesClick() {
    setPhase(FINAL_PHASE);
  }

  function renderFinalDecisionUI() {
    return (
      <div className="relative flex items-center justify-center gap-50">
        <button
          type="button"
          onMouseEnter={registerNoAttempt}
          onMouseDown={registerNoAttempt}
          onFocus={registerNoAttempt}
          onClick={(event) => {
            event.preventDefault();
            registerNoAttempt();
          }}
          style={{
            transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
          }}
          className="relative z-10 rounded-xl border border-red-400 bg-red-400/80 px-8 py-3 text-xl font-bold text-white shadow-lg shadow-red-500/30 transition duration-150 hover:scale-105 active:scale-95"
        >
          No
        </button>

        <img
          src={isNoChased ? fr : shy}
          alt="A reaction character"
          className="relative z-0 h-64 w-64 rounded-2xl object-contain"
        />

        <button
          type="button"
          onClick={handleYesClick}
          className="relative z-10 rounded-xl border border-blue-400 ${} bg-blue-400/80 px-8 py-3 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition duration-150"
          style={{
            scale: isHovered
              ? noAttempts * 0.05 + 1 * 1.05
              : noAttempts * 0.05 + 1,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Yes
        </button>
      </div>
    );
  }

  const phasesData = [
    {
      phaseNo: 1,
      text: "Since You Made It Here , You Better Be Her!!!",
      centerContent: (
        <img
          src={talk}
          alt="A character speaking"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 2,
      text: "What is Your Name On My Whatsapp?",
      centerContent: renderAnswerForm(),
      isQuestion: true,
      questionCompleted: isCorrect,
      centerContentClassName: "relative z-10",
    },
    {
      phaseNo: 3,
      text: "OH MY GOD , You Are Her!!! Baby Girl, We Have Finaly Met",
      centerContent: (
        <img
          src={myb}
          alt="pleading face"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 4,
      text: isNoChased
        ? "Are We Even For Real Bro? Just Come With Me"
        : "You Mind Going For A Walk With Me? :3",
      centerContent: renderFinalDecisionUI(),
      showContinueButton: false,
    },
    {
      phaseNo: 5,
      text: "I Knew It! I Knew You Would Say Yes! :3",
      centerContent: (
        <img
          src={happy}
          alt="A character speaking"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
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
      onContinue={handleNext}
      {...getPhaseContent()}
    />
  );
}
