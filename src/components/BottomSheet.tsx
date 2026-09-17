import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../providers/ThemeProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Fraction of the screen height the sheet is allowed to occupy. */
  heightRatio?: number;
  /** Hugs content height (capped at heightRatio) instead of a fixed fraction — for short menus. */
  autoHeight?: boolean;
}

/**
 * The app's single sheet primitive. Android back and backdrop taps both close
 * it, and the exit animation is allowed to finish before the Modal unmounts.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  heightRatio = 0.82,
  autoHeight = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: reduceMotion ? 0 : theme.duration.normal,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: reduceMotion ? 0 : theme.duration.fast,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, progress, reduceMotion, theme.duration.fast, theme.duration.normal]);

  // Hardware back closes the sheet before the navigator ever sees the event.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onClose]);

  const handleBackdrop = useCallback(() => onClose(), [onClose]);

  if (!mounted) {
    return null;
  }

  const maxSheetHeight = Math.round(height * heightRatio);

  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay, opacity: progress }]}>
          <Pressable
            style={styles.flex}
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={handleBackdrop}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            theme.elevation.large,
            autoHeight ? { maxHeight: maxSheetHeight } : { height: maxSheetHeight },
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderTopLeftRadius: theme.radius.large,
              borderTopRightRadius: theme.radius.large,
              paddingBottom: insets.bottom,
              transform: [
                {
                  // Slides in from beyond the bottom edge; using the full window
                  // height (rather than the sheet's own, possibly content-driven,
                  // height) avoids measuring layout before the animation can start.
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={[styles.grabberRow, { paddingTop: theme.spacing.sm }]}>
            <View style={[styles.grabber, { backgroundColor: theme.colors.borderStrong }]} />
          </View>
          <View
            style={[
              styles.header,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingBottom: theme.spacing.sm,
                borderBottomColor: theme.colors.divider,
              },
            ]}>
            <AppText variant="headingMD" style={styles.flex} numberOfLines={1}>
              {title}
            </AppText>
            <IconButton icon="close" label={`Close ${title}`} onPress={onClose} size={18} />
          </View>
          <View style={autoHeight ? undefined : styles.flex}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  flex: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { width: '100%', overflow: 'hidden' },
  grabberRow: { alignItems: 'center' },
  grabber: { width: 40, height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
