import React, {useEffect, useRef, useState} from 'react';
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
import PostWriter from '../post/PostWriter';
import InteractBar from '../post/InteractBar';
import FastImage from 'react-native-fast-image';
import {Post, PostImageType} from 'apis/post/types';
import PostVideo from 'components/common/PostVideo';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Viewer from 'components/post/Viewer';
import Vote from 'components/post/Vote';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {useGetVote} from 'apis/vote/useVotes';

interface FeedPostProps {
  feed: Post;
  type: 'community' | 'home';
}

const FeedPost = ({feed, type}: FeedPostProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  const {data: vote} = useGetVote(feed.id);

  const renderItem: ListRenderItem<PostImageType> = ({item, index}) => {
    return (
      <Pressable
        style={{marginLeft: index === 0 ? 53 : 10}}
        onPress={() => {
          setViewIndex(index);
          setIsViewerOpen(true);
        }}>
        {item.path.endsWith('mov') ||
        item.path.endsWith('mp4') ||
        item.path.endsWith('MOV') ||
        item.path.endsWith('MP4') ? (
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
            source={{uri: item.path}}
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
                borderWidth: 0.5,
                borderColor: '#d1d1d1',
              },
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
          navigation.navigate('CommunityStack', {
            screen: 'Post',
            params: {
              postId: feed.id,
            },
          });
        }}
        onLongPress={() => {
          bottomSheetModalRef.current?.present();
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
            alignItems: 'flex-start',
            padding: 10,
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('CommunityStack', {
                screen: 'Profile',
                params: {fanId: feed.writer.id},
              });
            }}>
            <Avatar uri={feed.writer.image} size={33} style={{marginTop: 3}} />
          </Pressable>

          <View style={{marginLeft: 10, flex: 1}}>
            <PostWriter
              bottomSheetModalRef={bottomSheetModalRef}
              post={feed}
              isWriter={feed.user.id === feed.writer.id}
              type="feed"
              location={type}
            />

            <CustomText
              style={{
                color: '#282828',
                marginRight: 25,
              }}
              numberOfLines={20}
              className="text-base">
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
        <View className="ml-[40]">
          {vote && <Vote vote={vote} post={feed} />}
        </View>
        {/* 상호작용 */}
        <InteractBar post={feed} type={type} />
      </Pressable>
      <Viewer
        images={feed.images}
        isViewerOpen={isViewerOpen}
        setIsViewerOpen={setIsViewerOpen}
        viewIndex={viewIndex}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingBottom: 2,
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
