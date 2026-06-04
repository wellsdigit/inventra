import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Brand, Fonts } from "@/constants/theme";

export default function VerificationSuccess() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.successContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.successContent}>
        {/* Circular checkmark badge */}
        <Animated.View
          entering={ZoomIn.duration(400)}
          style={styles.checkmarkBadge}
        >
          <Text style={styles.checkmarkIcon}>✓</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.successTitle}
        >
          Successful
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.successSubtitle}
        >
          Verification successful
        </Animated.Text>
      </View>

      {/* Continue button */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={styles.continueButtonWrapper}
      >
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  successContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkmarkIcon: {
    fontSize: 48,
    color: "#346119",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: "#346119",
    marginTop: 28,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  continueButtonWrapper: {
    paddingBottom: 24,
  },
  continueButton: {
    backgroundColor: Brand.primaryDark,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  continueButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
});
