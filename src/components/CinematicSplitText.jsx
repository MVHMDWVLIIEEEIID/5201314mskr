const sentences = [
  "Lastly I Want To...",
  "Thank You...",
  "...For Being The Most Beautiful Part Of My Life.",
  "As We Step Into This New Year,",
  "I Just Want You To Know",
  "How Much You Truly Mean To Me.",
  "I Hope This Year Brings You",
  "As Much Joy, Peace, And Beauty...",
  "...As You Bring To My World Every Single Day.",
  "I Can't Wait To Watch You...",
  "Achieve Everything You've Been Dreaming Of...",
  "...And See You Get Everything You Deserve.",
  "Whatever Happens, I'll Be Right By Your Side...",
  "...Always Proud Of You, And Always Cheering You On.",
  "I Love You, Kholoud.",
];

const ANIMATION_DURATION = 1.6;
const WORD_STAGGER = 0.1;
const FADE_RATIO = 0.2;
const TEXT_START_DELAY = 1;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function CinematicSplitText({ progress, duration = 0 }) {
  const audioTime = duration > 0 ? progress * duration : progress;
  const currentTime = Math.max(0, audioTime - TEXT_START_DELAY);
  const sentenceCount = sentences.length;
  const sentenceDuration = duration > 0 ? duration / sentenceCount : 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-8 text-center md:px-12">
      <div className="relative h-full w-full max-w-4xl">
        {sentences.map((text, index) => (
          <SplitText
            key={`${index}-${text}`}
            text={text}
            index={index}
            currentTime={currentTime}
            sentenceDuration={sentenceDuration}
            isFinalSentence={index === sentenceCount - 1}
          />
        ))}
      </div>
    </div>
  );
}

// Each sentence shares the same centered layer. Its timing is calculated from
// the number of sentences, so adding or removing copy needs no other changes.
function SplitText({
  text,
  index,
  currentTime,
  sentenceDuration,
  isFinalSentence,
}) {
  const words = text.split(" ");
  const sentenceStart = index * sentenceDuration;
  const fadeDuration = isFinalSentence
    ? 0
    : Math.min(sentenceDuration * FADE_RATIO, ANIMATION_DURATION * 0.5);
  const revealDuration = Math.min(
    ANIMATION_DURATION,
    Math.max(sentenceDuration - fadeDuration, sentenceDuration * 0.55),
  );
  const revealProgress = clamp((currentTime - sentenceStart) / revealDuration);
  const fadeStart = sentenceStart + sentenceDuration - fadeDuration;
  const fadeProgress =
    fadeDuration === 0 ? 0 : clamp((currentTime - fadeStart) / fadeDuration);
  const smoothFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
  const sentenceOpacity = isFinalSentence
    ? currentTime >= sentenceStart
      ? 1
      : 0
    : currentTime < sentenceStart
      ? 0
      : 1 - smoothFade;

  return (
    <p
      aria-label={text}
      style={{
        opacity: sentenceOpacity,
      }}
      className="absolute left-0 top-1/2 m-0 flex w-full -translate-y-1/2 flex-wrap justify-center gap-x-3 gap-y-1 text-2xl font-light leading-tight text-white md:gap-x-4 md:text-5xl lg:text-6xl"
    >
      {words.map((word, wordIndex) => {
        const wordProgress = clamp(
          (revealProgress - wordIndex * WORD_STAGGER) / 0.34,
        );
        const easedProgress = 1 - (1 - wordProgress) ** 3;

        return (
          <span
            key={`${word}-${wordIndex}`}
            style={{
              opacity: easedProgress,
              transform: `translate3d(0, ${(1 - easedProgress) * 22}px, 0)`,
            }}
            className="inline-block will-change-[transform,opacity]"
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
