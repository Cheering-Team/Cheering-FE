import React from 'react';
import {Platform, Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CloseSvg from '../../../assets/images/close-black.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Community} from 'apis/community/types';

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
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingRight: 10,
        paddingLeft: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        paddingTop: Platform.OS === 'android' ? insets.top : undefined,
      }}>
      <Pressable
        className="w-[50]"
        onPress={() => {
          navigation.goBack();
        }}>
        <CloseSvg width={30} height={30} />
      </Pressable>
      <View className="items-center">
        <CustomText fontWeight="600" className="text-lg top-[1]">
          글작성
        </CustomText>
        <CustomText className="text-gray-600">
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
          paddingVertical: 6,
          paddingHorizontal: 11,
          borderRadius: 10,
        }}>
        <CustomText fontWeight="600" style={{fontSize: 17, color: 'white'}}>
          등록
        </CustomText>
      </Pressable>
    </View>
  );
};

export default WriteHeader;
