import React from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import CustomText from '../../CustomText';
import HeartSvg from '../../../../assets/images/heart.svg';
import HeartFillSvg from '../../../../assets/images/heart_fill.svg';
import CommentSvg from '../../../../assets/images/comment.svg';
import PostWriter from '../post/PostWriter';

interface FeedPostProps {
  feed: any;
}

const FeedPost = (props: FeedPostProps) => {
  const {feed} = props;

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
      <PostWriter writer={feed.writer} createdAt={feed.createdAt} />
      <CustomText style={styles.content}>{feed.content}</CustomText>
      {feed.images.length !== 0 &&
        (feed.images.length === 1 ? (
          <Image
            source={{uri: feed.images[0].url}}
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
              source={{uri: feed.images[0].url}}
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
                source={{uri: feed.images[1].url}}
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
                  +{feed.images.length - 1}
                </CustomText>
              </ImageBackground>
            </View>
          </View>
        ))}

      {/* <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 15,
        }}>
        {feed.tags.map(tag => (
          <View
            key={tag}
            style={{
              borderWidth: 1,
              backgroundColor: '#3a3a3a',
              borderColor: '#3a3a3a',
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 20,
              marginRight: 6,
            }}>
            <CustomText fontWeight="500" style={{color: 'white'}}>
              {tag === 'photo'
                ? '📸 직찍사'
                : tag === 'viewing'
                ? '👀 직관인증'
                : '🔎 정보'}
            </CustomText>
          </View>
        ))}
      </View> */}
      <View style={styles.interactContainer}>
        {feed.isLike ? (
          <HeartFillSvg width={21} height={21} />
        ) : (
          <HeartSvg width={21} height={21} />
        )}
        <CustomText style={styles.likeCount}>{feed.likeCount}</CustomText>
        <CommentSvg width={21} height={21} style={styles.commentSvg} />
        <CustomText style={styles.commentCount}>40</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
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
    marginTop: 30,
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
