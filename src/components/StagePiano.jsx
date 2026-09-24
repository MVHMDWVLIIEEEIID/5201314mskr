import { useEffect, useRef, useState, useMemo } from "react";
import { Piano, MidiNumbers } from "react-piano";
import { motion } from "motion/react";
import "react-piano/dist/styles.css";

import { usePianoEngine } from "../hooks/usePianoEngine";
import { usePianoShortcuts } from "../hooks/usePianoShortcuts";
import spacebar from "../assets/spacebar.png";

const FIRST_NOTE = MidiNumbers.fromNote("f1");
const LAST_NOTE = MidiNumbers.fromNote("b6");
const TIME_WINDOW_SECONDS = 3;

function formatTime(seconds) {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = Math.floor(absSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${isNegative ? "-" : ""}${minutes}:${remainingSeconds}`;
}

function getNotePosition(midi, firstNote, lastNote) {
  const countWhiteKeys = (fromMidi, toMidi) => {
    let count = 0;
    for (let m = fromMidi; m <= toMidi; m++) {
      const noteInOctave = m % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
      if (!isBlack) count++;
    }
    return count;
  };

  const getWhiteIndex = (targetMidi, startMidi) => {
    let count = 0;
    const start = Math.min(startMidi, targetMidi);
    const end = Math.max(startMidi, targetMidi);
    for (let m = start; m < end; m++) {
      const noteInOctave = m % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
      if (!isBlack) count++;
    }
    return targetMidi >= startMidi ? count : -count;
  };

  const totalWhiteKeys = Math.max(1, countWhiteKeys(firstNote, lastNote));
  const currentIndex = getWhiteIndex(midi, firstNote);
  const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);

  const baseLeft = (currentIndex / totalWhiteKeys) * 100;

  const width = isBlack ? 1.4 : 2.0;
  const left = isBlack ? baseLeft - 0.63 : baseLeft + 0.36;

  return { left, width };
}

function PianoTiles({ song, progress, firstNote, lastNote }) {
  const visibleNotes = useMemo(() => {
    if (!song || !song.notes) return [];
    return song.notes.filter(
      (note) =>
        note.time <= progress + TIME_WINDOW_SECONDS &&
        note.time + note.duration > progress,
    );
  }, [song, progress]);

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-black border-b border-zinc-800">
      {visibleNotes.map((note, index) => {
        const { left, width } = getNotePosition(note.midi, firstNote, lastNote);

        const bottomPercent =
          ((note.time - progress) / TIME_WINDOW_SECONDS) * 100;

        const visualDuration = Math.max(0.01, note.duration - 0.03);
        const heightPercent = (visualDuration / TIME_WINDOW_SECONDS) * 100;

        return (
          <div
            key={`${note.midi}-${note.time}-${index}`}
            className="absolute rounded-lg bg-blue-500 will-change-[bottom]"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              bottom: `${bottomPercent}%`,
              height: `${heightPercent}%`,
              zIndex: note.midi % 12 ? 10 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

function PianoSettingsRow({
  isReady,
  isPlaying,
  showShortcuts,
  setShowShortcuts,
  stopSong,
  pauseSong,
  schedulePlayback,
  progress,
  duration,
  seekSong,
  volume,
  setVolume,
  timeWindow,
}) {
  const progressMin = -timeWindow;
  const progressMax = duration || 1;
  const progressValue = Math.min(progress, progressMax);
  const progressPercent =
    ((progressValue - progressMin) / (progressMax - progressMin)) * 100;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-zinc-900 px-6 py-3 shadow-inner sm:flex-nowrap">
      <div className="flex items-center gap-3 min-w-max">
        <p className="text-sm font-bold tracking-tight text-white">
          La Maritza
        </p>
        <span
          className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "animate-pulse bg-blue-500" : "bg-zinc-500"}`}
        ></span>
      </div>

      <div className="flex items-center gap-2 min-w-max">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isReady}
          onClick={stopSong}
          className="rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset Time
        </motion.button>
        <button
          type="button"
          disabled={!isReady}
          onClick={isPlaying ? pauseSong : () => schedulePlayback(progress)}
          className="flex items-center justify-center gap-2 rounded-full w-24 text-center bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!isReady ? "Loading..." : isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          aria-pressed={showShortcuts}
          onClick={() => setShowShortcuts((current) => !current)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${showShortcuts ? "bg-blue-500/20 text-blue-400" : "text-zinc-400 hover:text-white"}`}
        >
          Shortcuts: {showShortcuts ? "On" : "Off"}
        </button>
      </div>

      <div className="flex flex-1 items-center gap-3 text-xs font-medium text-zinc-400 min-w-37.5">
        <span className="w-8 text-right">{formatTime(progress)}</span>
        <input
          type="range"
          min={progressMin}
          max={progressMax}
          step="0.01"
          value={progressValue}
          onChange={seekSong}
          disabled={!isReady}
          aria-label="Song progress"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${progressPercent}%, #27272a ${progressPercent}%)`,
          }}
          className="h-1 w-full cursor-pointer appearance-none rounded-full accent-blue-500 transition-all hover:h-1.5 focus:outline-none"
        />
        <span className="w-8">{formatTime(duration)}</span>
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 min-w-max">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Piano volume"
          style={{
            background: `linear-gradient(to right, #ffffff ${volume}%, #27272a ${volume}%)`,
          }}
          className="h-1 w-20 cursor-pointer appearance-none rounded-full accent-white transition-all hover:h-1.5 focus:outline-none"
        />
      </label>
    </div>
  );
}

