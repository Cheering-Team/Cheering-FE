import React from 'react';
import {StyleSheet, View} from 'react-native';
import Avatar from '../../Avatar';
import CustomText from '../../CustomText';
import {formatDate} from '../../../utils/format';

interface Writer {
  id: number;
  name: string;
  image: string;
}

interface PostWriterProps {
  writer: Writer;
  createdAt: string;
}

const PostWriter = (props: PostWriterProps) => {
  const {writer, createdAt} = props;

  return (
    <View style={styles.writerContainer}>
      <Avatar uri={writer.image} size={38} />
      <View style={styles.writerNameContainer}>
        <CustomText fontWeight="600" style={styles.writerName}>
          {writer.name}
        </CustomText>
        <CustomText style={styles.createAt}>{formatDate(createdAt)}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  writerContainer: {flexDirection: 'row', alignItems: 'center'},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 15},
  createAt: {fontSize: 13, color: '#6d6d6d'},
});

export default PostWriter;
