import {Community} from 'apis/community/types';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {MutableRefObject} from 'react';
import {FlatList, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MatchList from './components/MatchList';

interface MainListProps {
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
}

const MainTab = ({listArrRef, tabRoute, community}: MainListProps) => {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

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
        contentContainerStyle={{
          backgroundColor: '#F5F4F5',
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 40,
          paddingBottom: insets.bottom + 100 + 2000,
        }}>
        {/* 일정 */}
        <MatchList community={community} />
      </Animated.ScrollView>
    </>
  );
};

export default MainTab;
