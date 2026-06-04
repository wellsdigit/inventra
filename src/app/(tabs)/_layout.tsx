import AppTabs from '@/components/app-tabs';
import * as SplashScreen from 'expo-splash-screen';

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function TabLayout() {
  return <AppTabs />;
}
