import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import LoggedIn from "./LoggedIn.jsx";
import MobileBlocker from "./components/MobileBlocker.jsx";
import LoginForm from "./components/LoginForm.jsx";

// Set this to true when developing locally to open the app without logging in.
// Vite removes the bypass in production builds, regardless of this setting.
const developmentLoginBypass = false;
const shouldBypassLogin = import.meta.env.DEV && developmentLoginBypass;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (shouldBypassLogin) {
      return true;
    }

    try {
      return localStorage.getItem("mybeloved:isLoggedIn") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (shouldBypassLogin) {
      return;
    }

    try {
      localStorage.setItem("mybeloved:isLoggedIn", String(isLoggedIn));
    } catch {
      // Continue to work if local storage is unavailable or disabled.
    }
  }, [isLoggedIn]);

  function handleLogout() {
    try {
      localStorage.removeItem("mybeloved:isLoggedIn");
      localStorage.removeItem("mybeloved:stage");
      localStorage.removeItem("mybeloved:phase");
    } catch {
      // The in-memory logout still works when local storage is unavailable.
    }
    setIsLoggedIn(false);
  }

  return (
    <MobileBlocker>
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="logged-in"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <LoggedIn onLogout={handleLogout} />
          </motion.div>
        ) : (
          <LoginForm key="login" onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </AnimatePresence>
    </MobileBlocker>
  );
}
