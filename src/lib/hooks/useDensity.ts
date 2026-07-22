import { createContext, useCallback, useContext, useEffect, useState, ReactNode, createElement } from 'react';

export type ComponentDensity = 'comfortable' | 'compact';

const STORAGE_KEY = 'md3-density';

export interface DensityContextValue {
  density: ComponentDensity;
  setDensity: (density: ComponentDensity) => void;
  toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextValue | null>(null);

const readDensity = (): ComponentDensity => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'comfortable';
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'compact' || raw === 'comfortable') return raw;
  } catch {}
  return 'comfortable';
};

const applyDensity = (density: ComponentDensity) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-density', density);
};

// Synchronously apply initial density attribute
applyDensity(readDensity());

export interface DensityProviderProps {
  children: ReactNode;
  defaultDensity?: ComponentDensity;
}

export function DensityProvider({ children, defaultDensity }: DensityProviderProps) {
  const [density, setDensityState] = useState<ComponentDensity>(() => defaultDensity ?? readDensity());

  useEffect(() => {
    applyDensity(density);
    try {
      window.localStorage?.setItem(STORAGE_KEY, density);
    } catch {}
  }, [density]);

  const setDensity = useCallback((d: ComponentDensity) => {
    setDensityState(d);
  }, []);

  const toggleDensity = useCallback(() => {
    setDensityState(prev => (prev === 'comfortable' ? 'compact' : 'comfortable'));
  }, []);

  return createElement(DensityContext.Provider, { value: { density, setDensity, toggleDensity } }, children);
}

/**
 * Hook to access global density context.
 */
export function useDensityContext(): DensityContextValue | null {
  return useContext(DensityContext);
}

/**
 * Hook to resolve component density: returns local override if provided,
 * otherwise falls back to global DensityContext, or default 'comfortable'.
 */
export function useDensity(localDensity?: ComponentDensity): ComponentDensity {
  const context = useContext(DensityContext);
  if (localDensity) return localDensity;
  return context?.density ?? 'comfortable';
}
