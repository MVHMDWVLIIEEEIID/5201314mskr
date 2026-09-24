import { useEffect, useState } from "react";
import { DatePicker, DateField, Calendar, Label } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import Phase from "./components/Phase.jsx";
import evil from "./assets/evil.gif";
import fish from "./assets/fish.gif";
import look from "./assets/look.gif";
import reaction from "./assets/reaction.gif";
import watches from "./assets/watches.png";

const correctAnswer = "mvhmdwvliieeeiid";
const correctDate = "2022-08-13";

export default function StageTwo({ onNextStage, onPhaseChange, initialPhase = 1 }) {
  const [phase, setPhase] = useState(initialPhase);
  useEffect(() => onPhaseChange?.(phase), [onPhaseChange, phase]);
  const [answer, setAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("idle");
  const [dateAnswer, setDateAnswer] = useState("");
  const [dateAnswerStatus, setDateAnswerStatus] = useState("idle");
  const isCorrect = answerStatus === "correct";
  const isDateCorrect = dateAnswerStatus === "correct";

  function checkAnswer(event) {
    event.preventDefault();
    const normalizedAnswer = answer.trim().toLowerCase();
    setAnswerStatus(
      normalizedAnswer === correctAnswer ? "correct" : "incorrect",
    );
  }

  function handleDateChange(date) {
    setDateAnswer(date?.toString() ?? "");
    setDateAnswerStatus("idle");
  }

  function checkDateAnswer(event) {
    event.preventDefault();
    setDateAnswerStatus(dateAnswer === correctDate ? "correct" : "incorrect");
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

  function renderDateAnswerForm() {
    let selectedDate;
    try {
      selectedDate = dateAnswer ? parseDate(dateAnswer) : null;
    } catch {
      selectedDate = null;
    }

    return (
      <form
        onSubmit={checkDateAnswer}
        className="relative -top-8 flex flex-col items-center gap-5"
      >
        <DatePicker
          className="dark w-80"
          name="date"
          value={selectedDate}
          isDisabled={isDateCorrect}
          onChange={handleDateChange}
          aria-label="Choose the date"
        >
          <Label>Pick Up a Date</Label>
          <DateField.Group
            className={`min-h-14 rounded-lg border-2 px-4 text-lg ${
              dateAnswerStatus === "correct"
                ? "border-green-500"
                : dateAnswerStatus === "incorrect"
                  ? "border-red-500"
                  : "border-blue-400"
            }`}
            fullWidth
          >
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DatePicker.Popover
            className="dark"
            placement="bottom"
            shouldFlip={false}
          >
            <Calendar className="dark-calendar" aria-label="Event date">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading className="text-white" />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => <Calendar.Cell date={date} />}
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>
        <button
          type="submit"
          className={`w-80 rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none ${
            dateAnswerStatus === "correct"
              ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
              : dateAnswerStatus === "incorrect"
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
          }`}
        >
          {isDateCorrect ? "Correct!" : "Check"}
        </button>
      </form>
    );
  }

  const phasesData = [
    {
      phaseNo: 1,
      text: "Let's Start With Basic Questions",
      centerContent: (
        <img
          src={watches}
          alt="A pair of watches"
          className="h-full w-full object-contain"
        />
      ),
    },
    {
      phaseNo: 2,
      text: "What Is My Name ?",
      delayedText: isCorrect ? "" : " (Double Name Btw)",
      delayedTextDelay: 15000,
      delayedTextType: "suffix",
      centerContent: renderAnswerForm(),
      isQuestion: true,
      questionCompleted: isCorrect,
      centerContentClassName: "relative z-10 mt-8",
    },
    {
      phaseNo: 3,
      text: "That Was Easy, I Still Don't Trust You",
      centerContent: (
        <img
          src={fish}
          alt="A fish swimming"
          className="h-full w-full object-contain"
        />
      ),
    },
    {
      phaseNo: 4,
      text: "What Date Changed My Life Forever?",
      delayedText: isDateCorrect ? "" : " (U Dont Remember fr ⁉️)",
      delayedTextDelay: 15000,
      delayedTextType: "suffix",
      centerContent: renderDateAnswerForm(),
      isQuestion: true,
      questionCompleted: isDateCorrect,
      centerContentClassName: "relative z-10 mt-8",
    },
    {
      phaseNo: 5,
      text: "Omg! It's You, My Beloved Girl",
      centerContent: (
        <img
          src={reaction}
          alt="A reaction"
          className="h-full w-full object-contain"
        />
      ),
    },
    {
      phaseNo: 6,
      text: "Or Maybe Not, Maybe You're Just Trying To Fool Me",
      centerContent: (
        <img
          src={look}
          alt="A suspicious look"
          className="h-full w-full object-contain"
        />
      ),
    },
    {
      phaseNo: 7,
      text: "Let Me See If You're The One I've Been Waiting For, IN THE FINAL STAGE 😈",
      centerContent: (
        <img
          src={evil}
          alt="An evil grin"
          className="h-full w-full object-contain"
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
