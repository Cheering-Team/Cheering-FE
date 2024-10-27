import {Community} from 'apis/community/types';
import {useGetDailys} from 'apis/post/usePosts';
import DailyCard from 'components/post/DailyCard';
import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface DailyListProps {
  community: Community;
}

const DailyList = ({community}: DailyListProps) => {
  const {
    data: dailys,
    hasNextPage,
    fetchNextPage,
  } = useGetDailys(community.id, '', community.manager !== null);

  const loadDaily = useCallback(
    (_: number, absoluteProgress: number) => {
      if (
        dailys &&
        hasNextPage &&
        absoluteProgress >= dailys.pages.flatMap(page => page.dailys).length - 5
      ) {
        fetchNextPage();
      }
    },
    [dailys, fetchNextPage, hasNextPage],
  );

  if (!dailys) {
    return (
      <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
        <View style={{height: 90, margin: 20, borderRadius: 10}} />
      </SkeletonPlaceholder>
    );
  }

  if (dailys.pages.flatMap(page => page.dailys).length === 0) {
    return null;
  }

  return (
    <Carousel
      data={dailys?.pages.flatMap(page => page.dailys)}
      renderItem={({item}) => <DailyCard daily={item} />}
      width={WINDOW_WIDTH}
      height={130}
      loop={false}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.88,
        parallaxScrollingOffset: WINDOW_WIDTH / 6.7,
      }}
      onProgressChange={loadDaily}
    />
  );
};

export default DailyList;
