import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BorderGlow from "./BorderGlow.jsx";
import GlareHover from "./GlareHover.jsx";

const attemptThemes = {
  idle: {
    accent: "#60a5fa",
    accentSoft: "rgb(147 197 253 / 80%)",
    accentBorder: "rgb(96 165 250 / 70%)",
    accentBg: "rgb(59 130 246 / 15%)",
    accentRing: "rgb(96 165 250 / 25%)",
    accentShadow: "rgb(23 37 84 / 60%)",
    glowColor: "217 91 60",
    colors: ["#60a5fa", "#3b82f6", "#2563eb"],
  },
  correct: {
    accent: "#4ade80",
    accentSoft: "rgb(74 222 128 / 85%)",
    accentBorder: "rgb(74 222 128 / 75%)",
    accentBg: "rgb(74 222 128 / 18%)",
    accentRing: "rgb(74 222 128 / 30%)",
    accentShadow: "rgb(20 83 45 / 65%)",
    glowColor: "142 64 57",
    colors: ["#4ade80", "#4ade80", "#4ade80"],
  },
  incorrect: {
    accent: "#ef4444",
    accentSoft: "rgb(239 68 68 / 85%)",
    accentBorder: "rgb(239 68 68 / 75%)",
    accentBg: "rgb(239 68 68 / 18%)",
    accentRing: "rgb(239 68 68 / 30%)",
    accentShadow: "rgb(127 29 29 / 65%)",
    glowColor: "0 84 60",
    colors: ["#ef4444", "#ef4444", "#ef4444"],
  },
};

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [checkPhase, setCheckPhase] = useState("idle");
  const [credentialsToCheck, setCredentialsToCheck] = useState(null);
  const [initialGlowActive, setInitialGlowActive] = useState(true);
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const activeTheme =
    checkPhase === "checking"
      ? hasFailedAttempt
        ? "incorrect"
        : "idle"
      : checkPhase;
  const attemptTheme = attemptThemes[activeTheme];
  const attemptStyle = {
    "--attempt-accent": attemptTheme.accent,
    "--attempt-accent-soft": attemptTheme.accentSoft,
    "--attempt-accent-border": attemptTheme.accentBorder,
    "--attempt-accent-bg": attemptTheme.accentBg,
    "--attempt-accent-ring": attemptTheme.accentRing,
    "--attempt-accent-shadow": attemptTheme.accentShadow,
  };

  useEffect(() => {
    if (!credentialsToCheck) {
      return undefined;
    }

    const result =
      credentialsToCheck.username.toLowerCase().trim() === "kholoud" &&
      credentialsToCheck.password === "2331310";
    const resultPhase = result ? "correct" : "incorrect";

    const checkTimer = window.setTimeout(() => {
      setCheckPhase(resultPhase);
      setMessage(
        result ? "Welcome!" : "Incorrect username or password.",
      );
      if (!result) {
        setHasFailedAttempt(true);
      }
    }, 3000);

    const resultTimer = window.setTimeout(() => {
      setCredentialsToCheck(null);

      if (result) {
        setHasFailedAttempt(false);
        setCheckPhase("idle");
        onLoginSuccess();
      } else {
        setCheckPhase("incorrect");
      }
    }, 5000);

    return () => {
      window.clearTimeout(checkTimer);
      window.clearTimeout(resultTimer);
    };
  }, [credentialsToCheck, onLoginSuccess]);

  useEffect(() => {
    const initialGlowTimer = window.setTimeout(() => {
      setInitialGlowActive(false);
    }, 3000);

    return () => window.clearTimeout(initialGlowTimer);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (checkPhase === "checking") {
      return;
    }

    setMessage("Checking details...");
    setCredentialsToCheck({ username, password });
    setCheckPhase("checking");
  }

  return (
    <div
      style={attemptStyle}
      className="min-h-screen w-full overflow-x-hidden bg-black"
    >
      <main className="relative isolate flex min-h-screen w-full items-center justify-center">
        <div
          className="attempt-bg-soft pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="attempt-bg-soft pointer-events-none absolute -right-32 top-12 h-72 w-72 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <motion.form
          onSubmit={handleSubmit}
          className="attempt-text relative z-10 w-[clamp(20rem,32vw,28rem)]"
        >
          <BorderGlow
            key={checkPhase}
            animated={initialGlowActive || checkPhase !== "idle"}
            animationDuration={
              checkPhase === "checking" || initialGlowActive ? 3000 : 1000
            }
            edgeSensitivity={0}
            backgroundColor="#000000"
            borderRadius={16}
            className="attempt-shadow w-full"
            glowColor={attemptTheme.glowColor}
            borderColor={attemptTheme.accentRing}
            colors={attemptTheme.colors}
          >
            <div className="px-10 py-11">
              <div className="flex flex-col items-center text-center">
                <p className="attempt-text-soft text-xs font-semibold tracking-widest uppercase">
                  Exclusive to a single individual on Earth
                </p>
                <h1 className="mt-3 text-2xl font-semibold uppercase tracking-wide">
                  Who tf You're
                </h1>
                <div className="attempt-bg mt-4 h-px w-16" />
              </div>
              <div className="mt-10 flex flex-col items-center">
                <div className="relative w-full">
                  <input
                    id="username"
                    type="text"
                    placeholder=" "
                    value={username}
                    disabled={checkPhase === "checking"}
                    onChange={(event) => setUsername(event.target.value)}
                    className="attempt-input attempt-ring peer w-full rounded-lg border attempt-border-soft bg-black px-4 py-3 attempt-text outline-none transition duration-200 placeholder:text-var(--attempt-accent-soft) focus:border-var(--attempt-accent)"
                  />
                  <label
                    htmlFor="username"
                    className="attempt-text attempt-label pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-black px-1 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-var(--attempt-accent-soft) peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:px-1 peer-focus:text-sm"
                  >
                    Username
                  </label>
                </div>
                <div className="relative mt-5 w-full">
                  <input
                    id="password"
                    type="password"
                    placeholder=" "
                    value={password}
                    disabled={checkPhase === "checking"}
                    onChange={(event) => setPassword(event.target.value)}
                    className="attempt-input attempt-ring peer w-full rounded-lg border attempt-border-soft bg-black px-4 py-3 attempt-text outline-none transition duration-200 placeholder:text-var(--attempt-accent-soft) focus:border-var(--attempt-accent)"
                  />
                  <label
                    htmlFor="password"
                    className="attempt-text attempt-label pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-black px-1 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-var(--attempt-accent-soft) peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:px-1 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <GlareHover
                  width="100%"
                  height="auto"
                  background="transparent"
                  borderColor="transparent"
                  borderRadius="8px"
                  glareColor={attemptTheme.accentSoft}
                  glareOpacity={0.35}
                  glareSize={250}
                  className="mt-7 w-full"
                  style={{ borderWidth: 0 }}
                >
                  <button
                    type="submit"
                    disabled={checkPhase === "checking"}
                    className="attempt-ring attempt-bg w-full rounded-lg border attempt-border px-4 py-3 font-bold text-black transition duration-200 active:scale-[0.98]focus:outline-none"
                  >
                    {checkPhase === "checking" ? "Checking..." : "Submit"}
                  </button>
                </GlareHover>
                <p
                  className="attempt-text mt-4 min-h-5 text-center text-sm"
                  aria-live="polite"
                >
                  {message}
                </p>
              </div>
            </div>
          </BorderGlow>
        </motion.form>
      </main>
    </div>
  );
}
