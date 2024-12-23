import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import {Community} from 'apis/community/types';
import RefreshSvg from 'assets/images/refresh-black.svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import {Post} from 'apis/post/types';
import {GetCommentsResponse} from 'apis/comment/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface PostHeaderProps {
  community: Community;
  refetchPost: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Post, Error>>;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<InfiniteData<GetCommentsResponse, unknown>, Error>
  >;
}

const PostHeader = ({community, refetchPost, refetch}: PostHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const handleRefresh = () => {
    refetchPost();
    refetch();

    rotation.value = withTiming(360, {duration: 1000}, isFinished => {
      if (isFinished) {
        rotation.value = 0;
      }
    });
  };

  return (
    <View
      className="pl-[5] pr-[8] flex-row justify-between items-center bg-white z-50"
      style={{paddingTop: insets.top, height: 40 + insets.top}}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <ChevronLeftSvg width={27} height={27} />
      </Pressable>
      <View className="items-center">
        <CustomText fontWeight="500" className="text-[15px] text-slate-900">
          게시글
        </CustomText>
        <CustomText
          fontWeight="500"
          className="text-[13px]"
          style={{color: community.color}}>
          {community.koreanName}
        </CustomText>
      </View>
      <Pressable onPress={handleRefresh}>
        <Animated.View style={animatedStyle} className={'w-[24]'}>
          <RefreshSvg width={17} height={17} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default PostHeader;
