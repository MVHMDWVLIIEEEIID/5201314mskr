import { SplendidGrandPiano } from "smplr";

let shared = null;
let loadPromise = null;

export function getPianoAudio() {
  if (!shared) {
    const context = new AudioContext();
    const piano = new SplendidGrandPiano(context);
    shared = { context, piano };
    loadPromise = piano.load.then(() => shared);
  }
  return shared;
}

export function preloadPiano() {
  getPianoAudio();
  return loadPromise;
}

export function isPianoReady() {
  return Boolean(shared?.piano && loadPromise);
}
