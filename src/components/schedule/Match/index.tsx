import CustomText from 'components/common/CustomText';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface MatchProps {
  item: any;
}

const Match = ({item}: MatchProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      className="flex-row items-center justify-between px-10 py-5 border-t border-gray-200">
      <View className="flex-row items-center">
        <CustomText fontWeight="500" className="text-lg mr-2">
          롯데
        </CustomText>
        <FastImage
          source={{
            uri: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/lotte_giants_emblem.png',
          }}
          className="w-[50] h-[50]"
        />
      </View>
      <View className="items-center">
        <CustomText fontWeight="600" className="text-base mb-[1]">
          {item.time}
        </CustomText>
        <CustomText className="text-xs">창원NC파크</CustomText>
      </View>
      <View className="flex-row items-center">
        <FastImage
          source={{
            uri: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/nc_dinos_emblem.png',
          }}
          className="w-[50] h-[50]"
        />
        <CustomText fontWeight="500" className="text-lg ml-2">
          NC
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default memo(Match);
