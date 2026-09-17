import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LeaveGuardProvider } from './src/providers/LeaveGuardProvider';
import { ProfileProvider } from './src/providers/ProfileProvider';
import { ThemeProvider, useTheme, useThemePreference } from './src/providers/ThemeProvider';
import { ToastProvider } from './src/providers/ToastProvider';

const AppContent: React.FC = () => {
  const theme = useTheme();
  const { isHydrated } = useThemePreference();

  // Holding the native splash until the stored theme is known means the first
  // frame is already in the right palette — no light flash before dark mode.
  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    BootSplash.hide({ fade: true }).catch(error => {
      console.warn('[splash] hide failed', error);
    });
  }, [isHydrated]);

  return (
    <>
      <SystemBars style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <ProfileProvider>
        <LeaveGuardProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </LeaveGuardProvider>
      </ProfileProvider>
    </>
  );
};

const App: React.FC = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
