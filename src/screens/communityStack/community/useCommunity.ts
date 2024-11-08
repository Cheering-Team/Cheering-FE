import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

export const useCommunity = () => {
  const insets = useSafeAreaInsets();

  const [tabRoutes, setTabRoutes] = useState([
    {key: 'feed', title: '피드'},
    {key: 'chat', title: '채팅'},
  ]);

  const [tabIndex, setTabIndex] = useState(0);
  const tabIndexRef = useRef(0);
  const isListGlidingRef = useRef(false);
  const listArrRef = useRef<
    {
      key: string;
      value: FlatList<any> | null;
    }[]
  >([]);
  const listOffsetRef = useRef<{
    [key: string]: number;
  }>({});

  const scrollY = useSharedValue(0);
  const indicatorPosition = useSharedValue(0);

  const headerTranslateY = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT - insets.top - 45],
          [0, -HEADER_HEIGHT + insets.top + 45],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const tabBarTranslateY = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT - insets.top - 45],
          [HEADER_HEIGHT, insets.top + 45],
          {
            extrapolateRight: Extrapolation.CLAMP,
          },
        ),
      },
    ],
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: indicatorPosition.value}],
    };
  });

  // 탭 변경시 인덱스 저장
  const onTabIndexChange = useCallback((id: number) => {
    setTabIndex(id);
    tabIndexRef.current = id;
  }, []);

  // 스크롤 중 일때 탭변환 X
  const onTabPress = useCallback((idx: number) => {
    if (!isListGlidingRef.current) {
      setTabIndex(idx);
      tabIndexRef.current = idx;
    }
  }, []);

  const syncScrollOffset = () => {
    const focusedTabKey = tabRoutes[tabIndexRef.current].key;

    listArrRef.current.forEach(item => {
      if (item.key !== focusedTabKey) {
        if (
          scrollY.value < HEADER_HEIGHT - insets.top - 45 &&
          scrollY.value >= 0
        ) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY.value,
              animated: false,
            });
            listOffsetRef.current[item.key] = scrollY.value;
          }
        } else if (scrollY.value >= HEADER_HEIGHT - insets.top - 45) {
          if (
            listOffsetRef.current[item.key] < HEADER_HEIGHT - insets.top - 45 ||
            listOffsetRef.current[item.key] === undefined
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HEADER_HEIGHT - insets.top - 45,
                animated: false,
              });
              listOffsetRef.current[item.key] = HEADER_HEIGHT - insets.top - 45;
            }
          }
        }
      } else {
        if (item.value) {
          listOffsetRef.current[item.key] = scrollY.value;
        }
      }
    });
  };

  const onMomentumScrollBegin = useCallback(() => {
    isListGlidingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    isListGlidingRef.current = false;
    syncScrollOffset();
  }, []);

  const onScrollEndDrag = useCallback(() => {
    syncScrollOffset();
  }, []);

  useEffect(() => {
    indicatorPosition.value = withTiming(tabIndex * (WINDOW_WIDTH / 2), {
      duration: 250,
    });
  }, [tabIndex]);

  return {
    tabBarTranslateY,
    onTabPress,
    animatedIndicatorStyle,
    tabRoutes,
    tabIndex,
    scrollY,
    onMomentumScrollBegin,
    listArrRef,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onTabIndexChange,
    headerTranslateY,
  };
};
