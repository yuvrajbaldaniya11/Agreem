import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { AppText } from '../components/AppText';
import { Icon, IconName } from '../components/Icon';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VISIBLE_MS = 2600;

const ICONS: Record<ToastVariant, IconName> = {
  success: 'check',
  error: 'alert',
  info: 'info',
};

interface ActiveToast extends ToastOptions {
  id: number;
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const [toast, setToast] = useState<ActiveToast | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const clearTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: reduceMotion ? 0 : theme.duration.fast,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setToast(null);
      }
    });
  }, [progress, reduceMotion, theme.duration.fast]);

  const showToast = useCallback(
    ({ message, variant = 'info' }: ToastOptions) => {
      clearTimer();
      counter.current += 1;
      setToast({ id: counter.current, message, variant });
      // Screen readers do not see the animated view appear.
      AccessibilityInfo.announceForAccessibility(message);
    },
    [clearTimer],
  );

  // Animate in whenever a new toast replaces the previous one.
  useEffect(() => {
    if (!toast) {
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: reduceMotion ? 0 : theme.duration.normal,
      useNativeDriver: true,
    }).start();

    hideTimer.current = setTimeout(hide, VISIBLE_MS);
    return clearTimer;
  }, [toast, progress, reduceMotion, theme.duration.normal, hide, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const accent = toast
    ? toast.variant === 'success'
      ? theme.colors.success
      : toast.variant === 'error'
      ? theme.colors.error
      : theme.colors.primary
    : theme.colors.primary;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          pointerEvents="none"
          style={[
            styles.host,
            {
              bottom: insets.bottom + theme.layout.tabBarHeight + theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            },
          ]}>
          <Animated.View
            style={[
              styles.toast,
              theme.elevation.large,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.medium,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                maxWidth: theme.layout.maxContentWidth,
                opacity: progress,
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}>
            <View
              style={[
                styles.dot,
                { backgroundColor: accent + '22', borderRadius: theme.radius.pill },
              ]}>
              <Icon name={ICONS[toast.variant ?? 'info']} size={15} color={accent} strokeWidth={2.2} />
            </View>
            <AppText variant="bodyMD" style={styles.message} numberOfLines={3}>
              {toast.message}
            </AppText>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  message: { flex: 1 },
});

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
};
