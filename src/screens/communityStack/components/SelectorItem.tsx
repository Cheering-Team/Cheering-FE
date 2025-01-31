import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import React, {Dispatch, SetStateAction} from 'react';
import {Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import SettingSvg from 'assets/images/setting-solid-black.svg';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import {CommunityOption} from './CommunitySelector';

interface SelectorItem {
  community: CommunityOption;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SelectorItem = ({community, setIsOpen}: SelectorItem) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <Pressable
      className="flex-row self-end items-center my-[8] pr-[13]"
      onPress={() => {
        setIsOpen(false);
      }}>
      {community.id !== 0 && (
        <CustomText className="text-white text-[15.5px] mr-3" fontWeight="300">
          {community.koreanName}
        </CustomText>
      )}

      {community.id === 0 ? (
        <Pressable
          className="bg-white rounded-full p-[10.5]"
          onPress={() => {
            setIsOpen(false);
            navigation.navigate('EditMyCommunity');
          }}>
          <SettingSvg width={22} height={22} />
        </Pressable>
      ) : (
        <Pressable
          className="bg-white rounded-full"
          onPress={() => {
            setIsOpen(false);
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {communityId: community.id, initialIndex: 0},
            });
          }}>
          <FastImage
            source={{uri: community.image}}
            className="w-[43] h-[43] bg-white rounded-full"
          />
        </Pressable>
      )}
    </Pressable>
  );
};

export default SelectorItem;
