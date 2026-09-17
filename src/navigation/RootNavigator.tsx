import React, { useMemo } from 'react';
import { DefaultTheme, DarkTheme, NavigationContainer, Theme as NavTheme } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../providers/ThemeProvider';
import { fontFamily } from '../theme';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ListingScreen } from '../screens/Listing/ListingScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { TabBar } from './TabBar';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** Defined once so the navigator never remounts the bar between renders. */
const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

export const RootNavigator: React.FC = () => {
  const theme = useTheme();

  // Feeding the palette into react-navigation keeps the container background
  // (visible during transitions) in step with the active theme.
  const navigationTheme = useMemo<NavTheme>(() => {
    const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark: theme.mode === 'dark',
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.divider,
        notification: theme.colors.primary,
      },
      fonts: {
        regular: { fontFamily: fontFamily.regular, fontWeight: '400' },
        medium: { fontFamily: fontFamily.medium, fontWeight: '500' },
        bold: { fontFamily: fontFamily.semiBold, fontWeight: '600' },
        heavy: { fontFamily: fontFamily.bold, fontWeight: '700' },
      },
    };
  }, [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          // Blurred tabs stop re-rendering, which keeps theme switches cheap.
          freezeOnBlur: true,
          sceneStyle: { backgroundColor: theme.colors.background },
        }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Listing" component={ListingScreen} options={{ title: 'Directory' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
