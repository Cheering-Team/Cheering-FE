import React from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import Avatar from '../../common/Avatar';
import {Post} from '../../../apis/post/types';
import CommentSvg from '../../../assets/images/comment-line.svg';
import HeartSvg from '../../../assets/images/heart-line.svg';
import HeartFillSvg from '../../../assets/images/heart-fill-pink.svg';
import {useLikePost} from '../../../apis/post/usePosts';
import {formatComma} from 'utils/format';

interface InteractBarProps {
  post: Post;
  type: 'home' | 'community' | 'post';
}

const InteractBar = (props: InteractBarProps) => {
  const {post, type} = props;
  const navigation = useNavigation();

  const {mutate: likePost, isPending} = useLikePost(post.id);

  const handleLikePost = () => {
    if (!isPending) {
      likePost({postId: post.id});
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginLeft: type === 'post' ? undefined : 53,
        },
        type === 'post' && {borderBottomWidth: 1, borderBlockColor: '#eeeeee'},
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '60%'}}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleLikePost}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingVertical: 10,
          }}>
          {post.isLike ? (
            <HeartFillSvg width={22} height={22} />
          ) : (
            <HeartSvg width={22} height={22} />
          )}
          {post.likeCount !== 0 && (
            <CustomText
              fontWeight={post.isLike ? '600' : '500'}
              style={{
                fontSize: 15,
                color: post.isLike ? '#fa4b4b' : '#333333',
                marginLeft: 4,
              }}>
              {formatComma(post.likeCount)}
            </CustomText>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <CommentSvg width={22} height={22} />
          {post.commentCount !== 0 && (
            <CustomText
              fontWeight="500"
              style={{
                fontSize: 15,
                color: '#333333',
                marginLeft: 6,
              }}>
              {formatComma(post.commentCount)}
            </CustomText>
          )}
        </View>
      </View>

      {type === 'home' ? (
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {communityId: post.community.id, initialIndex: 0},
            })
          }
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 20,
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
      ) : (
        <View className="h-full flex-1" />
      )}
    </View>
  );
};

export default InteractBar;
