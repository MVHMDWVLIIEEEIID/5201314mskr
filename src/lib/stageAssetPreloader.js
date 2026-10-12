import hey from "../assets/hey.jpg";
import sideLookCat from "../assets/sidelookcat.jpg";
import thumbUp from "../assets/thumbup.gif";
import watches from "../assets/watches.png";
import evil from "../assets/evil.gif";
import fish from "../assets/fish.gif";
import look from "../assets/look.gif";
import reaction from "../assets/reaction.gif";
import talk from "../assets/talk.gif";
import myb from "../assets/myb.gif";
import shy from "../assets/shy.gif";
import fr from "../assets/fr.gif";
import happy from "../assets/happy.gif";
import shut from "../assets/shut.gif";
import side from "../assets/side.gif";
import billie from "../assets/billie.png";
import smile from "../assets/smile.gif";
import hmph from "../assets/hmph.gif";
import hmph2 from "../assets/hmph2.gif";
import uwu from "../assets/uwu.gif";
import shyc from "../assets/shyc.gif";
import shy2 from "../assets/shy2.gif";
import come from "../assets/come.gif";
import sonic from "../assets/sonic-side-eye.gif";
import cover from "../assets/cover.jpg";
import finalTrack from "../assets/Floating in Reverie.mp3";
import enterKey from "../assets/enter.png";
import spacebar from "../assets/spacebar.png";
import pianoMidiUrl from "../data/piano.mid?url";
import { preloadPiano } from "./pianoAudio.js";

const STAGE_ASSETS = {
  1: [hey, sideLookCat, thumbUp, enterKey, spacebar],
  2: [watches, evil, fish, look, reaction],
  3: [talk, myb, shy, fr, happy],
  4: [
    shut,
    side,
    billie,
    smile,
    hmph,
    hmph2,
    uwu,
    shyc,
    shy2,
    come,
    sonic,
    pianoMidiUrl,
  ],
  5: [cover, finalTrack],
};

const MAX_CONCURRENT_LOADS = 3;
const queuedResources = new Map();
const queue = [];
let activeLoads = 0;

function isImage(url) {
  return /\.(avif|gif|jpe?g|png|svg|webp)(?:\?|$)/i.test(url);
}

function isAudio(url) {
  return /\.(aac|m4a|mp3|ogg|wav)(?:\?|$)/i.test(url);
}

function runQueue() {
  while (activeLoads < MAX_CONCURRENT_LOADS && queue.length > 0) {
    const task = queue.shift();
    activeLoads += 1;

    task()
      .catch(() => {
        // A failed preload should never interfere with the active experience.
      })
      .finally(() => {
        activeLoads -= 1;
        runQueue();
      });
  }
}

function queueResource(url) {
  if (queuedResources.has(url)) return queuedResources.get(url);

  let finishPreload;
  const preload = new Promise((resolve) => {
    finishPreload = resolve;
  });
  queuedResources.set(url, preload);

  queue.push(async () => {
    try {
      if (isImage(url)) {
        await new Promise((finish) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = image.onerror = finish;
          image.src = url;
        });
        return;
      }

      if (isAudio(url)) {
        await new Promise((finish) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "audio";
          link.href = url;
          link.onload = link.onerror = finish;
          document.head.append(link);
        });
        return;
      }

      await fetch(url, { cache: "force-cache" });
    } finally {
      finishPreload();
    }
  });

  runQueue();
  return preload;
}

/**
 * Warm a stage's media before the user reaches it. URLs are only enqueued
 * once per page, while hashed Vite assets remain in the browser HTTP cache.
 */
export function preloadStageAssets(stage) {
  if (typeof window === "undefined") return;

  (STAGE_ASSETS[stage] ?? []).forEach(queueResource);

  if (stage === 4) {
    // Stage Four's piano also downloads its instrument samples dynamically.
    preloadPiano().catch(() => {});
  }
}
