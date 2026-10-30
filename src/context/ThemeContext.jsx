import { createContext, useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

/* oxlint-disable react/only-export-components -- Consumers share this context with the provider. */
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [savedTheme, setSavedTheme] = useLocalStorage("theme", () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const theme = savedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setSavedTheme((current) => current === "light" ? "dark" : "light");
  }, [setSavedTheme]);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}