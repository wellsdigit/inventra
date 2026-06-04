import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Brand, Fonts } from '@/constants/theme';

const HOLD_MS = 2000; // how long the splash stays fully visible
const FADE_MS = 400; // fade-out duration after the hold

/**
 * Full-screen splash overlay that displays the Inventra logo and brand name,
 * holds for 2 seconds, then fades out to reveal the app beneath.
 */
export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // After HOLD_MS, fade out over FADE_MS then unmount
    opacity.value = withDelay(
      HOLD_MS,
      withTiming(0, { duration: FADE_MS, easing: Easing.out(Easing.ease) }, (finished) => {
        'worklet';
        if (finished) {
          runOnJS(setVisible)(false);
        }
      }),
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      {/* Logo icon */}
      <Animated.View entering={FadeIn.delay(200).duration(1000)}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>

      {/* Brand name */}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Legacy AnimatedIcon (kept for backwards compatibility)
// ---------------------------------------------------------------------------

const ICON_DURATION = 600;
const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;

const { Keyframe } = require('react-native-reanimated');

const keyframe = new Keyframe({
  0: { transform: [{ scale: INITIAL_SCALE_FACTOR }] },
  100: { transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

const logoKeyframe = new Keyframe({
  0: { transform: [{ scale: 1.3 }], opacity: 0 },
  40: { transform: [{ scale: 1.3 }], opacity: 0, easing: Easing.elastic(0.7) },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

const glowKeyframe = new Keyframe({
  0: { transform: [{ rotateZ: '0deg' }] },
  100: { transform: [{ rotateZ: '7200deg' }] },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(ICON_DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(ICON_DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Splash overlay
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
    letterSpacing: 3,
  },

  // Legacy AnimatedIcon styles
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
});
