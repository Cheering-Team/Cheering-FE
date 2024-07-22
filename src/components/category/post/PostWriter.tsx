import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {formatDate} from '../../../utils/format';
import Avatar from '../../common/Avatar';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';

interface Writer {
  id: number;
  name: string;
  image: string;
}

interface PostWriterProps {
  writer: Writer;
  createdAt: string;
  playerUserId: number;
}

const PostWriter = (props: PostWriterProps) => {
  const {writer, createdAt, playerUserId} = props;

  const navigation = useNavigation();

  return (
    <View style={styles.writerContainer}>
      <Pressable onPress={() => navigation.navigate('Profile', {playerUserId})}>
        <Avatar uri={writer.image} size={38} />
      </Pressable>
      <View style={styles.writerNameContainer}>
        <Pressable
          onPress={() => navigation.navigate('Profile', {playerUserId})}>
          <CustomText fontWeight="600" style={styles.writerName}>
            {writer.name}
          </CustomText>
        </Pressable>

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
