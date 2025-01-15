import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Community} from 'apis/community/types';
import LeftSvg from 'assets/images/arrow-left.svg';
import CheckSvg from 'assets/images/check-white.svg';
import MoreSvg from 'assets/images/three-dots-black.svg';
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface CCHeaderProps {
  title: string;
  community: Community;
  scrollY: SharedValue<number>;
  secondType?: 'COMPELETE' | 'MORE';
  onFirstPress: () => void;
  onSecondPress?: () => void;
}

const CCHeader = ({
  title,
  scrollY,
  community,
  secondType,
  onFirstPress,
  onSecondPress,
}: CCHeaderProps) => {
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
      <Pressable
        className="rounded-full bg-white w-[38] h-[38] items-center justify-center shadow-sm shadow-gray-200 border border-gray-200"
        onPress={() => {
          onFirstPress();
        }}>
        <LeftSvg width={27} height={27} />
      </Pressable>
      <View className="items-center">
        <CustomText
          className="text-[16px]"
          fontWeight="500"
          style={[animatedStyle]}>
          {title}
        </CustomText>
        <CustomText
          style={[{color: community.color}, animatedStyle]}
          className="text-xs">
          {community.koreanName}
        </CustomText>
      </View>
      {secondType && onSecondPress ? (
        <>
          {secondType === 'COMPELETE' && (
            <Pressable
              onPress={() => {
                onSecondPress();
              }}
              className="rounded-full w-[38] h-[38] items-center justify-center shadow-sm shadow-gray-200 border border-white"
              style={{
                backgroundColor: community.color,
              }}>
              <CheckSvg width={17} height={17} />
            </Pressable>
          )}
          {secondType === 'MORE' && (
            <Pressable
              onPress={() => {
                onSecondPress();
              }}
              className="rounded-full bg-white w-[38] h-[38] items-center justify-center shadow-sm shadow-gray-200 border border-gray-200"
              style={{
                backgroundColor: 'white',
              }}>
              <MoreSvg width={14} height={14} />
            </Pressable>
          )}
        </>
      ) : (
        <View className="w-[38]" />
      )}
    </View>
  );
};

export default CCHeader;
