import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '@/store/app-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const setOffline = useAppStore((state) => state.setOffline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // If isConnected is explicitly false, or if it is null (unknown) but we assume offline
      // For standard behavior, if it's strictly false we are definitely offline
      setOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, [setOffline]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
