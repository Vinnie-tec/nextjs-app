"use client";

import { createContext, useState, useEffect } from "react";

// create a context to share theme state and toggle function across the app
export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  // theme state: defaults to 'light'
  const [theme, setTheme] = useState("dark");

  // on mount, ensure the 'light' theme is applied to document

  useEffect(() => {
    document.documentElement.classList.add("dark"); // remove mode if present
  }, []);

  //   function to toggle between light and dark theme manually

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";

      // update the <html> element to reflect the new theme
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  //   provide theme state and toggle function to children
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}
