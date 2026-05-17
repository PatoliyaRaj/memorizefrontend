'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  // mounted prevents hydration mismatch:
  // server always renders the neutral skeleton, client renders the real toggle
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a neutral placeholder during SSR / before hydration
  // This ensures server HTML === initial client HTML
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="
          relative inline-flex items-center gap-2 px-4 py-2 rounded-full
          border border-white/20 bg-white/10
          text-gray-800 dark:text-gray-100
          text-sm font-medium opacity-0
        "
        disabled
      >
        <Sun className="w-4 h-4" />
        <span>Theme</span>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="
        relative inline-flex items-center gap-2 px-4 py-2 rounded-full
        border border-white/20 dark:border-white/10
        bg-white/10 dark:bg-white/5
        text-gray-800 dark:text-gray-100
        hover:bg-white/20 dark:hover:bg-white/10
        transition-all duration-200 ease-out
        text-sm font-medium
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}