import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { Brand, Fonts } from "@/constants/theme";

interface ForgotSuccessProps {
  onLogin: () => void;
}

// ---------------------------------------------------------------------------
// Green checkmark icon
// ---------------------------------------------------------------------------

function GreenCheckmark() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
        fill="#22C55E"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// ForgotSuccess component
// ---------------------------------------------------------------------------

export default function ForgotSuccess({ onLogin }: ForgotSuccessProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        {/* Green checkmark badge */}
        <Animated.View
          entering={ZoomIn.duration(400)}
          style={styles.checkmarkBadge}
        >
          <GreenCheckmark />
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.title}
        >
          Successful
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.subtitle}
        >
          You have successfully change your password
        </Animated.Text>
      </View>

      {/* Log in button */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={styles.buttonWrapper}
      >
        <Pressable
          onPress={onLogin}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
        >
          <Text style={styles.loginText}>Log in</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: "#22C55E",
    marginTop: 28,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts?.sans,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  buttonWrapper: {
    paddingBottom: 24,
  },
  loginButton: {
    backgroundColor: Brand.primaryDark,
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
  loginButtonPressed: {
    backgroundColor: Brand.primary,
    transform: [{ scale: 0.98 }],
  },
  loginText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts?.sans,
    color: Brand.onPrimary,
  },
});
