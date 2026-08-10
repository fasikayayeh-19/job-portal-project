'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
      className="
        flex h-10 w-10 items-center justify-center
        rounded-lg
        text-slate-600
        transition
        hover:bg-blue-50
        hover:text-blue-600
        dark:text-slate-300
        dark:hover:bg-slate-800
        dark:hover:text-blue-400
      "
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}