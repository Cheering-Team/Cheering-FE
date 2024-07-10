import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ICustomFlatListStyles = {
  header: StyleProp<ViewStyle>;
  stickyElement: StyleProp<ViewStyle>;
};

type TUseCommunityFlastListHook = [
  Animated.Value,
  ICustomFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
];

const window = Dimensions.get('window');

export const useHomeFlatListHook = (): TUseCommunityFlastListHook => {
  const insets = useSafeAreaInsets();
  const srollY = useRef(new Animated.Value(0)).current;

  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
  });

  const styles: ICustomFlatListStyles = {
    header: {
      marginBottom: heights.sticky,
    },

    stickyElement: {
      width: '100%',
      marginTop: heights.header + insets.top + 55,
      position: 'absolute',
      transform: [
        {
          translateY: srollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [-window.height, heights.header],
            outputRange: [window.height, -heights.header],
          }),
        },
      ],
      zIndex: 1,
    },
  };

  const onLayoutHeaderElement = (event: LayoutChangeEvent): void => {
    if (heights.header === 0) {
      setHeights({...heights, header: event.nativeEvent.layout.height});
    }
  };

  const onLayoutStickyElement = (event: LayoutChangeEvent): void => {
    setHeights({...heights, sticky: event.nativeEvent.layout.height});
  };

  return [srollY, styles, onLayoutHeaderElement, onLayoutStickyElement];
};
