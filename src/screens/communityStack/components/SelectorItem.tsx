import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {Dispatch, SetStateAction} from 'react';
import {Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';

interface SelectorItem {
  community: Community;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SelectorItem = ({community, setIsOpen}: SelectorItem) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <Pressable
      className="flex-row self-end items-center my-[8] pr-[13]"
      onPress={() => {
        setIsOpen(false);
      }}>
      <CustomText className="text-white text-[15.5px] mr-3" fontWeight="300">
        {community.koreanName}
      </CustomText>
      <Pressable
        className="bg-white rounded-full"
        onPress={() => {
          setIsOpen(false);
          navigation.navigate('Community', {
            communityId: community.id,
            initialIndex: 0,
          });
        }}>
        <FastImage
          source={{uri: community.image}}
          className="w-[43] h-[43] bg-white rounded-full"
        />
      </Pressable>
    </Pressable>
  );
};

export default SelectorItem;
