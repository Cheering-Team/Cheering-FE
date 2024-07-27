import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CustomText from './CustomText';
import HeartSvg from '../../assets/images/heart.svg';
import HeartFillSvg from '../../assets/images/heart_fill.svg';
import CommentSvg from '../../assets/images/comment.svg';
import PostHeader from './WriterHeader';

export interface PostType {
  id: number;
  communityId: number;
  writer: Writer;
  commentCount: number;
  likeCount: number;
  likeStatus: 'FALSE' | 'TRUE';
  content: string;
  createdAt: string;
  updatedAt: string;
  image: ImageType[];
}

interface ImageType {
  url: string;
  width: number;
  height: number;
}

export interface Writer {
  id: number;
  name: string;
  profileImage: string | null;
}

interface PostProps {
  item: PostType;
  postLike?: (
    postId: number,
    index: number,
    communityId: number,
  ) => Promise<void>;
  index: number;
  communityId: number;
}

const Post = (props: PostProps) => {
  const {item, postLike, index, communityId} = props;

  return (
    <View style={styles.PostContainer}>
      <PostHeader writer={item.writer} createdAt={item.createdAt} />
      <CustomText style={styles.PostContent} fontWeight="400">
        {item.content}
      </CustomText>
      {item.image.length !== 0 &&
        (item.image.length === 1 ? (
          <Image
            source={{uri: item.image[0].url}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: 1,
              borderRadius: 10,
              marginTop: 12,
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <Image
              source={{uri: item.image[0].url}}
              resizeMode="cover"
              style={{
                flex: 1,
                // width: (screenWidth - 40) / 2,
                height: 'auto',
                aspectRatio: 1,
                borderRadius: 10,
              }}
            />
            <View style={{width: 2}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ImageBackground
                source={{uri: item.image[1].url}}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                imageStyle={{borderRadius: 10}}>
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.667)',
                    borderRadius: 10,
                  }}
                />
                <CustomText
                  style={{color: 'white', fontSize: 30}}
                  fontWeight="500">
                  +{item.image.length - 1}
                </CustomText>
              </ImageBackground>
            </View>
          </View>
        ))}
      <View style={styles.PostButtonContainer}>
        <Pressable
          onPress={() => {
            postLike?.(item.id, index, communityId);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {item.likeStatus === 'TRUE' ? (
            <HeartFillSvg width={24} height={24} />
          ) : (
            <HeartSvg width={24} height={24} />
          )}

          <CustomText style={styles.ButtonCount} fontWeight="500">
            {item.likeCount}
          </CustomText>
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <CommentSvg width={21} height={21} />
          <CustomText style={styles.ButtonCount} fontWeight="500">
            {item.commentCount}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  PostContainer: {
    paddingHorizontal: 7,
    paddingVertical: 18,
    marginHorizontal: 10,
    borderBottomWidth: 1.5,
    borderColor: '#f3f3f3',
  },

  PostContent: {
    marginTop: 17,
    marginLeft: 3,
    fontSize: 16,
  },
  PostButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 2,
    marginTop: 17,
  },
  ButtonCount: {
    color: '#595959',
    fontSize: 15,
    marginLeft: 6,
  },
});
