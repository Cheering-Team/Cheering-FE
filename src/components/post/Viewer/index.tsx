import {ImageType} from 'apis/post/types';
import {WINDOW_WIDTH} from 'constants/dimension';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {LayoutAnimation, Modal, Pressable} from 'react-native';
import {
  GestureEvent,
  GestureHandlerRootView,
  PanGesture,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import CloseSvg from 'assets/images/x_white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ViewerCard from '../ViewerCard';

interface ViewerProps {
  images: ImageType[];
  isViewerOpen: boolean;
  setIsViewerOpen: Dispatch<SetStateAction<boolean>>;
  viewIndex: number;
}

const Viewer = ({
  images,
  isViewerOpen,
  setIsViewerOpen,
  viewIndex,
}: ViewerProps) => {
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isTool, setIsTool] = useState(true);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isViewerOpen) {
      setIsTool(true);
    }
  }, [isViewerOpen]);

  const closeModal = () => {
    setIsViewerOpen(false);
  };

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-15, 15]);
  };

  const onOuterGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const translationY = event.nativeEvent.translationY;
    translateY.value = translationY + offsetY;
    if (translationY > 0) {
      setIsTool(false);
    }
  };

  const onGestureEnd = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const finalTranslationY = translateY.value;

    if (Math.abs(finalTranslationY) < 140) {
      translateY.value = withTiming(0, {duration: 200});
      runOnJS(setOffsetY)(0);
      setIsTool(true);
    } else {
      runOnJS(closeModal)();
      runOnJS(setOffsetY)(0);
      setTimeout(() => {
        translateY.value = 0;
      }, 400);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const animatedOpacityStyle = useAnimatedStyle(() => {
    const backgroundColorAlpha = interpolate(
      translateY.value,
      [0, 140],
      [1, 0.9],
    );

    return {
      backgroundColor: `rgba(0, 0, 0, ${backgroundColorAlpha})`,
    };
  });

  return (
    <Modal transparent={true} animationType="fade" visible={isViewerOpen}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Animated.View className="w-full h-full" style={animatedOpacityStyle}>
          <PanGestureHandler
            onGestureEvent={onOuterGestureEvent}
            onEnded={onGestureEnd}>
            <Animated.View className="w-full h-full" style={animatedStyle}>
              <Carousel
                loop={false}
                defaultIndex={viewIndex}
                onConfigurePanGesture={handleConfigurePanGesture}
                onProgressChange={(_, absoluteProgress) =>
                  setCurrentIndex(absoluteProgress)
                }
                data={images}
                renderItem={({item, index}) => (
                  <ViewerCard image={item} isFocus={index === currentIndex} />
                )}
                width={WINDOW_WIDTH}
              />
            </Animated.View>
          </PanGestureHandler>
          {isTool && (
            <Pressable
              className="absolute left-3 bg-gray-900 p-[10] rounded-full"
              style={{top: insets.top + 12}}
              onPress={() => setIsViewerOpen(false)}>
              <CloseSvg width={16} height={16} />
            </Pressable>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default Viewer;
