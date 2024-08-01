import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import HeartSvg from '../../../../assets/images/heart.svg';
import HeartFillSvg from '../../../../assets/images/heart_fill.svg';
import CommentSvg from '../../../../assets/images/comment.svg';
import PostWriter from '../post/PostWriter';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postPostsLikes} from '../../../apis/post';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../common/CustomText';
import Avatar from '../../common/Avatar';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {WINDOW_WIDTH} from '../../../constants/dimension';
import {PanGesture} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import ImageView from 'react-native-image-viewing';
import FullScreenSvg from '../../../../assets/images/fullscreen.svg';

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

  // const [loading, setLoading] = useState([true, true]);
  const progress = useSharedValue<number>(0);
  const [isViewer, setIsViewer] = useState(false);

  const [line, setLine] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

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

  // const handleLoadStart = index => {
  //   setLoading(prevLoading => {
  //     const newLoading = [...prevLoading];
  //     newLoading[index] = true;
  //     return newLoading;
  //   });
  // };

  // const handleLoadEnd = index => {
  //   setLoading(prevLoading => {
  //     const newLoading = [...prevLoading];
  //     newLoading[index] = false;
  //     return newLoading;
  //   });
  // };

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-10, 10]);
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 9,
            marginLeft: -2,
            paddingHorizontal: 10,
            width: '100%',
          }}>
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
        {feed.images.length > 0 && (
          <View>
            <Carousel
              loop={false}
              data={feed.images}
              width={WINDOW_WIDTH}
              height={
                feed.images[0].height / feed.images[0].width < 1.1
                  ? feed.images[0].height /
                    (feed.images[0].width / WINDOW_WIDTH)
                  : WINDOW_WIDTH * 1.1
              }
              onProgressChange={progress}
              style={{
                marginTop: 10,
              }}
              onConfigurePanGesture={handleConfigurePanGesture}
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{uri: item.url}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                );
              }}
            />
            <Pressable
              onPress={() => setIsViewer(true)}
              style={{
                width: 25,
                height: 25,
                borderRadius: 100,
                backgroundColor: 'rgba(0, 0, 0, 0.501)',
                position: 'absolute',
                bottom: 20,
                right: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FullScreenSvg width={13} height={13} />
            </Pressable>
            <Pagination.Basic
              data={feed.images}
              progress={progress}
              dotStyle={{
                width: 13,
                height: 4,
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
              activeDotStyle={{
                overflow: 'hidden',
                backgroundColor: 'black',
              }}
              containerStyle={{gap: 8, marginTop: 7}}
            />
          </View>
        )}

        <Pressable
          style={styles.content}
          onPress={() => {
            setIsExpanded(true);
          }}>
          <CustomText
            style={{fontSize: 15}}
            numberOfLines={
              showMoreButton ? (isExpanded ? undefined : 2) : undefined
            }
            ellipsizeMode="tail"
            onTextLayout={e => {
              const {lines} = e.nativeEvent;
              if (lines.length > 2) {
                setShowMoreButton(true);
              }
            }}>
            {feed.content}
          </CustomText>
          {showMoreButton && !isExpanded && (
            <CustomText style={{marginLeft: 1, color: '#969696'}}>
              더 보기
            </CustomText>
          )}
        </Pressable>

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
      <ImageView
        images={feed.images.map(item => ({uri: item.url}))}
        imageIndex={progress.value}
        visible={isViewer}
        onRequestClose={() => setIsViewer(false)}
        presentationStyle="overFullScreen"
        backgroundColor="rgba(0,0,0,0.9)"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 18,
    paddingTop: 10,
    borderBottomWidth: 1.5,
    borderColor: '#f3f3f3',
    alignItems: 'center',
  },
  writerContainer: {flexDirection: 'row', alignItems: 'center'},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 15},
  createAt: {fontSize: 13, color: '#6d6d6d'},
  content: {paddingTop: 13, paddingHorizontal: 11, width: '100%'},
  interactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
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
