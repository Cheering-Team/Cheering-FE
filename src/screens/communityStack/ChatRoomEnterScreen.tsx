import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import CloseSvg from '../../../assets/images/close-black.svg';
import {useGetChatRoomById} from 'apis/chat/useChats';
import CustomButton from 'components/common/CustomButton';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {showBottomToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ChatRoomEnterScreen = ({route}) => {
  const {chatRoomId} = route.params;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {data, refetch} = useGetChatRoomById(chatRoomId, true);

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]">
        <Pressable onPress={() => navigation.goBack()}>
          <CloseSvg width={32} height={32} />
        </Pressable>
      </View>
      <View className="px-[15] py-[10] justify-between flex-1">
        <View className="flex-1 items-center pt-10">
          <Avatar uri={data.result.image} size={120} />
          <CustomText
            fontWeight="500"
            className="text-gray-600 text-[13px] ml-1 pb-0 mt-4">
            {data.result.player.koreanName}
          </CustomText>
          <CustomText fontWeight="500" className="text-3xl mt-1">
            {data.result.name}
          </CustomText>
          <CustomText className="text-gray-500 mt-2">
            {data.result.description}
          </CustomText>
        </View>
        <View className="flex-row justify-between mb-5 mx-1">
          <View className="flex-row items-center">
            <CustomText className="text-gray-500 mr-3 text-[13px]">
              참여 인원
            </CustomText>
            <CustomText fontWeight="700">{data.result.count}</CustomText>
            <CustomText>{`/${data.result.max}명`}</CustomText>
          </View>
          <View className="flex-row items-center">
            <CustomText className="text-gray-500 mr-3 text-[13px]">
              방장
            </CustomText>
            <Avatar uri={data.result.creator?.image} size={20} />
            <CustomText className="ml-1">
              {data.result.creator?.nickname}
            </CustomText>
          </View>
        </View>
        <CustomButton
          type="normal"
          text="입장하기"
          onPress={() => {
            refetch();
            if (data.result.count >= data.result.max) {
              showBottomToast(
                insets.bottom + 20,
                '입장가능 인원을 초과하였습니다.',
              );
            } else {
              navigation.replace('ChatRoom', {chatRoomId: data.result.id});
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomEnterScreen;
