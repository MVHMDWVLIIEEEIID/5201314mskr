// FinalStage.jsx
import { useState, useRef, useEffect } from "react";
import AudioToast from "./components/AudioToast";
import ModernVerticalSlider from "./components/ModernVerticalSlider";
import CinematicSplitText from "./components/CinematicSplitText";
import mp3 from "./assets/Floating in Reverie.mp3";

export default function FinalStage() {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // Start playback immediately; browsers may still require a user gesture.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Autoplay blocked:", err));
    }
  }, []);

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

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black selection:bg-white/20">
      <audio
        ref={audioRef}
        src={mp3}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

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
