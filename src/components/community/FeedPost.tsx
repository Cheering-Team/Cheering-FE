import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import HeartSvg from '../../../assets/images/heart.svg';
import HeartFillSvg from '../../../assets/images/heart_fill.svg';
import CommentSvg from '../../../assets//images/comment.svg';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postPostsLikes} from '../../apis/post';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../common/CustomText';
import Avatar from '../common/Avatar';
import {WINDOW_WIDTH} from '../../constants/dimension';
import ImageView from 'react-native-image-viewing';
import PostWriter from '../post/PostWriter';
import {useLikePost} from '../../apis/post/usePosts';
import InteractBar from '../post/InteractBar';

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

  const queryClient = useQueryClient();

  const [isViewer, setIsViewer] = useState(false);
  const [curImage, setCurImage] = useState(0);

  const {mutateAsync: likePost} = useLikePost(postId);

  const toggleLike = async () => {
    setLikeCount(prev => (likeStatus ? prev - 1 : prev + 1));
    setLikeStatus(prev => !prev);

    await likePost({postId});
  };

  useEffect(() => {
    if (feed.images.length) {
      if (WINDOW_WIDTH - 90 < feed.images[0].width) {
        setImageHeight(
          feed.images[0].height * ((WINDOW_WIDTH - 90) / feed.images[0].width),
        );
      } else {
        if (feed.images[0].height > 350) {
          setImageHeight(350);
        } else {
          setImageHeight(feed.images[0].height);
        }
      }
    }
  }, [feed.images]);

  useEffect(() => {
    setLikeStatus(feed.isLike);
    setLikeCount(feed.likeCount);
  }, [feed.isLike, feed.likeCount]);

  return (
    <>
      <Pressable
        style={styles.container}
        onPress={() => {
          if (type === 'community') {
            navigation.navigate('Post', {
              postId: feed.id,
              playerUser: feed.playerUser,
            });
          } else {
            navigation.navigate('CommunityStack', {
              screen: 'Post',
              params: {
                postId: feed.id,
                playerUser: feed.playerUser,
              },
            });
          }
        }}>
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
        {/* 글 정보 */}
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('Profile', {playerUserId: feed.writer.id});
            }}>
            <Avatar uri={feed.writer.image} size={33} style={{marginTop: 3}} />
          </Pressable>

          <View style={{marginLeft: 10, flex: 1}}>
            <PostWriter
              feed={feed}
              isWriter={feed.playerUser.id === feed.writer.id}
            />
            <CustomText
              style={{
                color: '#282828',
                marginRight: 25,
                lineHeight: 24,
                fontSize: 15,
              }}>
              {feed.content}
            </CustomText>
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
                    width: item.width * (imageHeight / item.height),
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
        <InteractBar post={feed} type={type} />
      </Pressable>
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