export default function StagePiano({ onContinue }) {
  const {
    isReady,
    song,
    activeNotes,
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    playNote,
    stopNote,
    schedulePlayback,
    stopSong,
    pauseSong,
    seekSong,
  } = usePianoEngine(TIME_WINDOW_SECONDS);

  const { showShortcuts, setShowShortcuts, keyboardShortcuts } =
    usePianoShortcuts({ firstNote: FIRST_NOTE, lastNote: LAST_NOTE });

  const pianoFrameRef = useRef(null);
  const [pianoWidth, setPianoWidth] = useState(0);

  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (duration > 0 && progress >= duration) {
      setHasCompleted(true);
    }
  }, [progress, duration]);

  useEffect(() => {
    function updateWidth() {
      const frame = pianoFrameRef.current;
      if (!frame) return;
      const styles = getComputedStyle(frame);
      const nextWidth =
        frame.clientWidth -
        Number.parseFloat(styles.paddingLeft) -
        Number.parseFloat(styles.paddingRight);
      setPianoWidth(Math.max(0, nextWidth));
    }

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (pianoFrameRef.current) observer.observe(pianoFrameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasCompleted && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [hasCompleted]);

  const handleContinue = () => {
    stopSong();
    if (onContinue) {
      onContinue();
    }
  };

  useEffect(() => {
    if (!hasCompleted || !onContinue) return undefined;

    function handleKeyDown(event) {
      if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        handleContinue();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasCompleted, onContinue, stopSong]);

  function syncMouseState(e) {
    if (e.buttons === 0)
      window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }

  return (
    <div
      className="stage-piano relative h-screen flex w-full flex-col bg-black font-sans"
      onMouseEnter={syncMouseState}
      onMouseLeave={syncMouseState}
    >
      {hasCompleted && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={handleContinue}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          aria-label="Press Space to continue"
          className="absolute top-4 right-6 z-50 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none"
        >
          <span>Press</span>
          <img
            src={spacebar}
            alt="Spacebar"
            className="h-7 w-24 object-contain"
          />
          <span>to continue</span>
        </motion.button>
      )}

      <style>{`
        .stage-piano-frame .ReactPiano__NoteLabelContainer { width: 100% !important; text-align: center !important; }
        .stage-piano-frame .ReactPiano__Key { display: flex !important; align-items: flex-end !important; justify-content: center !important; padding-bottom: 1rem !important; }
        .stage-piano-frame .ReactPiano__Keyboard { min-height: 180px !important; border: none !important; overflow: visible !important; }
        .stage-piano-frame .ReactPiano__Key--natural { height: 180px !important; border-radius: 0 0 6px 6px; border-bottom: none !important; }
        .stage-piano-frame .ReactPiano__Key--accidental { height: 110px !important; border-radius: 0 0 4px 4px; border-bottom: none !important; }
      `}</style>

      <PianoTiles
        song={song}
        progress={progress}
        firstNote={FIRST_NOTE}
        lastNote={LAST_NOTE}
      />

      <div ref={pianoFrameRef} className="w-full box-border stage-piano-frame">
        <Piano
          noteRange={{ first: FIRST_NOTE, last: LAST_NOTE }}
          playNote={playNote}
          stopNote={stopNote}
          width={pianoWidth}
          activeNotes={activeNotes}
          disabled={!isReady}
          keyboardShortcuts={keyboardShortcuts}
          renderNoteLabel={({ keyboardShortcut, isAccidental }) => {
            if (!showShortcuts || !keyboardShortcut) return null;
            const primaryShortcut = keyboardShortcut.split(" ")[0];
            return (
              <div
                className={`w-full text-center text-[12px] font-bold uppercase ${isAccidental ? "text-zinc-400" : "text-black"}`}
              >
                {primaryShortcut}
              </div>
            );
          }}
        />
      </div>

      <PianoSettingsRow
        isReady={isReady}
        isPlaying={isPlaying}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        stopSong={stopSong}
        pauseSong={pauseSong}
        schedulePlayback={schedulePlayback}
        progress={progress}
        duration={duration}
        seekSong={seekSong}
        volume={volume}
        setVolume={setVolume}
        timeWindow={TIME_WINDOW_SECONDS}
      />
    </div>
  );
}
