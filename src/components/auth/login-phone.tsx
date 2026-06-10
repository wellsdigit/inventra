import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import BackButton from "@/components/back-button";
import { Brand, Fonts } from "@/constants/theme";

interface LoginPhoneProps {
  onNext: (phone: string) => void;
}

export default function LoginPhone({ onNext }: LoginPhoneProps) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isValid = phone.length >= 4;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    onNext(phone.trim());
  }, [isValid, phone, onNext]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <BackButton onPress={handleBack} />

        {/* Logo */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.logoWrapper}
        >
          <Image
            source={require("../../../assets/images/logo-icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.heading}
        >
          Log in to your account
        </Animated.Text>

        {/* Phone Number */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.label}>Email or Phone Number</Text>
          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="08012345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Change number link */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Text style={styles.changeRow}>
            Lost Your Phone Number?{" "}
            <Text onPress={() => router.replace("/(auth)/register")} style={styles.changeLink}>Change Now</Text>
          </Text>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Next button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              isValid
                ? pressed
                  ? styles.nextButtonActivePressed
                  : styles.nextButtonActive
                : styles.nextButtonDisabled,
            ]}
            disabled={!isValid}
          >
            <Text
              style={[
                styles.nextText,
                !isValid && styles.nextTextDisabled,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </Animated.View>

        {/* Sign up link */}
        <Animated.View
          entering={FadeInDown.delay(450).duration(400)}
          style={styles.signupRow}
        >
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.replace("/(auth)/register")}
            >
              Sign up
            </Text>
          </Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 28,
  },
  logo: {
    width: 124,
    height: 124,
    marginTop: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
  },
  textInput: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    height: "100%",
  },
  changeRow: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    color: "#6B7280",
    marginBottom: 16,
  },
  changeLink: {
    fontWeight: "600",
    color: "#1F2937",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  nextButton: {
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  nextButtonActive: {
    backgroundColor: Brand.primaryDark,
  },
  nextButtonActivePressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  nextButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
  nextTextDisabled: {
    color: "#9CA3AF",
  },
  signupRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  signupText: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#374151",
  },
  signupLink: {
    fontWeight: "600",
    color: Brand.primary,
  },
});
