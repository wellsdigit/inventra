import { useCallback, useState } from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "rn-international-phone-number";

import BackButton from "@/components/back-button";
import { Brand, Fonts } from "@/constants/theme";
import { router } from "expo-router";

interface CreateAccountFormProps {
  onNext: (phone: string, email: string) => void;
}

export default function CreateAccountForm({ onNext }: CreateAccountFormProps) {
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined,
  );
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Validations
  const isPhoneValid = selectedCountry
    ? isValidPhoneNumber(phone, selectedCountry)
    : false;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isPhoneValid && isEmailValid && agreed;

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    const rawPhone = phone.replace(/[^0-9]/g, "");
    onNext(rawPhone, email);
  }, [isFormValid, phone, email, onNext]);

  const handleBack = useCallback(() => {
    router.replace("/onboarding");
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
                container: [
                  styles.phoneInputContainer,
                  isPhoneFocused && styles.inputFocused,
                ],
                flagContainer: styles.phoneFlagContainer,
                flag: styles.phoneFlag,
                callingCode: styles.phoneCallingCode,
                divider: styles.phoneDivider,
                input: styles.phoneInputText,
                caret: { display: "none" },
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
  phoneInputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 58,
    marginBottom: 24,
  },
  phoneFlagContainer: {
    backgroundColor: "transparent",
    paddingLeft: 16,
    paddingRight: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  phoneFlag: {
    fontSize: 28,
  },
  phoneCallingCode: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
  },
  phoneDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 8,
  },
  phoneInputText: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: "#1F2937",
    paddingHorizontal: 12,
  },
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
});
