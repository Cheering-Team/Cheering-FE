import {Community} from 'apis/community/types';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {MutableRefObject} from 'react';
import {FlatList, ScrollView} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MatchList from './components/MatchList';
import {useMainTabScroll} from 'context/useMainTabScroll';

interface MainListProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<any> | ScrollView | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
  onTabPress: (index: number) => void;
}

const MainTab = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  listArrRef,
  tabRoute,
  community,
  onTabPress,
}: MainListProps) => {
  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

  const scrollHandler = useAnimatedScrollHandler(event => {
    const currentScrollY = event.contentOffset.y;
    if (isTabFocused) {
      scrollY.value = currentScrollY;
    }

    if (currentScrollY > previousScrollY.value + 2 && currentScrollY > 0) {
      tabScrollY.value = withTiming(50);
    } else if (
      currentScrollY < previousScrollY.value - 2 &&
      currentScrollY > 0
    ) {
      tabScrollY.value = withTiming(0);
    }
    previousScrollY.value = currentScrollY;
  });

  return (
    <>
      <Animated.ScrollView
        ref={ref => {
          const foundIndex = listArrRef.current.findIndex(
            e => e.key === tabRoute.key,
          );

          if (foundIndex === -1) {
            listArrRef.current.push({
              key: tabRoute.key,
              value: ref,
            });
          } else {
            listArrRef.current[foundIndex] = {
              key: tabRoute.key,
              value: ref,
            };
          }
        }}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{
          top: 110 + insets.top,
        }}
        onScroll={scrollHandler}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        contentContainerStyle={{
          backgroundColor: '#F5F4F5',
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 40,
          paddingBottom: insets.bottom + 100,
        }}>
        {/* 일정 */}
        <MatchList community={community} onTabPress={onTabPress} />
      </Animated.ScrollView>
    </>
  );
};

export default MainTab;
