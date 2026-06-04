import { Image, type ImageSource } from "expo-image";
import {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from "react-native";

import { Brand } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnboardingSlide {
  id: string;
  image: ImageSource;
  title: string;
  description: string;
}

export interface OnboardingSliderRef {
  scrollToIndex: (index: number) => void;
}

interface OnboardingSliderProps {
  slides: OnboardingSlide[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Page indicator dots
// ---------------------------------------------------------------------------

function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Slider component
// ---------------------------------------------------------------------------

const OnboardingSlider = forwardRef<OnboardingSliderRef, OnboardingSliderProps>(
  ({ slides, currentIndex, onIndexChange }, ref) => {
    const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      },
    }));

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index != null) {
          onIndexChange(viewableItems[0].index);
        }
      },
      [onIndexChange],
    );

    const viewabilityConfig = useRef({
      viewAreaCoveragePercentThreshold: 50,
    }).current;

    const renderSlide = useCallback(
      ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <View style={styles.illustrationContainer}>
            <Image
              source={item.image}
              style={styles.illustration}
              contentFit="contain"
              transition={300}
            />
          </View>
        </View>
      ),
      [],
    );

    return (
      <>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          style={styles.flatList}
        />
        <PageDots total={slides.length} current={currentIndex} />
      </>
    );
  },
);

OnboardingSlider.displayName = "OnboardingSlider";

export default OnboardingSlider;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
    flexShrink: 0,
  },
  slide: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  illustrationContainer: {
    width: SCREEN_WIDTH * 0.85,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "90%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  dot: {
    height: 14,
    borderRadius: 25,
  },
  dotActive: {
    width: 28,
    backgroundColor: Brand.primary,
  },
  dotInactive: {
    width: 11,
    height: 11,
    backgroundColor: Brand.inactive,
  },
});
