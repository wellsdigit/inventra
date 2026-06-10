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
import Svg, { Path } from "react-native-svg";

import BackButton from "@/components/back-button";
import { Brand, Fonts } from "@/constants/theme";

const PIN_LENGTH = 4;

interface SetPasswordProps {
  onNext: (pin: string) => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/** Returns true if any digit is repeated (e.g. 1123, 2244) */
function hasRepeatedDigits(pin: string): boolean {
  for (let i = 1; i < pin.length; i++) {
    if (pin[i] === pin[i - 1]) return true;
  }
  return false;
}

/** Returns true if digits are consecutive ascending or descending (e.g. 1234, 4321) */
function hasConsecutiveDigits(pin: string): boolean {
  let ascending = true;
  let descending = true;
  for (let i = 1; i < pin.length; i++) {
    if (Number(pin[i]) !== Number(pin[i - 1]) + 1) ascending = false;
    if (Number(pin[i]) !== Number(pin[i - 1]) - 1) descending = false;
  }
  return ascending || descending;
}

// ---------------------------------------------------------------------------
// Eye icon component
// ---------------------------------------------------------------------------

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    // Eye open
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
          fill="#6B7280"
        />
      </Svg>
    );
  }
  // Eye closed
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        fill="#6B7280"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// PIN digit boxes
// ---------------------------------------------------------------------------

function PinBoxes({
  value,
  visible,
  focused,
  onPress,
}: {
  value: string;
  visible: boolean;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.pinRow}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => {
        const isFilled = i < value.length;
        const isCurrent = focused && i === value.length;
        return (
          <View
            key={i}
            style={[styles.pinBox, isCurrent && styles.pinBoxFocused]}
          >
            {isFilled && (
              <Text style={styles.pinDigit}>
                {visible ? value[i] : "●"}
              </Text>
            )}
            {isCurrent && <View style={styles.pinCursor} />}
          </View>
        );
      })}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// SetPassword component
// ---------------------------------------------------------------------------

export default function SetPassword({ onNext, onBack }: SetPasswordProps) {
  const insets = useSafeAreaInsets();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeField, setActiveField] = useState<"pin" | "confirm">("pin");

  const pinInputRef = useRef<TextInput>(null);
  const confirmInputRef = useRef<TextInput>(null);

  const pinsMatch = pin.length === PIN_LENGTH && pin === confirmPin;
  const isFormValid = pinsMatch;

  const handlePinChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH);
      setPin(cleaned);
      // Auto-advance to confirm field
      if (cleaned.length === PIN_LENGTH) {
        setTimeout(() => {
          setActiveField("confirm");
          confirmInputRef.current?.focus();
        }, 150);
      }
    },
    [],
  );

  const handleConfirmChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH);
    setConfirmPin(cleaned);
  }, []);

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    onNext(pin);
  }, [isFormValid, pin, onNext]);

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
          Set Your 4-Digit Login Password
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.subtitle}
        >
          Password must contain numbers which cannot be repeated or consecutive
        </Animated.Text>

        {/* Set Password */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.fieldSection}
        >
          <View style={styles.labelRow}>
            <Text style={styles.label}>Set Password</Text>
            <Pressable
              onPress={() => setShowPin((v) => !v)}
              hitSlop={12}
            >
              <EyeIcon visible={showPin} />
            </Pressable>
          </View>
          <PinBoxes
            value={pin}
            visible={showPin}
            focused={activeField === "pin"}
            onPress={() => {
              setActiveField("pin");
              pinInputRef.current?.focus();
            }}
          />
          {/* Hidden input */}
          <TextInput
            ref={pinInputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            autoFocus
            onFocus={() => setActiveField("pin")}
            caretHidden
          />
        </Animated.View>

        {/* Re-Enter Password */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.fieldSection}
        >
          <View style={styles.labelRow}>
            <Text style={styles.label}>Re-Enter Password</Text>
            <Pressable
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={12}
            >
              <EyeIcon visible={showConfirm} />
            </Pressable>
          </View>
          <PinBoxes
            value={confirmPin}
            visible={showConfirm}
            focused={activeField === "confirm"}
            onPress={() => {
              setActiveField("confirm");
              confirmInputRef.current?.focus();
            }}
          />
          {/* Hidden input */}
          <TextInput
            ref={confirmInputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={handleConfirmChange}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            onFocus={() => setActiveField("confirm")}
            caretHidden
          />
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Next button */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
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
    marginBottom: 12,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldSection: {
    marginBottom: 28,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: Fonts?.sans,
    color: "#374151",
  },
  pinRow: {
    flexDirection: "row",
    gap: 16,
  },
  pinBox: {
    width: 52,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  pinBoxFocused: {
    borderColor: Brand.primary,
    borderWidth: 1.5,
  },
  pinDigit: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    color: "#1F2937",
  },
  pinCursor: {
    width: 1.5,
    height: 24,
    backgroundColor: Brand.primary,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
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
