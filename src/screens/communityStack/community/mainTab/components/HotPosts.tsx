import {InfiniteData} from '@tanstack/react-query';
import {GetPostsResponse} from 'apis/post/types';
import CustomText from 'components/common/CustomText';
import FeedPost from 'components/community/FeedPost';
import React from 'react';
import {Pressable, View} from 'react-native';

interface HotPostsProps {
  onTabPress: (index: number) => void;
  posts: InfiniteData<GetPostsResponse, unknown> | undefined;
}

const HotPosts = ({onTabPress, posts}: HotPostsProps) => {
  return (
    <View>
      <View className="mx-[14] mt-3 flex-row justify-between items-center mb-2">
        <CustomText className="text-lg" fontWeight="500">
          현재 인기 게시글
        </CustomText>
        {posts?.pages.flatMap(page => page.posts).length === 0 && (
          <Pressable
            className="border-b border-b-gray-600"
            onPress={() => onTabPress(1)}>
            <CustomText className="text-gray-600 text-[13px]">
              전체보기
            </CustomText>
          </Pressable>
        )}
      </View>

      <View
        className={`px-[14] ${posts?.pages.flatMap(page => page.posts).length !== 0 && 'rounded-sm border border-[#eeeeee]'}`}>
        {posts?.pages
          .flatMap(page => page.posts)
          .slice(0, 3)
          .map(post => (
            <View key={post.id}>
              <FeedPost feed={post} type="community" />
            </View>
          ))}
        {posts?.pages.flatMap(page => page.posts).length === 0 ? (
          <View className="h-[80] justify-center items-center">
            <CustomText className="text-slate-700">
              아직 재밌는 게시글이 없나봐요
            </CustomText>
          </View>
        ) : (
          <Pressable
            onPress={() => onTabPress(1)}
            className="justify-center items-center py-3 mt-[1] bg-white">
            <CustomText className="text-gray-700">게시글 전체보기</CustomText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default HotPosts;
