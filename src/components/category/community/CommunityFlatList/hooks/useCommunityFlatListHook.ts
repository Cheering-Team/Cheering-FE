import {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

type ICustomFlatListStyles = {
  header: StyleProp<ViewStyle>;
  stickyElement: StyleProp<ViewStyle>;
  topElement?: StyleProp<ViewStyle>;
};

type TUseCommunityFlastListHook = [
  Animated.Value,
  ICustomFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
];

const window = Dimensions.get('window');

export const useCommunityFlatListHook = (): TUseCommunityFlastListHook => {
  const nativeScrollY = useRef(new Animated.Value(0)).current;

  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
    topList: 0,
  });

  const styles: ICustomFlatListStyles = {
    header: {
      marginBottom: heights.sticky + heights.topList,
    },
    stickyElement: {
      width: '100%',
      marginTop: Dimensions.get('window').height / 2.6,
      position: 'absolute',
      transform: [
        {
          translateY: nativeScrollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [
              -window.height,
              Dimensions.get('window').height / 2.6 - 50,
            ],
            outputRange: [
              window.height,
              -(Dimensions.get('window').height / 2.6) + 50,
            ],
          }),
        },
      ],
      zIndex: 2,
    },
    topElement: {
      marginTop: heights.header + heights.sticky + 10,
      position: 'absolute',
      transform: [
        {
          translateY: nativeScrollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [
              -window.height,
              heights.header + heights.sticky + heights.topList,
            ],
            outputRange: [
              window.height,
              -(heights.header + heights.sticky + heights.topList),
            ],
          }),
        },
      ],
      zIndex: 0,
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

  return [nativeScrollY, styles, onLayoutHeaderElement, onLayoutStickyElement];
};
