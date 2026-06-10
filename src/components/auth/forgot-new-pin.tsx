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
import Svg, { Path } from "react-native-svg";

import BackButton from "@/components/back-button";
import { Brand, Fonts } from "@/constants/theme";

const PIN_LENGTH = 4;

interface ForgotNewPinProps {
  onContinue: (pin: string) => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Eye icon
// ---------------------------------------------------------------------------

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
          fill="#9CA3AF"
        />
      </Svg>
    );
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        fill="#9CA3AF"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// ForgotNewPin component
// ---------------------------------------------------------------------------

export default function ForgotNewPin({ onContinue, onBack }: ForgotNewPinProps) {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPinFocused, setIsPinFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const pinsMatch = pin.length === PIN_LENGTH && pin === confirmPin;

  const handlePinChange = useCallback((text: string) => {
    setPin(text.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH));
  }, []);

  const handleConfirmChange = useCallback((text: string) => {
    setConfirmPin(text.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH));
  }, []);

  const handleContinue = useCallback(() => {
    if (!pinsMatch) return;
    onContinue(pin);
  }, [pinsMatch, pin, onContinue]);

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
          Create New Password
        </Animated.Text>

        {/* Enter New Password */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.label}>Enter New Password</Text>
          <View
            style={[
              styles.inputWrapper,
              isPinFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={pin}
              onChangeText={handlePinChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              autoFocus
              secureTextEntry={!showPin}
              onFocus={() => setIsPinFocused(true)}
              onBlur={() => setIsPinFocused(false)}
              caretHidden
            />
            <Pressable
              onPress={() => setShowPin((v) => !v)}
              hitSlop={12}
              style={styles.eyeButton}
            >
              <EyeIcon visible={showPin} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Confirm Password */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.inputWrapper,
              isConfirmFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={confirmPin}
              onChangeText={handleConfirmChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              secureTextEntry={!showConfirm}
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={() => setIsConfirmFocused(false)}
              caretHidden
            />
            <Pressable
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={12}
              style={styles.eyeButton}
            >
              <EyeIcon visible={showConfirm} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              pinsMatch
                ? pressed
                  ? styles.continueButtonPressed
                  : styles.continueButtonDefault
                : styles.continueButtonDisabled,
            ]}
            disabled={!pinsMatch}
          >
            <Text
              style={[
                styles.continueText,
                !pinsMatch && styles.continueTextDisabled,
              ]}
            >
              Continue
            </Text>
          </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    height: "100%",
    letterSpacing: 4,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonDefault: {
    backgroundColor: Brand.primaryDark,
  },
  continueButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  continueButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  continueText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
  continueTextDisabled: {
    color: "#9CA3AF",
  },
});
