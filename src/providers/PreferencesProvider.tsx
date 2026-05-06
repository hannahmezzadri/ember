import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Density = 'default' | 'condensed';

type PreferencesContextValue = {
  theme: Theme;
  density: Density;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
  toggleTheme: () => void;
  toggleDensity: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const STORAGE_KEY = 'ember.preferences.v1';

type Stored = { theme: Theme; density: Density };

function loadStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      return {
        theme: parsed.theme === 'dark' ? 'dark' : 'light',
        density: parsed.density === 'condensed' ? 'condensed' : 'default',
      };
    }
  } catch {
    // ignore
  }
  return { theme: 'light', density: 'default' };
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(loadStored);
  const [theme, setTheme] = useState<Theme>(stored.theme);
  const [density, setDensity] = useState<Density>(stored.density);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-density', density);
    document.documentElement.setAttribute('data-brand', 'ember');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, density }));
  }, [theme, density]);

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        density,
        setTheme,
        setDensity,
        toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
        toggleDensity: () => setDensity((d) => (d === 'default' ? 'condensed' : 'default')),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
