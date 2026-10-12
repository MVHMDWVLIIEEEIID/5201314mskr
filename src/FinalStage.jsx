// FinalStage.jsx
import { useState, useEffect } from "react";
import AudioToast from "./components/AudioToast";
import ModernVerticalSlider from "./components/ModernVerticalSlider";
import CinematicSplitText from "./components/CinematicSplitText";

export default function FinalStage({ audioRef }) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // This also covers direct navigation to the final stage. Normal stage
  // progression starts playback in the preceding click handler.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.75;

    const playAudio = () => audio.play().catch(() => {});

    playAudio();

    // Browsers prohibit audible playback when this stage is opened directly
    // (for example, via the development stage bypass). Start as soon as the
    // visitor performs their first normal interaction in that case.
    const resumeAfterInteraction = () => {
      if (audio.paused) playAudio();
    };

    window.addEventListener("pointerdown", resumeAfterInteraction, {
      once: true,
    });
    window.addEventListener("keydown", resumeAfterInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeAfterInteraction);
      window.removeEventListener("keydown", resumeAfterInteraction);
    };
  }, [audioRef]);

  // timeupdate events are relatively infrequent, so sample the audio clock on
  // animation frames to keep the text fade synchronized with playback.
  useEffect(() => {
    let animationFrame;

    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio?.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current?.duration) return;
    setProgress(audioRef.current.currentTime / audioRef.current.duration);
  };

  const handleAudioEnded = () => {
    const audio = audioRef.current;
    setProgress(1);
    setShowEndScreen(true);

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.log("Replay blocked:", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const updateDuration = () => setDuration(audio.duration);

    updateDuration();
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [audioRef]);

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black selection:bg-white/20">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          showEndScreen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <CinematicSplitText progress={progress} duration={duration} />
        <ModernVerticalSlider progress={progress} />
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          showEndScreen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showEndScreen}
      >
        <p className="m-0 font-light text-white text-8xl">The End</p>
      </div>

      <AudioToast audioRef={audioRef} />
    </main>
  );
}
