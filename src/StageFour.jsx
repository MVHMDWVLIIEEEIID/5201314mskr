import { useEffect, useState } from "react";
import shut from "./assets/shut.gif";
import side from "./assets/side.gif";
import billie from "./assets/billie.png";
import smile from "./assets/smile.gif";
import shyc from "./assets/shyc.gif";
import come from "./assets/come.gif";
import sonic from "./assets/sonic-side-eye.gif";
import Phase from "./components/Phase.jsx";
import BirthdayCelebration from "./components/BirthdayCelebration.jsx";
import StagePiano from "./components/StagePiano.jsx";
import { preloadPiano } from "./lib/pianoAudio.js";

export default function StageFour({
  onNextStage,
  onPhaseChange,
  initialPhase = 1,
}) {
  const [answer, setAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("idle");
  const correctAnswer = "i love you";
  const funnyAnswers = ["13", "thirteen", "number", "thing", "item", "1+3"];
  const [isStupidAnswer, setIsStupidAnswers] = useState(false);
  const [phase, setPhase] = useState(initialPhase);
  const [birthdayMessageClosed, setBirthdayMessageClosed] = useState(false);

  useEffect(() => onPhaseChange?.(phase), [onPhaseChange, phase]);

  function onCandlesCompleted() {
    setBirthdayMessageClosed(true);
  }

  useEffect(() => {
    preloadPiano();
  }, []);

  const isCorrect = answerStatus === "correct";

  function normalizeAnswer(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function checkAnswer(event) {
    event.preventDefault();
    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

    if (funnyAnswers.includes(normalizedAnswer)) {
      setIsStupidAnswers(true);
      setAnswerStatus("incorrect");
      setTimeout(() => {
        setIsStupidAnswers(false);
      }, 4000);

      return;
    }

    setAnswerStatus(
      normalizedAnswer === normalizedCorrectAnswer ? "correct" : "incorrect",
    );
  }

  function renderAnswerForm() {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-20">
        <img
          src={billie}
          alt="side looking cat"
          className="w-full scale-180 object-contain"
        />
        <form
          onSubmit={checkAnswer}
          className="flex w-full max-w-md flex-col items-center gap-5"
        >
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
            className={`w-full select-text rounded-lg border-2 bg-transparent py-2 text-center text-xl outline-none transition ${
              answerStatus === "correct"
                ? "border-green-500 text-green-500 focus:ring-green-500/50"
                : answerStatus === "incorrect"
                  ? "border-red-500 text-red-500 focus:ring-red-500/50"
                  : "border-blue-400 text-blue-400 focus:ring-blue-400/50"
            }`}
          />
          <button
            type="submit"
            className={`w-full rounded-lg border px-4 py-1.5 text-sm font-semibold transition focus:outline-none ${
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
      </div>
    );
  }

  const phasesData = [
    {
      phaseNo: 1,
      text: "Now Hush Your Mush! Just Walk With Me :3",
      centerContent: (
        <img
          src={shut}
          alt="shut "
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 2,
      text: "U Can Talk Actually, So Let Me Give You a Puzzle",
      centerContent: (
        <img
          src={side}
          alt="side looking cat"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 3,
      text: isCorrect
        ? "*Blushes Speechlessly*"
        : isStupidAnswer
          ? "Are We Fr Bro ?"
          : "Decode The Sequence To Find The Hidden Answer.",
      centerContent: renderAnswerForm(),
      isQuestion: true,
      questionCompleted: isCorrect,
    },
    {
      phaseNo: 4,
      text: "Awwwwww , I Knew That You Have Feelings For Me",
      centerContent: (
        <img
          src={smile}
          alt="smiling cat"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 5,
      text: "Ok Me Too That's Why There's Smth Waiting For You Next",
      centerContent: (
        <img
          src={shyc}
          alt="smiling cat"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 6,
      text: "Surprise!!!",
      delayedText: "Turn off the Candles",
      delayedTextDelay: 5000,
      delayedTextType: "replace",
      centerContent: (
        <BirthdayCelebration onCandlesCompleted={() => onCandlesCompleted()} />
      ),
      showContinueButton: birthdayMessageClosed,
      centerContentClassName: "absolute inset-0 bottom-28 z-0",
    },
    {
      phaseNo: 7,
      text: "Come With Me, I Know Another Thing We Can Do",
      centerContent: (
        <img
          src={come}
          alt="smiling cat"
          className="h-full w-full rounded-2xl object-contain"
        />
      ),
    },
    {
      phaseNo: 8,
      text: "",
      noTypeIt: true,
      centerContent: <StagePiano onContinue={() => handleNext()} />,
      centerContentClassName: "absolute bottom-0 left-0 w-full z-0",
      showContinueButton: false,
    },
    {
      phaseNo: 9,
      text: "ضحكنا وهزرنا مش خلاص بقا ولا اي",
      centerContent: (
        <img
          src={sonic}
          alt="smiling cat"
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
    for (const p of phasesData) {
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
