import TypeIt from "typeit";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import FadeContent from "./FadeContent.jsx";
import enterKey from "../assets/enter.png";
import spacebar from "../assets/spacebar.png";

export default function Phase({
  text,
  textAppend = "",
  delayedText = "",
  delayedTextDelay = 0,
  delayedTextType = "suffix",
  centerContent,
  isQuestion = false,
  questionCompleted = false,
  isFinalPhase = false,
  continueLabel = "to continue",
  onContinue,
  continueDelay = 1000,
  showContinueButton = true,
  centerContentClassName = "absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2",
  textClassName = "",
  buttonLabel = "Press",
  noTypeIt = false,
}) {
  const continueKey = isFinalPhase ? "Enter" : "Space";
  const continueKeyImage = isFinalPhase ? enterKey : spacebar;
  const continueKeyAlt = isFinalPhase ? "Enter key" : "Spacebar";
  const dialogueRef = useRef(null);
  const appendedDialogueRef = useRef(null);
  const continueButtonRef = useRef(null);
  const delayedTypeItRef = useRef(null);
  const hasAppendedText = useRef(false);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [hasTextCompletedOnce, setHasTextCompletedOnce] = useState(false);
  const [isPromptReady, setIsPromptReady] = useState(false);

  useEffect(() => {
    const dialogueElement = dialogueRef.current;
    let hasBeenDestroyed = false;

    if (!dialogueElement) return undefined;

    dialogueElement.innerHTML = "";
    hasAppendedText.current = false;
    setIsTextComplete(false);
    setIsPromptReady(false);

    if (noTypeIt) {
      dialogueElement.innerHTML = text;
      setIsTextComplete(true);
      setHasTextCompletedOnce(true);
      return () => {
        if (dialogueElement.isConnected) dialogueElement.innerHTML = "";
      };
    }

    const typeIt = new TypeIt(dialogueElement, {
      speed: 75,
      deleteSpeed: 50,
      startDelay: 300,
      waitUntilVisible: true,
      cursorChar: "_",
    })
      .type(text)
      .exec((instance) => {
        hasBeenDestroyed = true;
        instance.destroy(true);
        setIsTextComplete(true);
        setHasTextCompletedOnce(true);
      })
      .go();

    return () => {
      if (!hasBeenDestroyed) typeIt.destroy();
      if (dialogueElement.isConnected) dialogueElement.innerHTML = "";
    };
  }, [text, noTypeIt]);

  useEffect(() => {
    if (!textAppend || !isTextComplete || hasAppendedText.current)
      return undefined;

    hasAppendedText.current = true;
    const appendElement = appendedDialogueRef.current;
    let hasBeenDestroyed = false;

    if (!appendElement) return undefined;

    appendElement.innerHTML = "";

    if (noTypeIt) {
      appendElement.innerHTML = textAppend;
      return () => {
        if (appendElement.isConnected) appendElement.innerHTML = "";
      };
    }

    const typeIt = new TypeIt(appendElement, {
      speed: 75,
      deleteSpeed: 50,
      waitUntilVisible: true,
      cursorChar: "_",
    })
      .type(textAppend)
      .exec((instance) => {
        hasBeenDestroyed = true;
        instance.destroy(true);
      })
      .go();

    return () => {
      if (!hasBeenDestroyed) typeIt.destroy();
      if (appendElement.isConnected) appendElement.innerHTML = "";
    };
  }, [isTextComplete, textAppend, noTypeIt]);

  useEffect(() => {
    if (!delayedText || !isTextComplete) return undefined;

    if (noTypeIt) {
      const delayedTextTimer = window.setTimeout(() => {
        const isReplacement = delayedTextType === "replace";
        const targetElement = isReplacement
          ? dialogueRef.current
          : appendedDialogueRef.current;
        if (targetElement) {
          if (isReplacement) targetElement.innerHTML = delayedText;
          else targetElement.innerHTML += delayedText;
        }
      }, delayedTextDelay);
      return () => window.clearTimeout(delayedTextTimer);
    }

    const delayedTextTimer = window.setTimeout(() => {
      const isReplacement = delayedTextType === "replace";
      const targetElement = isReplacement
        ? dialogueRef.current
        : appendedDialogueRef.current;

      if (!targetElement) return;

      const previousDelayedTypeIt = delayedTypeItRef.current;
      if (previousDelayedTypeIt && !previousDelayedTypeIt.hasBeenDestroyed()) {
        previousDelayedTypeIt.typeIt.destroy();
      }

      let hasBeenDestroyed = false;
      const typeIt = new TypeIt(targetElement, {
        speed: 75,
        deleteSpeed: 50,
        waitUntilVisible: true,
        cursorChar: "_",
        startDelete: isReplacement,
      });

      typeIt
        .type(delayedText)
        .exec((instance) => {
          hasBeenDestroyed = true;
          instance.destroy(true);
        })
        .go();

      delayedTypeItRef.current = {
        typeIt,
        hasBeenDestroyed: () => hasBeenDestroyed,
      };
    }, delayedTextDelay);

    return () => {
      window.clearTimeout(delayedTextTimer);
      const delayedTypeIt = delayedTypeItRef.current;
      if (delayedTypeIt && !delayedTypeIt.hasBeenDestroyed())
        delayedTypeIt.typeIt.destroy();
      delayedTypeItRef.current = null;
    };
  }, [
    delayedText,
    delayedTextDelay,
    delayedTextType,
    isTextComplete,
    text,
    noTypeIt,
  ]);

  useEffect(() => {
    if (!isTextComplete || (isQuestion && !questionCompleted)) return undefined;
    const promptTimer = window.setTimeout(
      () => setIsPromptReady(true),
      isQuestion ? 0 : continueDelay,
    );
    return () => window.clearTimeout(promptTimer);
  }, [continueDelay, isQuestion, isTextComplete, questionCompleted]);

  useEffect(() => {
    if (!isPromptReady || !showContinueButton) return undefined;

    continueButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.code === continueKey && !event.repeat) {
        event.preventDefault();
        onContinue();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [continueKey, isPromptReady, onContinue, showContinueButton]);

  return (
    <main className="relative isolate flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white">
      <h1
        className={`absolute bottom-10 left-0 z-10 w-full px-6 text-center text-4xl font-semibold ${textClassName}`}
      >
        <span ref={dialogueRef} />
        <span ref={appendedDialogueRef} />
      </h1>

      {(isTextComplete || hasTextCompletedOnce) && centerContent && (
        <FadeContent duration={0.6} className={centerContentClassName}>
          {centerContent}
        </FadeContent>
      )}

      {isPromptReady && showContinueButton && (
        <motion.button
          ref={continueButtonRef}
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={onContinue}
          onKeyDown={(event) => {
            const blockedKey = continueKey === "Space" ? "Enter" : "Space";
            if (event.code === blockedKey) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          aria-label={`Press ${continueKey} to continue`}
          className="absolute bottom-4 right-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none"
        >
          <span>{buttonLabel}</span>
          <img
            src={continueKeyImage}
            alt={continueKeyAlt}
            className={
              continueKey === "Enter"
                ? "h-7 object-contain"
                : "h-7 w-24 object-contain"
            }
          />
          <span>{continueLabel}</span>
        </motion.button>
      )}
    </main>
  );
}
