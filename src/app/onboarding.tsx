import { Image, type ImageSource } from "expo-image";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand, Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Onboarding slide data
// ---------------------------------------------------------------------------

interface OnboardingSlide {
  id: string;
  image: ImageSource;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    image: require("@/assets/images/onboarding/1.png"),
    title: "Track your Inventory\nSmarter",
    description: "Keep records of your goods\nand always update your shelf.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding/2.png"),
    title: "Run your Business\nwith Better Tools",
    description:
      "Get the information you need with\ngood accessibility to your dashboard",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding/3.png"),
    title: "Know what is Running\nLow",
    description:
      "Get daily notification of your products that\nneed restocking before they finish.",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LAST_INDEX = SLIDES.length - 1;

// ---------------------------------------------------------------------------
// Page indicator dots
// ---------------------------------------------------------------------------

function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Onboarding screen
// ---------------------------------------------------------------------------

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  // Animated opacity for the bottom content to crossfade on slide change
  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const isLastSlide = currentIndex === LAST_INDEX;

  // Track visible slide
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleSkip = useCallback(() => {
    // Jump to the last slide
    flatListRef.current?.scrollToIndex({
      index: LAST_INDEX,
      animated: true,
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < LAST_INDEX) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleGetStarted = useCallback(() => {
    router.replace("/(auth)/register");
  }, []);

  const handleLogin = useCallback(() => {
    router.replace("/(auth)/login");
  }, []);

  // Render a single slide
  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <View style={styles.illustrationContainer}>
          <Image
            source={item.image}
            style={styles.illustration}
            contentFit="contain"
            transition={300}
          />
        </View>
      </View>
    ),
    [],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Illustration carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />

      {/* Bottom content */}
      <View style={styles.bottomSection}>
        {/* Page dots */}
        <PageDots total={SLIDES.length} current={currentIndex} />

        {/* Title */}
        <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>

        {/* Description */}
        <Text style={styles.description}>
          {SLIDES[currentIndex].description}
        </Text>

        {/* Spacer pushes buttons to bottom */}
        <View style={styles.spacer} />

        {/* Navigation — changes on the last slide */}
        {isLastSlide ? (
          <View style={styles.lastSlideActions}>
            {/* Get Started button */}
            <Pressable
              onPress={handleGetStarted}
              style={({ pressed }) => [
                styles.getStartedButton,
                pressed && styles.getStartedButtonPressed,
              ]}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>

            {/* I Already Have An Account */}
            <Pressable
              onPress={handleLogin}
              hitSlop={12}
              style={({ pressed }) => [
                styles.loginLink,
                pressed && styles.loginLinkPressed,
              ]}
            >
              <Text style={styles.loginLinkText}>
                I Already Have An Account
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.navRow}>
            <Pressable
              onPress={handleSkip}
              hitSlop={12}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.skipButtonPressed,
              ]}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.nextButtonPressed,
              ]}
            >
              <Text style={styles.nextText}>Next</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
  },
  flatList: {
    flexGrow: 0,
    flexShrink: 0,
  },
  slide: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  illustrationContainer: {
    width: SCREEN_WIDTH * 0.85,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "90%",
    height: "100%",
  },

  // Bottom content area
  bottomSection: {
    // flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 16,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 14,
    borderRadius: 25,
  },
  dotActive: {
    width: 28,
    backgroundColor: Brand.primary,
  },
  dotInactive: {
    width: 11,
    height: 11,
    backgroundColor: Brand.inactive,
  },

  // Typography
  title: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: Brand.textMuted,
    lineHeight: 24,
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // Navigation — Slides 1 & 2
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 66,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  skipButtonPressed: {
    opacity: 0.5,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
  },
  nextButton: {
    backgroundColor: Brand.primaryDark,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 140,
    alignItems: "center",
  },
  nextButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.97 }],
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },

  // Navigation — Last slide
  lastSlideActions: {
    gap: 16,
    alignItems: "center",
    marginTop: 50,
  },
  getStartedButton: {
    backgroundColor: Brand.primaryDark,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  getStartedButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
  loginLink: {
    paddingVertical: 8,
  },
  loginLinkPressed: {
    opacity: 0.5,
  },
  loginLinkText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    color: Brand.primary,
  },
});
