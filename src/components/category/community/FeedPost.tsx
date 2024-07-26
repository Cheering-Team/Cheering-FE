import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import HeartSvg from '../../../../assets/images/heart.svg';
import HeartFillSvg from '../../../../assets/images/heart_fill.svg';
import CommentSvg from '../../../../assets/images/comment.svg';
import PostWriter from '../post/PostWriter';
import FastImage from 'react-native-fast-image';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postPostsLikes} from '../../../apis/post';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../common/CustomText';
import Avatar from '../../common/Avatar';

interface FeedPostProps {
  feed: any;
  playerId: number;
  postId: number;
  selectedFilter?: any;
  hotTab?: any;
}

const FeedPost = (props: FeedPostProps) => {
  const navigation = useNavigation();

  const {feed, playerId, postId, selectedFilter, hotTab} = props;

  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    setLikeStatus(feed.isLike);
    setLikeCount(feed.likeCount);
  }, [feed.isLike, feed.likeCount]);

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState([true, true]);

  const mutation = useMutation({
    mutationFn: postPostsLikes,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', playerId, selectedFilter],
      });
      queryClient.invalidateQueries({
        queryKey: ['my', 'posts', hotTab],
      });
    },
  });

  const toggleLike = async () => {
    setLikeCount(prev => (likeStatus ? prev - 1 : prev + 1));
    setLikeStatus(prev => !prev);

    const response = await mutation.mutateAsync({postId});

    if (response.code !== 200) {
      setLikeCount(prev => (likeStatus ? prev - 1 : prev + 1));
      setLikeStatus(prev => !prev);

      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '일시적인 오류입니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const handleLoadStart = index => {
    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });
  };

  const handleLoadEnd = index => {
    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 9, marginLeft: -2}}>
        {feed.tags.map(tag => (
          <CustomText
            key={tag}
            style={{
              borderWidth: 1,
              borderColor: '#dcdcdc',
              marginRight: 8,
              borderRadius: 5,
              paddingHorizontal: 5,
              paddingVertical: 1,
            }}>
            {tag === 'photo'
              ? '📸 직찍사'
              : tag === 'viewing'
              ? '👀 직관인증'
              : '🔎 정보'}
          </CustomText>
        ))}
      </View>
      <PostWriter
        writer={feed.writer}
        createdAt={feed.createdAt}
        playerUserId={feed.writer.id}
      />
      <CustomText style={styles.content}>{feed.content}</CustomText>
      {feed.images.length !== 0 &&
        (feed.images.length === 1 ? (
          <FastImage
            source={{uri: feed.images[0].url}}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => handleLoadStart(0)}
            onLoadEnd={() => handleLoadEnd(0)}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: 1,
              borderRadius: 10,
              marginTop: 12,
            }}>
            {loading[0] && (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  zIndex: 1,
                  borderRadius: 10,
                  backgroundColor: '#eaedf2',
                }}
              />
            )}
          </FastImage>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <FastImage
              source={{uri: feed.images[0].url}}
              onLoadStart={() => handleLoadStart(0)}
              onLoadEnd={() => handleLoadEnd(0)}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                flex: 1,
                height: 'auto',
                aspectRatio: 1,
                borderRadius: 10,
              }}>
              {loading[0] && (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 1,
                    borderRadius: 10,
                    backgroundColor: '#eaedf2',
                  }}
                />
              )}
            </FastImage>
            <View style={{width: 2}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <FastImage
                source={{uri: feed.images[1].url}}
                onLoadStart={() => handleLoadStart(1)}
                onLoadEnd={() => handleLoadEnd(1)}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                {loading[1] && (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      zIndex: 1,
                      borderRadius: 10,
                      backgroundColor: '#eaedf2',
                    }}
                  />
                )}
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.667)',
                    borderRadius: 10,
                  }}
                />
                <CustomText
                  style={{color: 'white', fontSize: 30, zIndex: 3}}
                  fontWeight="500">
                  +{feed.images.length - 1}
                </CustomText>
              </FastImage>
            </View>
          </View>
        ))}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 30,
        }}>
        <View style={styles.interactContainer}>
          <Pressable onPress={toggleLike}>
            {likeStatus ? (
              <HeartFillSvg width={21} height={21} />
            ) : (
              <HeartSvg width={21} height={21} />
            )}
          </Pressable>
          <CustomText style={styles.likeCount}>{likeCount}</CustomText>
          <CommentSvg width={21} height={21} style={styles.commentSvg} />
          <CustomText style={styles.commentCount}>
            {feed.commentCount}
          </CustomText>
        </View>
        {feed.player && (
          <Pressable
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {playerId: feed.player.id},
              })
            }
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              uri={feed.player.image}
              size={21}
              style={{borderWidth: 1, borderColor: '#e2e2e2'}}
            />
            <CustomText style={{fontSize: 15, marginLeft: 7}}>
              {feed.player.koreanName}
            </CustomText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 18,
    paddingTop: 10,
    borderBottomWidth: 1.5,
    borderColor: '#f3f3f3',
  },
  writerContainer: {flexDirection: 'row', alignItems: 'center'},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 15},
  createAt: {fontSize: 13, color: '#6d6d6d'},
  content: {paddingTop: 13, paddingHorizontal: 1, fontSize: 15},
  interactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {fontSize: 15, marginLeft: 6, paddingBottom: 1, color: '#333436'},
  commentSvg: {marginLeft: 25, top: 1},
  commentCount: {
    fontSize: 15,
    marginLeft: 9,
    paddingBottom: 1,
    color: '#333436',
  },
});

export default FeedPost;
