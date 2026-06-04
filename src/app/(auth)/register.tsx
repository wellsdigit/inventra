import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "rn-international-phone-number";

import { Brand, Fonts } from "@/constants/theme";
import Svg, { Path } from "react-native-svg";

// ---------------------------------------------------------------------------
// Create Account screen
// ---------------------------------------------------------------------------

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined,
  );
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  const OTP_LENGTH = 6;
  const isOtpComplete = otp.length === OTP_LENGTH;

  // Validations
  const isPhoneValid = selectedCountry
    ? isValidPhoneNumber(phone, selectedCountry)
    : false;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isPhoneValid && isEmailValid && agreed;

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    setIsOtpStep(true);
  }, [isFormValid]);

  const handleVerify = useCallback(() => {
    if (!isOtpComplete) return;
    setIsSuccess(true);
  }, [isOtpComplete]);

  const handleOtpChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtp(cleaned);
  }, []);

  const handleOtpBack = useCallback(() => {
    setIsOtpStep(false);
    setOtp("");
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Extract raw phone digits for display on OTP screen
  const rawPhone = phone.replace(/[^0-9]/g, "");

  // ── OTP Screen ──────────────────────────────────────────────────────────
  if (isOtpStep && !isSuccess) {
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
          {/* Back button */}
          <Pressable
            onPress={handleOtpBack}
            hitSlop={16}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backArrow}>
              <Svg width={10} height={19} viewBox="0 0 10 19" fill="none">
                <Path
                  d="M0.5436 10.8707C-0.1812 10.1006 -0.1812 8.89937 0.5436 8.12927L7.89855 0.314638C8.27707 -0.0875356 8.90994 -0.106714 9.31212 0.271803C9.71429 0.650319 9.73347 1.28319 9.35495 1.68537L2 9.5L9.35495 17.3146C9.73347 17.7168 9.71429 18.3497 9.31212 18.7282C8.90994 19.1067 8.27707 19.0875 7.89855 18.6854L0.5436 10.8707Z"
                  fill="#101928"
                />
              </Svg>
            </Text>
          </Pressable>

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
            <Text style={styles.otpBold}>{rawPhone}</Text> and email address{" "}
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
                  styles.nextButton,
                  pressed
                    ? styles.nextButtonActivePressed
                    : styles.nextButtonActive,
                ]}
              >
                <Text style={styles.nextText}>Verify</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (isSuccess) {
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
        {/* Back button */}
        <Pressable
          onPress={handleBack}
          hitSlop={16}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backArrow}>
      {/* 2. Swap web tags out for React Native Svg equivalents */}
      <Svg
        width={10}
        height={19}
        viewBox="0 0 10 19"
        fill="none"
      >
        <Path
          d="M0.5436 10.8707C-0.1812 10.1006 -0.1812 8.89937 0.5436 8.12927L7.89855 0.314638C8.27707 -0.0875356 8.90994 -0.106714 9.31212 0.271803C9.71429 0.650319 9.73347 1.28319 9.35495 1.68537L2 9.5L9.35495 17.3146C9.73347 17.7168 9.71429 18.3497 9.31212 18.7282C8.90994 19.1067 8.27707 19.0875 7.89855 18.6854L0.5436 10.8707Z"
          fill="#101928"
        />
      </Svg>
    </Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Animated.Text
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.heading}
          >
            Create Account
          </Animated.Text>

          {/* Phone Number */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.label}>Phone Number</Text>
            <PhoneInput
              value={phone}
              onChangePhoneNumber={setPhone}
              country={selectedCountry}
              onChangeCountry={setSelectedCountry}
              defaultCountry="NG"
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              customCaret={() => <></>}
              placeholder="080 1234 5678"
              phoneInputStyles={{
                container: [styles.phoneInputContainer, isPhoneFocused && styles.inputFocused],
                flagContainer: styles.phoneFlagContainer,
                flag: styles.phoneFlag,
                callingCode: styles.phoneCallingCode,
                divider: styles.phoneDivider,
                input: styles.phoneInputText,
                caret: { display: 'none' },
              }}
            />
          </Animated.View>

          {/* Email Address */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                (isEmailFocused || isEmailValid) && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Enter Email Address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
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

          {/* Terms checkbox */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.termsRow}
          >
            <Pressable
              onPress={() => setAgreed((v) => !v)}
              style={[
                styles.checkbox,
                agreed ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
              hitSlop={8}
            >
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={styles.termsText}>
              I have read, understand and agreed to the{" "}
              <Text style={styles.termsLink}>Terms & Conditions</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Back button
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  backButtonPressed: {
    opacity: 0.4,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: "300",
    color: "#1F2937",
  },

  // Heading
  heading: {
    fontSize: 26,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    marginBottom: 28,
    marginTop: 20,
  },

  // Labels
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#374151",
    marginBottom: 8,
  },

  // Custom Phone Input Styles
  phoneInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 58,
    marginBottom: 24,
  },
  phoneFlagContainer: {
    backgroundColor: 'transparent',
    paddingLeft: 16,
    paddingRight: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  phoneFlag: {
    fontSize: 28,
  },
  phoneCallingCode: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts?.sans,
    color: '#1F2937',
  },
  phoneDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  phoneInputText: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: '#1F2937',
    paddingHorizontal: 12,
  },

  // Input wrapper
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
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

  // Spacer
  spacer: {
    flex: 1,
    minHeight: 40,
  },

  // Next button
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

  // Terms
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  checkboxUnchecked: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: Brand.primary,
    borderWidth: 0,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts?.sans,
    color: "#374151",
    lineHeight: 20,
  },
  termsLink: {
    color: Brand.primary,
    fontWeight: "600",
  },

  // OTP Screen Styles
  otpSubtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 28,
  },
  otpBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  otpBoxFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
    color: '#1F2937',
  },
  otpCursor: {
    width: 1.5,
    height: 24,
    backgroundColor: Brand.primary,
  },
  otpHiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpResendRow: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    color: '#374151',
  },
  otpResendLink: {
    fontWeight: '600',
    color: '#1F2937',
    textDecorationLine: 'underline',
  },

  // Success Screen Styles
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
