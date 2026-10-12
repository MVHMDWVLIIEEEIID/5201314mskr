import { useEffect, useState } from "react";
import coverImg from "../assets/cover.jpg";

export default function AudioToast({ audioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setVolume(Math.round(audio.volume * 100));
      setIsMuted(audio.muted);
    };

    setIsPlaying(!audio.paused);
    onVolumeChange();
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    if (audioRef.current) {
      audioRef.current.volume = nextVolume / 100;
      audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
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
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause song" : "Play song"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.2)] transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
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
        <div className="group/volume relative">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute song" : "Mute song"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            {isMuted ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="m16 9 5 5m0-5-5 5" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
          </button>
          <label className="sr-only" htmlFor="final-stage-volume">
            Volume
          </label>
          <input
            id="final-stage-volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            aria-label={`Volume: ${volume}%`}
            style={{ "--volume-progress": `${volume}%` }}
            className="volume-slider absolute bottom-[5.75rem] left-1/2 h-2 w-24 -translate-x-1/2 -rotate-90 cursor-pointer opacity-0 transition-opacity group-hover/volume:opacity-100 group-focus-within/volume:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
