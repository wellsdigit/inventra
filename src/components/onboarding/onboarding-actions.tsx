import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Fonts } from "@/constants/theme";

interface OnboardingActionsProps {
  isLastSlide: boolean;
  onSkip: () => void;
  onNext: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function OnboardingActions({
  isLastSlide,
  onSkip,
  onNext,
  onGetStarted,
  onLogin,
}: OnboardingActionsProps) {
  if (isLastSlide) {
    return (
      <View style={styles.lastSlideActions}>
        {/* Get Started button */}
        <Pressable
          onPress={onGetStarted}
          style={({ pressed }) => [
            styles.getStartedButton,
            pressed && styles.getStartedButtonPressed,
          ]}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </Pressable>

        {/* I Already Have An Account */}
        <Pressable
          onPress={onLogin}
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
    );
  }

  return (
    <View style={styles.navRow}>
      <Pressable
        onPress={onSkip}
        hitSlop={12}
        style={({ pressed }) => [
          styles.skipButton,
          pressed && styles.skipButtonPressed,
        ]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        style={({ pressed }) => [
          styles.nextButton,
          pressed && styles.nextButtonPressed,
        ]}
      >
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
