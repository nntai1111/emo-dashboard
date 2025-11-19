import { useState, useEffect } from "react";

const INTRO_SEEN_KEY = "emoSocial_introSeen";

export const useIntroStatus = () => {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen intro before
    const checkIntroStatus = () => {
      try {
        const introSeen = localStorage.getItem(INTRO_SEEN_KEY);
        setHasSeenIntro(introSeen === "true");
      } catch (error) {
        console.error("Error checking intro status:", error);
        setHasSeenIntro(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIntroStatus();
  }, []);

  const markIntroAsSeen = () => {
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "true");
      setHasSeenIntro(true);
    } catch (error) {
      console.error("Error marking intro as seen:", error);
    }
  };

  const resetIntroStatus = () => {
    try {
      localStorage.removeItem(INTRO_SEEN_KEY);
      setHasSeenIntro(false);
    } catch (error) {
      console.error("Error resetting intro status:", error);
    }
  };

  return {
    hasSeenIntro,
    isLoading,
    markIntroAsSeen,
    resetIntroStatus,
  };
};
