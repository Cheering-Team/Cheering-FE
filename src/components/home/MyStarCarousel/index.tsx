import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from 'screens/homeStack/HomeScreen';
import {PanGesture, Pressable} from 'react-native-gesture-handler';
import MyStarCard from '../MyStarCard';
import {useGetNotices} from 'apis/notice/useNotices';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {queryClient} from '../../../../App';
import {playerKeys} from 'apis/player/queries';
import {Player} from 'apis/player/types';

interface MyStarCarouselProps {
  communities?: Player[];
}

const MyStarCarousel = ({communities}: MyStarCarouselProps) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const progress = useSharedValue<number>(0);

  const {data: noticies} = useGetNotices();

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-15, 15]);
  };

  const renderItem = ({item, index}) => {
    if (communities && index >= communities.length) {
      return (
        <Pressable
          className="w-full h-[220]"
          style={{
            shadowColor: '#5a5a5a',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 5,
          }}
          onPress={() => navigation.navigate('Notice', {noticeId: item.id})}>
          <FastImage
            source={{uri: item.image}}
            resizeMode="cover"
            className="w-full h-full rounded-2xl"
          />
        </Pressable>
      );
    }
    return <MyStarCard community={item} />;
  };

  useEffect(() => {
    if (communities) {
      communities.forEach(community => {
        queryClient.setQueryData(playerKeys.detail(community.id, 0), community);
      });
    }
  });

  if (communities && noticies) {
    return (
      <>
        <Carousel
          onConfigurePanGesture={handleConfigurePanGesture}
          loop={false}
          data={[...(communities || []), ...(noticies || [])]}
          mode="parallax"
          width={WINDOW_WIDTH}
          height={220}
          onProgressChange={progress}
          modeConfig={{
            parallaxScrollingScale: 0.87,
            parallaxScrollingOffset: 62,
          }}
          renderItem={renderItem}
        />
        <Pagination.Basic
          progress={progress}
          data={[...(communities || []), ...(noticies || [])]}
          dotStyle={{
            width: Math.floor(
              (WINDOW_WIDTH * 0.4) / (communities.length + noticies.length),
            ),
            height: 4,
            backgroundColor: '#ebebeb',
            borderRadius: 1,
          }}
          activeDotStyle={{
            overflow: 'hidden',
            backgroundColor: '#393939',
          }}
          containerStyle={{gap: 6, marginBottom: 10}}
          horizontal
        />
      </>
    );
  } else {
    return (
      <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
        <View
          style={{
            height: 195,
            marginBottom: 20,
            marginHorizontal: 25,
            marginTop: 15,
            borderRadius: 20,
          }}
        />
      </SkeletonPlaceholder>
    );
  }
};

export default MyStarCarousel;
