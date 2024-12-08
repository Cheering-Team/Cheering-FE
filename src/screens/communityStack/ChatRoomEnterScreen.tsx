import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useGetChatRoomById} from 'apis/chat/useChats';
import CustomButton from 'components/common/CustomButton';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {showBottomToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StackHeader from 'components/common/StackHeader';

const ChatRoomEnterScreen = ({route}) => {
  const {chatRoomId} = route.params;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    data: chatRoom,
    refetch,
    isError,
    error,
  } = useGetChatRoomById(chatRoomId, true);

  useEffect(() => {
    if (isError && error.message === '존재하지 않는 채팅방') {
      navigation.goBack();
    }
  }, [error?.message, insets.top, isError, navigation]);

  if (!chatRoom) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader type="close" />
      <View className="px-[15] py-[10] justify-between flex-1">
        <View className="flex-1 items-center pt-10">
          <Avatar uri={chatRoom.image} size={120} />
          <CustomText
            fontWeight="500"
            className="text-gray-600 text-[14px] ml-1 pb-0 mt-4">
            {chatRoom.community?.koreanName}
          </CustomText>
          <CustomText fontWeight="500" className="text-3xl mt-1">
            {chatRoom.name}
          </CustomText>
          <CustomText className="text-gray-500 mt-2 text-base">
            {chatRoom.description}
          </CustomText>
        </View>
        <View className="flex-row justify-between mb-5 mx-1">
          <View className="flex-row items-center">
            <CustomText className="text-gray-500 mr-3 text-base">
              참여 인원
            </CustomText>
            <CustomText fontWeight="700" className="text-base">
              {chatRoom.count}
            </CustomText>
            <CustomText className="text-base">{`/${chatRoom.max}명`}</CustomText>
          </View>
          <View className="flex-row items-center">
            <CustomText className="text-gray-500 mr-3 text-base">
              방장
            </CustomText>
            <Avatar uri={chatRoom.manager?.image} size={20} />
            <CustomText className="ml-1 text-base">
              {chatRoom.manager?.name}
            </CustomText>
          </View>
        </View>
        <CustomButton
          type="normal"
          text="입장하기"
          onPress={() => {
            refetch();
            if (chatRoom.count >= chatRoom.max) {
              showBottomToast({
                type: 'fail',
                message: '입장가능 인원을 초과하였습니다.',
              });
            } else {
              navigation.replace('ChatRoom', {chatRoomId: chatRoom.id});
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomEnterScreen;
