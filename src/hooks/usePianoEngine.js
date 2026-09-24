import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import pianoMidiUrl from "../data/piano.mid?url";
import { getPianoAudio, preloadPiano } from "../lib/pianoAudio.js";

export function usePianoEngine(leadInSeconds = 3) {
  const stopFnsRef = useRef(new Map());
  const playbackTimersRef = useRef([]);
  const scheduledAudioNodesRef = useRef([]);
  const playbackRef = useRef({ startedAt: 0, offset: -leadInSeconds });

  const [isReady, setIsReady] = useState(false);
  const [song, setSong] = useState(null);
  const [activeNotes, setActiveNotes] = useState([]);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(-leadInSeconds);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers = playbackTimersRef.current;
    const stopFns = stopFnsRef.current;
    const autoNodes = scheduledAudioNodesRef.current;

    async function loadPianoAndSong() {
      try {
        const [, midi] = await Promise.all([
          preloadPiano(),
          Midi.fromUrl(pianoMidiUrl),
        ]);

        if (cancelled) return;

        const pianoTracks = midi.tracks.filter(
          (track) =>
            track.instrument &&
            track.instrument.number >= 0 &&
            track.instrument.number <= 7,
        );
        const validTracks = pianoTracks.length > 0 ? pianoTracks : midi.tracks;
        const notes = validTracks
          .flatMap((track) => track.notes)
          .filter(
            (note) =>
              Number.isFinite(note.midi) &&
              Number.isFinite(note.time) &&
              Number.isFinite(note.duration),
          )
          .sort((firstNote, secondNote) => firstNote.time - secondNote.time);

        setSong({ name: midi.name || "Track", notes });
        setDuration(
          notes.reduce(
            (longest, note) => Math.max(longest, note.time + note.duration),
            0,
          ),
        );
        setIsReady(true);
      } catch (error) {
        if (!cancelled) console.error("Unable to load piano.mid", error);
      }
    }

    loadPianoAndSong();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      stopFns.forEach((stop) => stop?.());
      stopFns.clear();
      autoNodes.forEach((stop) => stop?.());
      autoNodes.length = 0;
      getPianoAudio().piano.stop();
    };
  }, []);

  useEffect(() => {
    const audio = getPianoAudio();
    audio.piano.output.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const intervalId = window.setInterval(() => {
      const nextProgress = Math.min(
        duration,
        playbackRef.current.offset +
          (performance.now() - playbackRef.current.startedAt) / 1000,
      );
      setProgress(nextProgress);
    }, 4);
    return () => window.clearInterval(intervalId);
  }, [duration, isPlaying]);

  async function ensureAudio() {
    const audio = getPianoAudio();
    if (audio.context.state !== "running") await audio.context.resume();
    return audio;
  }

  async function playNote(midiNumber) {
    if (!isReady) return;
    const audio = await ensureAudio();
    const existing = stopFnsRef.current.get(midiNumber);
    existing?.();

    const handVelocityMultiplier = midiNumber < 60 ? 0.8 : 1.0;
    const stop = audio.piano.start({
      note: midiNumber,
      velocity: Math.round(95 * handVelocityMultiplier),
    });
    stopFnsRef.current.set(midiNumber, stop);
  }

  function stopNote(midiNumber) {
    const stop = stopFnsRef.current.get(midiNumber);
    stop?.();
    stopFnsRef.current.delete(midiNumber);
  }

  function clearPlayback() {
    playbackTimersRef.current.forEach((id) => window.clearTimeout(id));
    playbackTimersRef.current = [];
    stopFnsRef.current.forEach((stop) => stop?.());
    stopFnsRef.current.clear();
    scheduledAudioNodesRef.current.forEach((stop) => stop?.());
    scheduledAudioNodesRef.current = [];

    const audio = getPianoAudio();
    audio.piano.stop();
    if (audio.context && typeof audio.context.cancel === "function") {
      audio.context.cancel(0);
    }
    setActiveNotes([]);
  }

  async function schedulePlayback(offset = -leadInSeconds) {
    if (!isReady) return;
    const audio = await ensureAudio();
    clearPlayback();

    const notes = (Array.isArray(song?.notes) ? song.notes : []).filter((n) =>
      Number.isFinite(n?.midi),
    );
    const startAt = audio.context.currentTime + 0.05;
    const remainingNotes = notes.filter(
      (n) => (n.time ?? 0) + (n.duration ?? 0.4) > offset,
    );

    playbackRef.current = { startedAt: performance.now(), offset };
    setProgress(offset);
    setIsPlaying(true);
    let lastEndMs = 0;

    remainingNotes.forEach((note) => {
      const midi = note.midi;
      const time = note.time ?? 0;
      const duration = note.duration ?? 0.4;
      const handVelocityMultiplier = midi < 60 ? 0.8 : 1.0;
      const baseVelocity = Number.isFinite(note.velocity) ? note.velocity : 0.7;
      const velocity = Math.max(
        1,
        Math.round(baseVelocity * 127 * handVelocityMultiplier),
      );

      const stopAudioNodeFn = audio.piano.start({
        note: midi,
        velocity,
        time: startAt + Math.max(0, time - offset),
        duration: Math.max(0.05, duration - Math.max(0, offset - time)),
      });
      scheduledAudioNodesRef.current.push(stopAudioNodeFn);

      const showId = window.setTimeout(
        () => {
          setActiveNotes((prev) =>
            prev.includes(midi) ? prev : [...prev, midi],
          );
        },
        Math.max(0, time - offset) * 1000,
      );

      const hideId = window.setTimeout(
        () => {
          setActiveNotes((prev) => prev.filter((n) => n !== midi));
        },
        Math.max(0, time + duration - offset) * 1000,
      );

      playbackTimersRef.current.push(showId, hideId);
      lastEndMs = Math.max(lastEndMs, (time + duration - offset) * 1000);
    });

    const doneId = window.setTimeout(() => {
      setActiveNotes([]);
      setProgress(duration);
      setIsPlaying(false);
    }, lastEndMs + 150);
    playbackTimersRef.current.push(doneId);
  }

  function stopSong() {
    clearPlayback();
    playbackRef.current.offset = -leadInSeconds;
    setProgress(-leadInSeconds);
    setIsPlaying(false);
  }

  function pauseSong() {
    if (!isPlaying) return;
    const nextProgress = Math.min(
      duration,
      playbackRef.current.offset +
        (performance.now() - playbackRef.current.startedAt) / 1000,
    );
    playbackRef.current.offset = nextProgress;
    setProgress(nextProgress);
    setIsPlaying(false);
    clearPlayback();
  }

  function seekSong(event) {
    const nextProgress = Number(event.target.value);
    setProgress(nextProgress);
    if (isPlaying) schedulePlayback(nextProgress);
    else playbackRef.current.offset = nextProgress;
  }

  return {
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
  };
}