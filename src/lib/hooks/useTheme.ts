import { useCallback, useEffect, useState } from 'react';

export type ThemeName = 'purple' | 'ocean' | 'forest';
export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'md3-theme';

interface ThemeState { theme: ThemeName; mode: ThemeMode; }

const read = (): ThemeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { theme: 'purple', mode: 'light' };
};

const apply = (s: ThemeState) => {
  document.documentElement.setAttribute('data-theme', s.theme);
  document.documentElement.setAttribute('data-mode', s.mode);
};

export function useTheme() {
  const [state, setState] = useState<ThemeState>(read);

  useEffect(() => {
    apply(state);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const setTheme = useCallback((theme: ThemeName) => setState(s => ({ ...s, theme })), []);
  const setMode = useCallback((mode: ThemeMode) => setState(s => ({ ...s, mode })), []);
  const toggleMode = useCallback(
    () => setState(s => ({ ...s, mode: s.mode === 'light' ? 'dark' : 'light' })),
    [],
  );

  return { ...state, setTheme, setMode, toggleMode };
}
