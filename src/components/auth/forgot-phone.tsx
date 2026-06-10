import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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

interface ForgotPhoneProps {
  onNext: (phone: string) => void;
  onBack: () => void;
}

export default function ForgotPhone({ onNext, onBack }: ForgotPhoneProps) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined,
  );
  const [isFocused, setIsFocused] = useState(false);

  const isValid = selectedCountry
    ? isValidPhoneNumber(phone, selectedCountry)
    : false;

  const handleNext = useCallback(() => {
    if (!isValid) return;
    const rawPhone = phone.replace(/[^0-9]/g, "");
    onNext(rawPhone);
  }, [isValid, phone, onNext]);

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
          Forgot Password
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.subtitle}
        >
          Enter your phone number
        </Animated.Text>

        {/* Phone Input */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PhoneInput
            value={phone}
            onChangePhoneNumber={setPhone}
            country={selectedCountry}
            onChangeCountry={setSelectedCountry}
            defaultCountry="NG"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            customCaret={() => <></>}
            placeholder="080 1234 5678"
            phoneInputStyles={{
              container: [
                styles.phoneInputContainer,
                isFocused && styles.inputFocused,
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
    marginBottom: 12,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 24,
  },
  phoneInputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
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
  inputFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  nextButton: {
    paddingVertical: 18,
    borderRadius: 6,
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
