import { type ImageSource } from "expo-image";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OnboardingActions from "@/components/onboarding/onboarding-actions";
import OnboardingSlider, {
  type OnboardingSlide,
  type OnboardingSliderRef,
} from "@/components/onboarding/onboarding-slider";
import { Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Onboarding slide data
// ---------------------------------------------------------------------------

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

const LAST_INDEX = SLIDES.length - 1;

// ---------------------------------------------------------------------------
// Onboarding screen
// ---------------------------------------------------------------------------

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<OnboardingSliderRef>(null);

  const isLastSlide = currentIndex === LAST_INDEX;

  const handleSkip = useCallback(() => {
    sliderRef.current?.scrollToIndex(LAST_INDEX);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < LAST_INDEX) {
      sliderRef.current?.scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  const handleGetStarted = useCallback(() => {
    router.replace("/(auth)/register");
  }, []);

  const handleLogin = useCallback(() => {
    router.replace("/(auth)/login");
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Illustration carousel + dots */}
      <OnboardingSlider
        ref={sliderRef}
        slides={SLIDES}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      {/* Bottom content */}
      <View style={styles.bottomSection}>
        {/* Title */}
        <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>

        {/* Description */}
        <Text style={styles.description}>
          {SLIDES[currentIndex].description}
        </Text>

        {/* Spacer pushes buttons to bottom */}
        <View style={styles.spacer} />

        {/* Navigation buttons */}
        <OnboardingActions
          isLastSlide={isLastSlide}
          onSkip={handleSkip}
          onNext={handleNext}
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles (only layout-level styles remain here)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 16,
  },
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
    color: "#6B7280",
    lineHeight: 24,
  },
  spacer: {
    flex: 1,
  },
});
