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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "@/components/back-button";
import { Brand, Fonts } from "@/constants/theme";

interface SetupAccountProps {
  onNext: (businessName: string, location: string) => void;
  onBack: () => void;
}

export default function SetupAccount({ onNext, onBack }: SetupAccountProps) {
  const insets = useSafeAreaInsets();

  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const isFormValid = businessName.trim().length > 0;

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    onNext(businessName.trim(), location.trim());
  }, [isFormValid, businessName, location, onNext]);

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
        <BackButton onPress={onBack} />

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.heading}
        >
          Setup Your Account
        </Animated.Text>

        {/* Business Name */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.label}>Business Name</Text>
          <View
            style={[
              styles.inputWrapper,
              isNameFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter business name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              value={businessName}
              onChangeText={setBusinessName}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.label}>Location</Text>
          <View
            style={[
              styles.inputWrapper,
              isLocationFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter shop location"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              value={location}
              onChangeText={setLocation}
              onFocus={() => setIsLocationFocused(true)}
              onBlur={() => setIsLocationFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Next button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              isFormValid
                ? pressed
                  ? styles.nextButtonActivePressed
                  : styles.nextButtonActive
                : styles.nextButtonDisabled,
            ]}
            disabled={!isFormValid}
          >
            <Text
              style={[
                styles.nextText,
                !isFormValid && styles.nextTextDisabled,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 26,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    marginBottom: 28,
    marginTop: 20,
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
    marginBottom: 24,
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
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  nextButton: {
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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
});
