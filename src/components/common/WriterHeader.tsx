import React from 'react';
import {StyleSheet, View} from 'react-native';
import Avatar from './Avatar';
import CustomText from './CustomText';
import EditSvg from '../assets/images/three_dots.svg';
import {Fan} from 'apis/user/types';
import {formatDate} from 'utils/format';

interface PostHeaderProps {
  writer: Fan;
  createdAt: string;
}

const WriterHeader = (props: PostHeaderProps) => {
  const {writer, createdAt} = props;

  return (
    <View style={styles.PostWriter}>
      <Avatar uri={writer.image} size={40} style={styles.PostWriterProfile} />
      <View style={{flex: 1}}>
        <CustomText style={styles.PostWriterName} fontWeight="600">
          {writer.name}
        </CustomText>
        <CustomText style={styles.PostDate}>
          {formatDate(new Date(createdAt))}
        </CustomText>
      </View>
      <EditSvg
        height={20}
        width={20}
        style={{alignSelf: 'flex-start', marginTop: 5}}
      />
    </View>
  );
};

export default WriterHeader;

const styles = StyleSheet.create({
  PostWriter: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  PostWriterProfile: {
    marginRight: 12,
  },
  PostWriterName: {
    fontSize: 15,
    paddingBottom: 0,
  },
  PostDate: {
    color: 'gray',
  },
});
