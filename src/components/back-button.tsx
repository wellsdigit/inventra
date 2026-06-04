import { Pressable, StyleSheet, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
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
  );
}

const styles = StyleSheet.create({
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
});
