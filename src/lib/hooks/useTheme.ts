import { createContext, useCallback, useContext, useEffect, useState, ReactNode, createElement } from 'react';

export type ThemeName = 'purple' | 'ocean' | 'forest' | 'custom';
export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'md3-theme';

interface ThemeState {
  theme: ThemeName;
  preference: ThemePreference;
  mode: ThemeMode;
  seedColor: string;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function generateThemeColors(seedColor: string, mode: 'light' | 'dark'): Record<string, string> {
  const { h, s } = hexToHsl(seedColor);
  const sSec = Math.max(0, s - 15);
  const hTert = (h + 60) % 360;
  const sTert = Math.max(0, s - 10);
  
  const sNeu = Math.min(12, Math.max(4, Math.round(s / 8)));
  const sNeuVar = Math.min(16, Math.max(6, Math.round(s / 6)));

  if (mode === 'light') {
    return {
      '--md-sys-color-primary': `hsl(${h}, ${s}%, 40%)`,
      '--md-sys-color-on-primary': `#ffffff`,
      '--md-sys-color-primary-container': `hsl(${h}, ${s}%, 90%)`,
      '--md-sys-color-on-primary-container': `hsl(${h}, ${s}%, 10%)`,

      '--md-sys-color-secondary': `hsl(${h}, ${sSec}%, 40%)`,
      '--md-sys-color-on-secondary': `#ffffff`,
      '--md-sys-color-secondary-container': `hsl(${h}, ${sSec}%, 90%)`,
      '--md-sys-color-on-secondary-container': `hsl(${h}, ${sSec}%, 10%)`,

      '--md-sys-color-tertiary': `hsl(${hTert}, ${sTert}%, 40%)`,
      '--md-sys-color-on-tertiary': `#ffffff`,
      '--md-sys-color-tertiary-container': `hsl(${hTert}, ${sTert}%, 90%)`,
      '--md-sys-color-on-tertiary-container': `hsl(${hTert}, ${sTert}%, 10%)`,

      '--md-sys-color-error': `hsl(0, 75%, 40%)`,
      '--md-sys-color-on-error': `#ffffff`,
      '--md-sys-color-error-container': `hsl(0, 75%, 90%)`,
      '--md-sys-color-on-error-container': `hsl(0, 75%, 10%)`,

      '--md-sys-color-background': `hsl(${h}, ${sNeu}%, 98%)`,
      '--md-sys-color-on-background': `hsl(${h}, ${sNeu}%, 10%)`,
      '--md-sys-color-surface': `hsl(${h}, ${sNeu}%, 98%)`,
      '--md-sys-color-on-surface': `hsl(${h}, ${sNeu}%, 10%)`,
      '--md-sys-color-surface-dim': `hsl(${h}, ${sNeu}%, 87%)`,
      '--md-sys-color-surface-bright': `hsl(${h}, ${sNeu}%, 98%)`,
      '--md-sys-color-surface-container-lowest': `#ffffff`,
      '--md-sys-color-surface-container-low': `hsl(${h}, ${sNeu}%, 96%)`,
      '--md-sys-color-surface-container': `hsl(${h}, ${sNeu}%, 94%)`,
      '--md-sys-color-surface-container-high': `hsl(${h}, ${sNeu}%, 92%)`,
      '--md-sys-color-surface-container-highest': `hsl(${h}, ${sNeu}%, 90%)`,

      '--md-sys-color-surface-variant': `hsl(${h}, ${sNeuVar}%, 90%)`,
      '--md-sys-color-on-surface-variant': `hsl(${h}, ${sNeuVar}%, 30%)`,
      '--md-sys-color-outline': `hsl(${h}, ${sNeuVar}%, 50%)`,
      '--md-sys-color-outline-variant': `hsl(${h}, ${sNeuVar}%, 80%)`,
      '--md-sys-color-inverse-surface': `hsl(${h}, ${sNeuVar}%, 20%)`,
      '--md-sys-color-inverse-on-surface': `hsl(${h}, ${sNeuVar}%, 95%)`,
      '--md-sys-color-inverse-primary': `hsl(${h}, ${s}%, 80%)`,
      '--md-sys-color-scrim': `#000000`,
      '--md-sys-color-shadow': `#000000`,
    };
  } else {
    return {
      '--md-sys-color-primary': `hsl(${h}, ${s}%, 80%)`,
      '--md-sys-color-on-primary': `hsl(${h}, ${s}%, 20%)`,
      '--md-sys-color-primary-container': `hsl(${h}, ${s}%, 30%)`,
      '--md-sys-color-on-primary-container': `hsl(${h}, ${s}%, 90%)`,

      '--md-sys-color-secondary': `hsl(${h}, ${sSec}%, 80%)`,
      '--md-sys-color-on-secondary': `hsl(${h}, ${sSec}%, 20%)`,
      '--md-sys-color-secondary-container': `hsl(${h}, ${sSec}%, 30%)`,
      '--md-sys-color-on-secondary-container': `hsl(${h}, ${sSec}%, 90%)`,

      '--md-sys-color-tertiary': `hsl(${hTert}, ${sTert}%, 80%)`,
      '--md-sys-color-on-tertiary': `hsl(${hTert}, ${sTert}%, 20%)`,
      '--md-sys-color-tertiary-container': `hsl(${hTert}, ${sTert}%, 30%)`,
      '--md-sys-color-on-tertiary-container': `hsl(${hTert}, ${sTert}%, 90%)`,

      '--md-sys-color-error': `hsl(0, 75%, 80%)`,
      '--md-sys-color-on-error': `hsl(0, 75%, 20%)`,
      '--md-sys-color-error-container': `hsl(0, 75%, 30%)`,
      '--md-sys-color-on-error-container': `hsl(0, 75%, 90%)`,

      '--md-sys-color-background': `hsl(${h}, ${sNeu}%, 6%)`,
      '--md-sys-color-on-background': `hsl(${h}, ${sNeu}%, 90%)`,
      '--md-sys-color-surface': `hsl(${h}, ${sNeu}%, 6%)`,
      '--md-sys-color-on-surface': `hsl(${h}, ${sNeu}%, 90%)`,
      '--md-sys-color-surface-dim': `hsl(${h}, ${sNeu}%, 6%)`,
      '--md-sys-color-surface-bright': `hsl(${h}, ${sNeu}%, 24%)`,
      '--md-sys-color-surface-container-lowest': `hsl(${h}, ${sNeu}%, 4%)`,
      '--md-sys-color-surface-container-low': `hsl(${h}, ${sNeu}%, 10%)`,
      '--md-sys-color-surface-container': `hsl(${h}, ${sNeu}%, 12%)`,
      '--md-sys-color-surface-container-high': `hsl(${h}, ${sNeu}%, 17%)`,
      '--md-sys-color-surface-container-highest': `hsl(${h}, ${sNeu}%, 22%)`,

      '--md-sys-color-surface-variant': `hsl(${h}, ${sNeuVar}%, 30%)`,
      '--md-sys-color-on-surface-variant': `hsl(${h}, ${sNeuVar}%, 80%)`,
      '--md-sys-color-outline': `hsl(${h}, ${sNeuVar}%, 60%)`,
      '--md-sys-color-outline-variant': `hsl(${h}, ${sNeuVar}%, 30%)`,
      '--md-sys-color-inverse-surface': `hsl(${h}, ${sNeuVar}%, 90%)`,
      '--md-sys-color-inverse-on-surface': `hsl(${h}, ${sNeuVar}%, 20%)`,
      '--md-sys-color-inverse-primary': `hsl(${h}, ${s}%, 40%)`,
      '--md-sys-color-scrim': `#000000`,
      '--md-sys-color-shadow': `#000000`,
    };
  }
}

const read = (): ThemeState => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { theme: 'purple', preference: 'system', mode: 'light', seedColor: '#6750a4' };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const preference: ThemePreference = parsed.preference || parsed.mode || 'system';
      
