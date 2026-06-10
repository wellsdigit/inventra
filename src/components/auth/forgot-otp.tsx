import { useCallback, useRef, useState } from "react";
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

const OTP_LENGTH = 6;

interface ForgotOtpProps {
  /** Raw digits of the phone, e.g. "08012345678" */
  phone: string;
  onContinue: () => void;
  onBack: () => void;
}

/** Mask phone: keep first 4 and last 2 digits, replace rest with * */
function maskPhone(phone: string): string {
  if (phone.length <= 6) return phone;
  const prefix = phone.slice(0, 4);
  const suffix = phone.slice(-2);
  const stars = "*".repeat(phone.length - 6);
  return `+234 ${prefix}${stars}${suffix}`;
}

export default function ForgotOtp({
  phone,
  onContinue,
  onBack,
}: ForgotOtpProps) {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState("");
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  const isOtpComplete = otp.length === OTP_LENGTH;
  const masked = maskPhone(phone);

  const handleOtpChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtp(cleaned);
  }, []);

  const handleContinue = useCallback(() => {
    if (!isOtpComplete) return;
    onContinue();
  }, [isOtpComplete, onContinue]);

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
          Enter OTP
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.subtitle}
        >
          We have sent an OTP to{" "}
          <Text style={styles.subtitleBold}>{masked}</Text>
        </Animated.Text>

        {/* OTP Boxes */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.otpRow}
        >
          <Pressable
            style={styles.otpRow}
            onPress={() => otpInputRef.current?.focus()}
          >
            {Array.from({ length: OTP_LENGTH }).map((_, i) => {
              const isFilled = i < otp.length;
              const isCurrent = isOtpFocused && i === otp.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.otpBox,
                    isFilled && styles.otpBoxFilled,
                    isCurrent && styles.otpBoxFocused,
                  ]}
                >
                  {isFilled && (
                    <Text style={styles.otpDigit}>{otp[i]}</Text>
                  )}
                  {isCurrent && <View style={styles.otpCursor} />}
                </View>
              );
            })}
          </Pressable>

          {/* Hidden input */}
          <TextInput
            ref={otpInputRef}
            style={styles.otpHiddenInput}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            onFocus={() => setIsOtpFocused(true)}
            onBlur={() => setIsOtpFocused(false)}
            caretHidden
          />
        </Animated.View>

        {/* Resend */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={styles.resendRow}>
            Didn't receive the code?{" "}
            <Text
              style={styles.resendLink}
              onPress={() => setOtp("")}
            >
              Resend code
            </Text>
          </Text>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue button — only when all digits entered */}
        {isOtpComplete && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                pressed
                  ? styles.continueButtonPressed
                  : styles.continueButtonDefault,
              ]}
            >
              <Text style={styles.continueText}>Continue</Text>
            </Pressable>
          </Animated.View>
        )}
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
    marginBottom: 16,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 28,
  },
  subtitleBold: {
    fontWeight: "700",
    color: "#1F2937",
  },
  otpRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  otpBoxFilled: {
    backgroundColor: "#FFFFFF",
  },
  otpBoxFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
  },
  otpCursor: {
    width: 1.5,
    height: 24,
    backgroundColor: Brand.primary,
  },
  otpHiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendRow: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    color: "#374151",
  },
  resendLink: {
    fontWeight: "600",
    color: "#1F2937",
    textDecorationLine: "underline",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
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
  continueText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
});
