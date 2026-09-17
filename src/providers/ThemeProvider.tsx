import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';
import { createTheme, Theme, ThemeMode, ThemePreference } from '../theme';
import { readJSON, StorageKey, writeJSON } from '../services/storage';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** True once the stored preference has been read, so we never flash the wrong theme. */
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const systemScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    readJSON<ThemePreference>(StorageKey.themePreference).then(stored => {
      if (mounted && isPreference(stored)) {
        setPreferenceState(stored);
      }
      if (mounted) {
        setHydrated(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeJSON(StorageKey.themePreference, next);
  }, []);

  const mode: ThemeMode = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const shortestSide = Math.min(width, height);
  const theme = useMemo(() => createTheme(mode, shortestSide), [mode, shortestSide]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, isHydrated }),
    [theme, preference, setPreference, isHydrated],
  );

  return (
    <ThemeContext.Provider value={value}>
      {/*
       * Deliberately a plain View, not an animated cross-fade: an opacity
       * animation here promotes this whole subtree to an Android hardware
       * layer at the exact moment a Card's `elevation` prop flips between 0
       * and non-zero (dark mode drops elevation entirely — see theme/index.ts),
       * which is what was leaving stale shadow-shaped rectangles behind on
       * every theme toggle, on every screen.
       */}
      <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>{children}</View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context.theme;
};

export const useThemePreference = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used inside ThemeProvider');
  }
  return context;
};
