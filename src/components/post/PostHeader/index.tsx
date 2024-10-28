import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import {Player} from '../../../apis/player/types';

interface PostHeaderProps {
  community: Player;
}

const PostHeader = (props: PostHeaderProps) => {
  const {community} = props;

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        paddingRight: 17,
        paddingLeft: 5,
      }}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <ChevronLeftSvg width={33} height={33} />
      </Pressable>
      <View style={{alignItems: 'center'}}>
        <CustomText
          fontWeight="600"
          style={{
            fontSize: 16,
            paddingBottom: 0,
          }}>
          {community.koreanName}
        </CustomText>
        {community.englishName && (
          <CustomText
            fontWeight="400"
            style={{fontSize: 12, paddingBottom: 0, color: '#979797'}}>
            {community.englishName}
          </CustomText>
        )}
      </View>
      <View style={{width: 20, height: 20}} />
    </View>
  );
};

export default PostHeader;