      let computedMode: ThemeMode = 'light';
      if (preference === 'system') {
        computedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        computedMode = preference;
      }

      return {
        theme: parsed.theme || 'purple',
        preference,
        mode: computedMode,
        seedColor: parsed.seedColor || '#6750a4',
      };
    }
  } catch {}
  
  const systemMode = (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  return { theme: 'purple', preference: 'system', mode: systemMode, seedColor: '#6750a4' };
};

const apply = (s: ThemeState) => {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', s.theme);
  document.documentElement.setAttribute('data-mode', s.mode);
  document.documentElement.setAttribute('data-preference', s.preference);

  // Generate a dummy light set of colors to get the list of keys to clear
  const dummyColors = generateThemeColors('#6750a4', 'light');
  const keys = Object.keys(dummyColors);

  if (s.theme === 'custom') {
    const colors = generateThemeColors(s.seedColor, s.mode);
    Object.entries(colors).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val);
    });
  } else {
    keys.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
  }
};

// Apply theme immediately (synchronously) when the module is first imported.
apply(read());

export interface ThemeContextValue {
  theme: ThemeName;
  mode: ThemeMode;
  preference: ThemePreference;
  seedColor: string;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  setPreference: (preference: ThemePreference) => void;
  toggleMode: () => void;
  setSeedColor: (seedColor: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useThemeState(): ThemeContextValue {
  const [state, setState] = useState<ThemeState>(read);

  // Menyinkronkan mode visual jika preference diubah atau prefers-color-scheme dari OS berubah
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = () => {
      if (state.preference === 'system') {
        const systemMode = mediaQuery.matches ? 'dark' : 'light';
        setState(s => ({ ...s, mode: systemMode }));
      }
    };

    if (state.preference === 'system') {
      const systemMode = mediaQuery.matches ? 'dark' : 'light';
      if (state.mode !== systemMode) {
        setState(s => ({ ...s, mode: systemMode }));
      }
      mediaQuery.addEventListener('change', handler);
    }
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [state.preference, state.mode]);

  useEffect(() => {
    apply(state);
    try { window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const setTheme = useCallback((theme: ThemeName) => setState(s => ({ ...s, theme })), []);
  
  const setPreference = useCallback((preference: ThemePreference) => {
    setState(s => {
      let nextMode: ThemeMode = s.mode;
      if (preference === 'system') {
        nextMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        nextMode = preference;
      }
      return { ...s, preference, mode: nextMode };
    });
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    // setMode dipetakan langsung ke setPreference demi kompatibilitas kode consumer lama
    setPreference(mode as ThemePreference);
  }, [setPreference]);

  const toggleMode = useCallback(
    () => setState(s => {
      const nextMode: ThemeMode = s.mode === 'light' ? 'dark' : 'light';
      return { ...s, preference: nextMode, mode: nextMode };
    }),
    [],
  );
  
  const setSeedColor = useCallback((seedColor: string) => setState(s => ({ ...s, theme: 'custom', seedColor })), []);

  return {
    theme: state.theme,
    mode: state.mode,
    preference: state.preference,
    seedColor: state.seedColor,
    setTheme,
    setMode,
    setPreference,
    toggleMode,
    setSeedColor
  };
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useThemeState();
  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

