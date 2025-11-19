import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";
import { aliasPreferencesService } from "../services/apiService";

export const useAutoTheme = () => {
  const dispatch = useDispatch();
  const { autoTheme } = useSelector((state) => state.theme);

  useEffect(() => {
    // If preferences exist, respect them and do not auto-switch
    try {
      const rawPrefs = localStorage.getItem('alias_preferences');
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs);
        if (prefs?.theme === 'Dark') dispatch(setTheme(true));
        if (prefs?.theme === 'Light') dispatch(setTheme(false));
        if (prefs?.language) localStorage.setItem('emoSocial_language', prefs.language);
        return; // skip auto theme when user has saved preference
      }
    } catch { }

    // Apply saved alias preference theme on mount
    try {
      const raw = localStorage.getItem('alias_preferences');
      if (raw) {
        const prefs = JSON.parse(raw);
        if (prefs?.theme === 'Dark') dispatch(setTheme(true));
        if (prefs?.theme === 'Light') dispatch(setTheme(false));
        if (prefs?.language) localStorage.setItem('emoSocial_language', prefs.language);
      }
    } catch { }

    if (!autoTheme) return;

    const updateTheme = () => {
      const now = new Date();
      const hour = now.getHours();

      // 6:00 AM = Light Mode, 6:00 PM = Dark Mode
      const isDarkTime = hour >= 18 || hour < 6;
      dispatch(setTheme(isDarkTime));
    };

    // Update immediately
    updateTheme();

    // Check every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [dispatch, autoTheme]);
};

export const useTheme = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Ensure preferences are fetched once if missing
    (async () => {
      try {
        const raw = localStorage.getItem('alias_preferences');
        if (!raw) {
          const prefs = await aliasPreferencesService.getPreferences();
          if (prefs?.theme === 'Dark') dispatch(setTheme(true));
          if (prefs?.theme === 'Light') dispatch(setTheme(false));
          if (prefs?.language) localStorage.setItem('emoSocial_language', prefs.language);
        }
      } catch { }
    })();

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Persist theme to alias preferences storage if exists
    try {
      const raw = localStorage.getItem('alias_preferences');
      if (raw) {
        const prefs = JSON.parse(raw) || {};
        const next = { ...prefs, theme: isDarkMode ? 'Dark' : 'Light' };
        localStorage.setItem('alias_preferences', JSON.stringify(next));
      }
    } catch { }
  }, [isDarkMode]);

  return isDarkMode;
};
