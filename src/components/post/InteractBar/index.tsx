import React, {useEffect, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import Avatar from '../../common/Avatar';
import {Post} from '../../../apis/post/types';
import CommentSvg from '../../../assets/images/comment.svg';
import HeartSvg from '../../../assets/images/heart.svg';
import HeartFillSvg from '../../../assets/images/heart_fill.svg';
import {useLikePost} from '../../../apis/post/usePosts';

interface InteractBarProps {
  post: Post;
  type: 'home' | 'community' | 'post';
}

const InteractBar = (props: InteractBarProps) => {
  const {post, type} = props;
  const navigation = useNavigation();

  const {mutate: likePost} = useLikePost(post.id);

  const handleLikePost = () => {
    likePost({postId: post.id});
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        marginLeft: type === 'post' ? undefined : 53,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleLikePost}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 12,
          }}>
          {post.isLike ? (
            <HeartFillSvg width={18} height={18} />
          ) : (
            <HeartSvg width={18} height={18} />
          )}
          <CustomText
            style={{
              color: '#6a6a6a',
              marginLeft: 6,
            }}>
            {post.likeCount}
          </CustomText>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 40,
          }}>
          <CommentSvg width={18} height={18} />
          <CustomText
            style={{
              color: '#6a6a6a',
              marginLeft: 6,
            }}>{`${post.commentCount}`}</CustomText>
        </View>
      </View>

      {type !== 'community' && (
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {playerId: post.community.id},
            })
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginBottom: 13,
          }}>
          <Avatar
            uri={post.community.image}
            size={21}
            style={{borderWidth: 1, borderColor: '#e2e2e2'}}
          />
          <CustomText style={{fontSize: 16, marginLeft: 7}}>
            {post.community.koreanName}
          </CustomText>
        </Pressable>
      )}
    </View>
  );
};

export default InteractBar;
