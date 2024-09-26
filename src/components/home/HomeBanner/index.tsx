import {useNavigation} from '@react-navigation/native';
import {useGetNotices} from 'apis/notice/useNotices';
import {WINDOW_WIDTH} from 'constants/dimension';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

const HomeBanner = () => {
  const navigation = useNavigation();

  const {data} = useGetNotices();

  if (!data) {
    return null;
  }

  return (
    <Carousel
      loop={false}
      width={WINDOW_WIDTH}
      height={WINDOW_WIDTH * 0.75}
      data={data.result}
      renderItem={({item}) => (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Notice', {noticeId: item.id})}>
          <FastImage
            source={{uri: item.image}}
            className="w-full h-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default HomeBanner;
