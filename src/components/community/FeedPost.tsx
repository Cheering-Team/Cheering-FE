import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../common/CustomText';
import Avatar from '../common/Avatar';
import {WINDOW_WIDTH} from '../../constants/dimension';
import ImageView from 'react-native-image-viewing';
import PostWriter from '../post/PostWriter';
import InteractBar from '../post/InteractBar';
import FastImage from 'react-native-fast-image';
import {ImageSizeType} from 'apis/post/types';
import PostVideo from 'components/common/PostVideo';

interface FeedPostProps {
  feed: any;
  type: 'community' | 'home';
}

const FeedPost = (props: FeedPostProps) => {
  const navigation = useNavigation();

  const {feed, type} = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isViewer, setIsViewer] = useState(false);
  const [curImage, setCurImage] = useState(0);

  const renderItem: ListRenderItem<ImageSizeType> = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          setCurImage(index);
          setIsViewer(true);
        }}>
        {item.url.endsWith('MOV') || item.url.endsWith('MP4') ? (
          <PostVideo
            video={item}
            index={index}
            imagesLength={feed.images.length}
            width={width}
            height={height}
            type="FEED"
          />
        ) : (
          <FastImage
            source={{uri: item.url}}
            resizeMode="cover"
            style={[
              {
                width:
                  feed.images.length === 1
                    ? width
                    : Math.max(
                        Math.min(
                          item.width * (220 / item.height),
                          WINDOW_WIDTH - 85,
                        ),
                        150,
                      ),
                height: feed.images.length === 1 ? height : 220,
                borderRadius: 5,
                marginLeft: 10,
                borderWidth: 0.5,
                borderColor: '#d1d1d1',
              },
              index === 0 && {marginLeft: 53},
            ]}
          />
        )}
      </Pressable>
    );
  };

  useEffect(() => {
    if (feed.images.length) {
      if (feed.images[0].width / feed.images[0].height >= 0.75) {
        setWidth(WINDOW_WIDTH - 63);
        setHeight(
          feed.images[0].height * ((WINDOW_WIDTH - 63) / feed.images[0].width),
        );
      } else {
        const IMAGE_HEIGHT = (WINDOW_WIDTH - 63) / 0.75;
        setHeight(IMAGE_HEIGHT);
        setWidth(
          Math.max(
            feed.images[0].width * (IMAGE_HEIGHT / feed.images[0].height),
            105,
          ),
        );
      }
    }
  }, [feed.images]);

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
              type === 'community'
                ? navigation.navigate('Profile', {playerUserId: feed.writer.id})
                : navigation.navigate('CommunityStack', {
                    screen: 'Profile',
                    params: {playerUserId: feed.writer.id},
                  });
            }}>
            <Avatar uri={feed.writer.image} size={33} style={{marginTop: 3}} />
          </Pressable>

          <View style={{marginLeft: 10, flex: 1}}>
            <PostWriter
              feed={feed}
              isWriter={feed.playerUser.id === feed.writer.id}
              type="feed"
              location={type}
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
          renderItem={renderItem}
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
