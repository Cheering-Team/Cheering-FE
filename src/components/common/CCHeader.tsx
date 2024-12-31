import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Community} from 'apis/community/types';
import LeftSvg from 'assets/images/arrow-left.svg';
import CheckSvg from 'assets/images/check-white.svg';
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface CCHeaderProps {
  community: Community;
  scrollY: SharedValue<number>;
}

const CCHeader = ({scrollY, community}: CCHeaderProps) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <View
      className="flex-row px-3 absolute z-50 justify-between w-full h-[55] items-center"
      style={{top: insets.top}}>
      <Pressable className="rounded-full bg-white w-[38] h-[38] items-center justify-center shadow-sm shadow-gray-200 border border-gray-200">
        <LeftSvg width={27} height={27} />
      </Pressable>
      <View className="items-center">
        <CustomText
          className="text-[16px]"
          fontWeight="500"
          style={[animatedStyle]}>
          모임 만들기
        </CustomText>
        <CustomText
          style={[{color: community.color}, animatedStyle]}
          className="text-xs">
          {community.koreanName}
        </CustomText>
      </View>
      <Pressable
        className="rounded-full w-[38] h-[38] items-center justify-center shadow-sm shadow-gray-200 border"
        style={{
          backgroundColor: community.color,
          borderColor: 'white',
        }}>
        <CheckSvg width={17} height={17} />
      </Pressable>
    </View>
  );
};

export default CCHeader;
