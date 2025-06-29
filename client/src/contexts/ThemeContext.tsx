import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'islamic' | 'ramadan';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'islamic', 'ramadan');
    
    // Add current theme class
    document.documentElement.classList.add(theme);
    
    // Handle dark mode for Tailwind - only dark theme should be dark
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set CSS custom properties for theme colors
    const root = document.documentElement;
    
    switch (theme) {
      case 'islamic':
        root.style.setProperty('--theme-primary', '#10b981');
        root.style.setProperty('--theme-secondary', '#14b8a6');
        root.style.setProperty('--theme-accent', '#fbbf24');
        break;
      case 'ramadan':
        root.style.setProperty('--theme-primary', '#f59e0b');
        root.style.setProperty('--theme-secondary', '#d97706');
        root.style.setProperty('--theme-accent', '#fcd34d');
        break;
      case 'dark':
        root.style.setProperty('--theme-primary', '#3b82f6');
        root.style.setProperty('--theme-secondary', '#1d4ed8');
        root.style.setProperty('--theme-accent', '#60a5fa');
        break;
      default: // light
        root.style.setProperty('--theme-primary', '#22c55e');
        root.style.setProperty('--theme-secondary', '#16a34a');
        root.style.setProperty('--theme-accent', '#4ade80');
        break;
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: ThemeType[] = ['light', 'dark', 'islamic', 'ramadan'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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