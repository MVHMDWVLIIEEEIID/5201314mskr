import { useEffect, useState } from "react";
import coverImg from "../assets/cover.jpg";

export default function AudioToast({ audioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    setIsPlaying(!audio.paused);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };

  return (
    <div
      style={{ position: "fixed", bottom: "1.25rem", left: "1.25rem" }}
      className="audio-toast-in fixed! bottom-5! left-5! z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-white/10 bg-black/90 p-2.5 pr-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl will-change-[transform,opacity] sm:bottom-8! sm:left-8! sm:gap-4"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg sm:h-16 sm:w-16">
        <img
          src={coverImg}
          alt="Floating In Reverie cover"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold tracking-wide text-white">
          Floating In Reverie
        </p>
        <p className="truncate text-xs font-medium text-white/60">
          Moayad Aliabal
        </p>
      </div>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause song" : "Play song"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.2)] transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
      >
        {isPlaying ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg
            className="ml-0.5 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
