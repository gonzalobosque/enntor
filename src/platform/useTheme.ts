import { useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );
  const [saveError, setSaveError] = useState(false);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', next === 'dark' ? '#181b19' : '#f4f3ec',
    );
    setTheme(next);
    try {
      localStorage.setItem('enhtor.theme', next);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }

  return { theme, toggleTheme, saveError };
}
