import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from 'screens/homeStack/HomeScreen';
import {Pressable} from 'react-native-gesture-handler';
import MyStarCard from '../MyStarCard';
import {useGetMyCommunities} from 'apis/player/usePlayers';
import {useGetNotices} from 'apis/notice/useNotices';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {queryClient} from '../../../../App';
import {communityKeys} from 'apis/player/queries';

const MyStarCarousel = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const progress = useSharedValue<number>(0);

  const {data: communityData} = useGetMyCommunities();
  const {data: noticeData} = useGetNotices();

  const renderItem = ({item, index}) => {
    if (communityData && index >= communityData?.result.length) {
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
    if (communityData) {
      communityData.result.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id, 0), {
          status: 200,
          message: '커뮤니티 정보 조회 완료',
          result: community,
        });
      });
    }
  });

  if (communityData && noticeData) {
    return (
      <>
        <Carousel
          loop={false}
          data={[
            ...(communityData?.result || []),
            ...(noticeData?.result || []),
          ]}
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
          data={[
            ...(communityData?.result || []),
            ...(noticeData?.result || []),
          ]}
          dotStyle={{
            width: Math.floor(
              (WINDOW_WIDTH * 0.4) /
                (communityData.result.length + noticeData?.result.length),
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
