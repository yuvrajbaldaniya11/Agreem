import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../providers/ThemeProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { AppText } from '../components/AppText';
import { Icon, IconName } from '../components/Icon';
import { useLeaveGuard } from '../providers/LeaveGuardProvider';
import { haptics } from '../utils/haptics';
import { RootTabParamList } from './types';

const TAB_ICONS: Record<keyof RootTabParamList, IconName> = {
  Home: 'home',
  Listing: 'list',
  Settings: 'settings',
};

interface TabItemProps {
  focused: boolean;
  label: string;
  icon: IconName;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ focused, label, icon, onPress, onLongPress }) => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(focused ? 1 : 0);
      return;
    }
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [focused, progress, reduceMotion]);

  const color = focused ? theme.colors.primary : theme.colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      android_ripple={{ color: theme.colors.primarySoft, borderless: true, radius: 40 }}
      style={styles.item}>
      <View style={styles.iconWrap}>
        {/* Active pill scales up behind the icon rather than sliding across, so
            it stays correct no matter how wide the labels are. */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: theme.colors.primarySoft,
              borderRadius: theme.radius.pill,
              opacity: progress,
              transform: [
                { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                { scaleY: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
              ],
            },
          ]}
        />
        <Icon name={icon} size={21} color={color} strokeWidth={focused ? 2.1 : 1.8} />
      </View>
      <AppText
        variant="caption"
        rawColor={color}
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { requestLeave } = useLeaveGuard();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, theme.spacing.xs),
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
        },
      ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            // The focused screen may hold unsaved work; it decides when to let go.
            requestLeave(() => {
              haptics.selection();
              navigation.navigate(route.name);
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            focused={focused}
            label={label}
            icon={TAB_ICONS[route.name as keyof RootTabParamList]}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Keeps the row at a comfortable touch height on short devices too.
    minHeight: 46,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 28,
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    marginTop: 3,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
});
