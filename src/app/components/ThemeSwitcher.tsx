'use client';

import { useTheme, Theme } from '@/contexts/ThemeContext';

const themes: Theme[] = ['light', 'cyan', 'green', 'amber'];

export const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <div className="">
      <div className="flex items-center space-x-2 rounded-lg bg-red-500 p-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setTheme(theme)}
            className={`h-8 w-8 rounded-full transition-transform duration-150 ease-in-out hover:scale-110 focus:outline-none`}
            style={{ 
              backgroundColor: 
                theme === 'light' ? '#FFFFFF' : 
                theme === 'cyan' ? '#00FFFF' : 
                theme === 'green' ? '#00FF00' : '#FFBF00'
            }}
            aria-label={`Switch to ${theme} theme`}
          />
        ))}
      </div>
    </div>
  );
};
