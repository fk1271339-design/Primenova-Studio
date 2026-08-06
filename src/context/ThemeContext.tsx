import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  darkMode: true,
  toggleTheme: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Initialize from prefers-color-scheme or localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
