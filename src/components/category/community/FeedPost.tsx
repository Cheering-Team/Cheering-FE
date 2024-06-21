import React from 'react';
import {StyleSheet, View} from 'react-native';
import Avatar from '../../Avatar';
import CustomText from '../../CustomText';
import HeartSvg from '../../../../assets/images/heart.svg';
import CommentSvg from '../../../../assets/images/comment.svg';

interface FeedPostProps {
  feed: any;
  idx: number;
}

const FeedPost = (props: FeedPostProps) => {
  const {feed, idx} = props;

  return (
    <View key={idx} style={styles.container}>
      <View style={styles.writerContainer}>
        <Avatar uri={feed.writer.image} size={36} />
        <View style={styles.writerNameContainer}>
          <CustomText fontWeight="600" style={styles.writerName}>
            {feed.writer.name}
          </CustomText>
          <CustomText style={styles.createAt}>{feed.createdAt}</CustomText>
        </View>
      </View>
      <CustomText style={styles.content}>{feed.content}</CustomText>
      <View style={styles.interactContainer}>
        <HeartSvg width={21} height={21} />
        <CustomText style={styles.likeCount}>12</CustomText>
        <CommentSvg width={21} height={21} style={styles.commentSvg} />
        <CustomText style={styles.commentCount}>40</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 18, borderBottomWidth: 1.5, borderColor: '#f3f3f3'},
  writerContainer: {flexDirection: 'row', alignItems: 'center'},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 15},
  createAt: {fontSize: 13, color: '#6d6d6d'},
  content: {paddingTop: 13, paddingHorizontal: 1, fontSize: 15},
  interactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
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
