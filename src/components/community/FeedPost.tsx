import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import HeartSvg from '../../../assets/images/heart.svg';
import HeartFillSvg from '../../../assets/images/heart_fill.svg';
import CommentSvg from '../../../assets//images/comment.svg';
import PostWriter from '../post/PostWriter';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postPostsLikes} from '../../apis/post';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../common/CustomText';
import Avatar from '../common/Avatar';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {WINDOW_WIDTH} from '../../constants/dimension';
import {PanGesture} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import ImageView from 'react-native-image-viewing';
import FullScreenSvg from '../../../assets/images/fullscreen.svg';
import CommentModal from '../post/CommentModal';
import {formatDate} from '../../utils/format';

interface FeedPostProps {
  feed: any;
  playerId: number;
  postId: number;
  selectedFilter?: any;
  hotTab?: any;
  type: 'community' | 'home';
}

const FeedPost = (props: FeedPostProps) => {
  const navigation = useNavigation();

  const {feed, playerId, postId, selectedFilter, hotTab, type} = props;

  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    if (feed.images.length) {
      setImageHeight(feed.images[0].height > 350 ? 350 : feed.images[0].height);
    }
  }, [feed.images]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLikeStatus(feed.isLike);
    setLikeCount(feed.likeCount);
  }, [feed.isLike, feed.likeCount]);

  const queryClient = useQueryClient();

  const progress = useSharedValue<number>(0);
  const [isViewer, setIsViewer] = useState(false);
  const [curImage, setCurImage] = useState(0);

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

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-10, 10]);
  };

  return (
    <>
      <View style={styles.container}>
        {/* 숨겨진 글 */}
        {feed.isHide && (
          <View
            style={{
              width: '100%',
              backgroundColor: '#fbeeee',
              paddingVertical: 5,
            }}>
            <CustomText
              fontWeight="500"
              style={{color: '#fd5e5e', marginLeft: 12, fontSize: 13}}>
              신고 누적으로 인해 숨겨진 게시글입니다.
            </CustomText>
          </View>
        )}
        {/* 태그 필터 */}
        {feed.tags.length > 0 && (
          <View
            style={{
              paddingTop: 10,

              flexDirection: 'row',
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
        )}
        {/* 글 정보 */}
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
          }}>
          <Avatar uri={feed.writer.image} size={33} style={{marginTop: 3}} />
          <View style={{paddingHorizontal: 10}}>
            <View style={{flexDirection: 'row'}}>
              <CustomText fontWeight="600" style={styles.writerName}>
                {feed.writer.name}
              </CustomText>
              <CustomText style={styles.createdAt}>
                {formatDate(feed.createdAt)}
              </CustomText>
            </View>
            <CustomText style={{color: '#282828'}}>{feed.content}</CustomText>
          </View>
        </View>
        {/* 이미지 */}
        <FlatList
          data={feed.images}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => {
                setCurImage(index);
                setIsViewer(true);
              }}>
              <Image
                source={{uri: item.url}}
                resizeMode="cover"
                style={[
                  {
                    width:
                      WINDOW_WIDTH - 90 < item.width
                        ? WINDOW_WIDTH - 90
                        : item.width,
                    height: imageHeight,
                    borderRadius: 5,
                    marginLeft: 15,
                    borderWidth: 0.5,
                    borderColor: '#d1d1d1',
                  },
                  index === 0 && {marginLeft: 53},
                ]}
              />
            </Pressable>
          )}
        />
        {/* 상호작용 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 53,
            marginVertical: 12,
          }}>
          <Pressable
            onPress={toggleLike}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 40,
            }}>
            {likeStatus ? (
              <HeartFillSvg width={18} height={18} />
            ) : (
              <HeartSvg width={18} height={18} />
            )}
            <CustomText style={styles.likeCount}>{`${likeCount}`}</CustomText>
          </Pressable>
          <Pressable
            onPress={toggleLike}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 40,
            }}>
            <CommentSvg width={18} height={18} />
            <CustomText
              style={styles.likeCount}>{`${feed.commentCount}`}</CustomText>
          </Pressable>

          {type === 'home' && (
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
      <CommentModal
        postId={postId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        playerUser={feed.playerUser}
        selectedFilter={selectedFilter}
        hotTab={hotTab}
        playerId={playerId}
      />
      <ImageView
        images={feed.images.map(item => ({uri: item.url}))}
        imageIndex={curImage}
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
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: '#d9d9d9',
  },
  writerContainer: {flexDirection: 'row', alignItems: 'center'},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 14},
  createdAt: {fontSize: 14, color: '#6d6d6d', marginLeft: 5},
  interactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {color: '#6a6a6a', marginLeft: 6},
  commentSvg: {marginLeft: 25, top: 1},
  commentCount: {
    fontSize: 15,
    marginLeft: 9,
    paddingBottom: 1,
    color: '#333436',
  },
});

export default FeedPost;
