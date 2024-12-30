import React from 'react';
import {Platform, Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CloseSvg from 'assets/images/close-black.svg';
import {Community} from 'apis/community/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface WriterHeaderProps {
  handleWritePost: () => void;
  isWriting: boolean;
  community: Community;
}

const WriteHeader = (props: WriterHeaderProps) => {
  const {handleWritePost, isWriting, community} = props;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  return (
    <View
      className="pl-[6] pr-[10] flex-row justify-between items-center bg-white z-50 border-b border-gray-100"
      style={{
        height: 40,
        marginTop: Platform.OS === 'android' ? insets.top : undefined,
      }}>
      <Pressable
        className="w-[50]"
        onPress={() => {
          navigation.goBack();
        }}>
        <CloseSvg width={27} height={27} />
      </Pressable>
      <View className="items-center">
        <CustomText fontWeight="500" className="text-[15px] text-slate-900">
          글 작성
        </CustomText>
        <CustomText
          fontWeight="500"
          className="text-[13px]"
          style={{color: community.color}}>
          {community.koreanName}
        </CustomText>
      </View>
      <Pressable
        onPress={() => {
          handleWritePost();
        }}
        disabled={isWriting}
        style={{
          backgroundColor: community.color,
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}>
        <CustomText fontWeight="500" className="text-[15px] text-white">
          등록
        </CustomText>
      </Pressable>
    </View>
  );
};

export default WriteHeader;
