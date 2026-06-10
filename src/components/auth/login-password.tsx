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

interface LoginPasswordProps {
  onLogin: (pin: string) => void;
  onBack: () => void;
  onForgotPassword?: () => void;
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
// LoginPassword component
// ---------------------------------------------------------------------------

export default function LoginPassword({ onLogin, onBack, onForgotPassword }: LoginPasswordProps) {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = pin.length === PIN_LENGTH;

  const handleChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH);
    setPin(cleaned);
  }, []);

  const handleLogin = useCallback(() => {
    if (!isValid) return;
    onLogin(pin);
  }, [isValid, pin, onLogin]);

  // Display value: dots or digits depending on visibility
  const displayValue = showPin ? pin : "*".repeat(pin.length);

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
          Welcome back
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.subtitle}
        >
          Enter your 4-digit Password to log in
        </Animated.Text>

        {/* Password input */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={pin}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              autoFocus
              secureTextEntry={!showPin}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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

          {/* Forgot Password */}
          <View style={styles.forgotRow}>
            <Pressable hitSlop={8} onPress={onForgotPassword}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Log in button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              isValid
                ? pressed
                  ? styles.loginButtonActivePressed
                  : styles.loginButtonActive
                : styles.loginButtonDisabled,
            ]}
            disabled={!isValid}
          >
            <Text
              style={[
                styles.loginText,
                !isValid && styles.loginTextDisabled,
              ]}
            >
              Log in
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
    marginBottom: 46,
    marginTop: 36,
    // marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#374151",
    marginBottom: 16,
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
  forgotRow: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: Brand.primary,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  loginButton: {
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonActive: {
    backgroundColor: Brand.primaryDark,
  },
  loginButtonActivePressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  loginButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
  loginTextDisabled: {
    color: "#9CA3AF",
  },
});
