import {useGetCommunityById} from 'apis/community/useCommunities';
import {WINDOW_WIDTH} from 'constants/dimension';
import {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {
  cancelAnimation,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useCommunity = (communityId: number) => {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

  const {data: community} = useGetCommunityById(communityId);

  const [tabRoutes, setTabRoutes] = useState([
    {key: 'main', title: '메인'},
    {key: 'feed', title: '피드'},
    {key: 'chat', title: '채팅'},
    {key: 'schedule', title: '일정'},
  ]);

  const [tabIndex, setTabIndex] = useState(0);
  const tabIndexRef = useRef(0);
  const isListGlidingRef = useRef(false);
  const listArrRef = useRef<
    {
      key: string;
      value: FlatList<any> | ScrollView | null;
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
          [0, 0, HEADER_HEIGHT - insets.top - 40],
          [0, 0, -HEADER_HEIGHT + insets.top + 40],
          {extrapolateRight: Extrapolation.CLAMP},
        ),
      },
    ],
  }));

  const tabBarTranslateY = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 0, HEADER_HEIGHT - insets.top - 40],
          [HEADER_HEIGHT, HEADER_HEIGHT, insets.top + 40],
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
          scrollY.value < HEADER_HEIGHT - insets.top - 40 &&
          scrollY.value >= 0
        ) {
          if (item.value) {
            if (item.key === 'main' || item.key === 'schedule') {
              item.value.scrollTo({
                y: scrollY.value,
                animated: false,
              });
            } else {
              item.value.scrollToOffset({
                offset: scrollY.value,
                animated: false,
              });
            }
            listOffsetRef.current[item.key] = scrollY.value;
          }
        } else if (scrollY.value >= HEADER_HEIGHT - insets.top - 40) {
          if (
            listOffsetRef.current[item.key] < HEADER_HEIGHT - insets.top - 40 ||
            listOffsetRef.current[item.key] === undefined
          ) {
            if (item.value) {
              if (item.key === 'main' || item.key === 'schedule') {
                item.value.scrollTo({
                  y: HEADER_HEIGHT - insets.top - 40,
                  animated: false,
                });
              } else {
                item.value.scrollToOffset({
                  offset: HEADER_HEIGHT - insets.top - 40,
                  animated: false,
                });
              }

              listOffsetRef.current[item.key] = HEADER_HEIGHT - insets.top - 40;
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

  useEffect(() => {
    return () => {
      cancelAnimation(indicatorPosition);
    };
  }, [indicatorPosition]);

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
    community,
  };
};
