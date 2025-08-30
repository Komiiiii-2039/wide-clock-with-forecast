'use client';

import { createContext, useState, useMemo, useContext, ReactNode, useEffect } from 'react';

export type Theme = 'light' | 'cyan' | 'green' | 'amber';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('cyan'); // Default theme

  useEffect(() => {
    document.body.className = ''; // Clear existing theme classes
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
