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
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        paddingRight: 17,
        paddingLeft: 5,
      }}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <ChevronLeftSvg width={33} height={33} />
      </Pressable>
      <View className="items-center">
        <CustomText fontWeight="600" className="text-lg top-[1]">
          {community.koreanName}
        </CustomText>
      </View>
      <Pressable onPress={handleRefresh}>
        <Animated.View style={animatedStyle}>
          <RefreshSvg width={20} height={20} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default PostHeader;
