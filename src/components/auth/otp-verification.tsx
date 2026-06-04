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

interface OtpVerificationProps {
  phone: string;
  email: string;
  onVerify: () => void;
  onBack: () => void;
}

export default function OtpVerification({
  phone,
  email,
  onVerify,
  onBack,
}: OtpVerificationProps) {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState("");
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  const isOtpComplete = otp.length === OTP_LENGTH;

  const handleOtpChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtp(cleaned);
  }, []);

  const handleVerify = useCallback(() => {
    if (!isOtpComplete) return;
    onVerify();
  }, [isOtpComplete, onVerify]);

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
          style={styles.otpSubtitle}
        >
          An OTP has been sent to your phone number{" "}
          <Text style={styles.otpBold}>{phone}</Text> and email address{" "}
          <Text style={styles.otpBold}>{email}</Text>
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
          <Text style={styles.otpResendRow}>
            Didn't receive the code?{" "}
            <Text
              style={styles.otpResendLink}
              onPress={() => setOtp("")}
            >
              Resend code
            </Text>
          </Text>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Verify button — only when all digits entered */}
        {isOtpComplete && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Pressable
              onPress={handleVerify}
              style={({ pressed }) => [
                styles.verifyButton,
                pressed
                  ? styles.verifyButtonPressed
                  : styles.verifyButtonDefault,
              ]}
            >
              <Text style={styles.verifyText}>Verify</Text>
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
    marginBottom: 28,
    marginTop: 20,
  },
  otpSubtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 28,
  },
  otpBold: {
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
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  otpBoxFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
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
  otpResendRow: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    color: "#374151",
  },
  otpResendLink: {
    fontWeight: "600",
    color: "#1F2937",
    textDecorationLine: "underline",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  verifyButton: {
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonDefault: {
    backgroundColor: Brand.primaryDark,
  },
  verifyButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  verifyText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
});
