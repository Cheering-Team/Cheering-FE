import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {PanGesture} from 'react-native-gesture-handler';
import MyStarCard from '../MyStarCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {queryClient} from '../../../../App';
import {communityKeys} from 'apis/community/queries';
import {useGetMyCommunities} from 'apis/community/useCommunities';

const MyStarCarousel = () => {
  const progress = useSharedValue<number>(0);

  const {data: communities} = useGetMyCommunities();

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-15, 15]);
  };

  const renderItem = ({item, index}) => {
    return <MyStarCard community={item} />;
  };

  useEffect(() => {
    if (communities) {
      communities.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id), community);
      });
    }
  });

  if (communities) {
    return (
      <>
        <Carousel
          onConfigurePanGesture={handleConfigurePanGesture}
          loop={false}
          data={communities}
          mode="parallax"
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT * 0.75}
          onProgressChange={progress}
          modeConfig={{
            parallaxScrollingScale: 0.87,
            parallaxScrollingOffset: 62,
          }}
          renderItem={renderItem}
        />
        <Pagination.Basic
          progress={progress}
          data={communities}
          dotStyle={{
            width: Math.floor((WINDOW_WIDTH * 0.4) / communities.length),
            height: 4,
            backgroundColor: '#ebebeb',
            borderRadius: 1,
          }}
          activeDotStyle={{
            overflow: 'hidden',
            backgroundColor: '#393939',
          }}
          containerStyle={{gap: 5, bottom: 90}}
          horizontal
        />
      </>
    );
  } else {
    return (
      <SkeletonPlaceholder
        backgroundColor="#f4f4f4"
        highlightColor="#ffffff"
        speed={1500}>
        <View
          style={{
            height: WINDOW_HEIGHT * 0.65,
            marginBottom: 20,
            marginHorizontal: 25,
            marginTop: 43,
            borderRadius: 20,
          }}
        />
      </SkeletonPlaceholder>
    );
  }
};

export default MyStarCarousel;
