import { useEffect, useMemo, useState } from "react";
import { KeyboardShortcuts, MidiNumbers } from "react-piano";

export function usePianoShortcuts({
  firstNote = MidiNumbers.fromNote("c3"),
  lastNote = MidiNumbers.fromNote("f7"),
} = {}) {
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [octaveOffset, setOctaveOffset] = useState(12);

  useEffect(() => {
    function handleArrowKeys(e) {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setOctaveOffset((prev) => Math.min(prev + 1, 48));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOctaveOffset((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, []);

  const keyboardShortcuts = useMemo(() => {
    const baseShortcuts = KeyboardShortcuts.create({
      firstNote: firstNote + octaveOffset,
      lastNote: lastNote + octaveOffset,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    const keyMap = {
      a: ["A", "ش"],
      w: ["W", "ص"],
      s: ["S", "س"],
      e: ["E", "ث"],
      d: ["D", "ي"],
      f: ["F", "ب"],
      t: ["T", "ف"],
      g: ["G", "ل"],
      y: ["Y", "غ"],
      h: ["H", "ا"],
      u: ["U", "ع"],
      j: ["J", "ت"],
      k: ["K", "ن"],
      o: ["O", "خ"],
      l: ["L", "م"],
      p: ["P", "ح"],
      ";": [":", "ك"],
      "'": ['"', "ط"],
    };

    const expandedShortcuts = [];
    baseShortcuts.forEach((shortcut) => {
      expandedShortcuts.push(shortcut);
      const alternates = keyMap[shortcut.key];
      if (alternates) {
        alternates.forEach((altKey) => {
          expandedShortcuts.push({ ...shortcut, key: altKey });
        });
      }
    });

    return expandedShortcuts;
  }, [firstNote, lastNote, octaveOffset]);

  return { showShortcuts, setShowShortcuts, keyboardShortcuts };
}
