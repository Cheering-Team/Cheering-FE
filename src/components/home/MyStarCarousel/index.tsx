import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {PanGesture} from 'react-native-gesture-handler';
import MyStarCard from '../MyStarCard';
import {queryClient} from '../../../../App';
import {communityKeys} from 'apis/community/queries';
import {Community} from 'apis/community/types';

interface MyStarCarouselProps {
  communities: Community[];
}

const MyStarCarousel = ({communities}: MyStarCarouselProps) => {
  const progress = useSharedValue<number>(0);

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-15, 15]);
  };

  const renderItem = ({item}) => {
    return <MyStarCard community={item} />;
  };

  useEffect(() => {
    if (communities) {
      communities.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id), community);
      });
    }
  }, [communities]);

  return (
    <>
      <Carousel
        onConfigurePanGesture={handleConfigurePanGesture}
        loop={false}
        data={communities}
        mode="parallax"
        width={WINDOW_WIDTH}
        height={200}
        onProgressChange={progress}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 48,
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
        containerStyle={{
          gap: 5,
          top: 5,
        }}
        horizontal
      />
    </>
  );
};

export default MyStarCarousel;
