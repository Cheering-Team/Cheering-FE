import AlertModal from 'components/common/AlertModal/AlertModal';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {FlatList, Platform, Pressable, SafeAreaView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ChatRoom} from 'apis/chat/types';
import {
  useDisableNotification,
  useEnableNotification,
  useGetParticipants,
} from 'apis/chat/useChats';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {useNavigation} from '@react-navigation/native';
import CloseSvg from 'assets/images/close-black.svg';
import ExitSvg from 'assets/images/exit-gray.svg';
import {deleteChatRoom} from 'apis/chat';
import {showTopToast} from 'utils/toast';
import * as StompJs from '@stomp/stompjs';
import BellSvg from 'assets/images/bell-gray-fill.svg';
import BellMuteSvg from 'assets/images/bell-mute-gray.svg';

interface ChatRoomDrawerContentProps {
  chatRoom: ChatRoom;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  client: MutableRefObject<StompJs.Client | null>;
}

const ChatRoomDrawerContent = ({
  chatRoom,
  setIsDrawerOpen,
  client,
}: ChatRoomDrawerContentProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isExitAlertOpen, setIsExitAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const {
    data: participants,
    isError: participantIsError,
    error: participantError,
  } = useGetParticipants(chatRoom.id);
  const {mutate: enable} = useEnableNotification(chatRoom.id);
  const {mutate: disable} = useDisableNotification(chatRoom.id);

  const handleDeleteChatRoom = async () => {
    await deleteChatRoom({chatRoomId: chatRoom.id});
    showTopToast({message: '삭제 완료'});
    navigation.goBack();
  };

  const handleEnableNotification = () => {
    enable(chatRoom.id);
  };

  const handleDisableNotification = () => {
    disable(chatRoom.id);
  };

  useEffect(() => {
    if (
      participantIsError &&
      participantError.message === '존재하지 않는 채팅방'
    ) {
      navigation.goBack();
    }
  }, [navigation, participantError?.message, participantIsError]);

  return (
    <SafeAreaView className="flex-1">
      {chatRoom.type === 'OFFICIAL' ? (
        <View className="flex-1" />
      ) : (
        <FlatList
          data={participants}
          contentContainerStyle={{
            paddingTop: Platform.OS === 'ios' ? 5 : insets.top + 5,
          }}
          ListHeaderComponent={
            <>
              <Pressable
                className="px-2"
                onPress={() => setIsDrawerOpen(false)}>
                <CloseSvg width={32} height={32} />
              </Pressable>
              <View className="items-center mb-7 px-7">
                <FastImage
                  source={{uri: chatRoom.image}}
                  className="w-[70] h-[70] rounded-[13px]"
                />
                <CustomText
                  className="text-xl text-center"
                  fontWeight="600"
                  numberOfLines={2}>
                  {chatRoom.name}
                </CustomText>
                <CustomText
                  className="text-gray-700 text-base mt-[3] text-center"
                  numberOfLines={5}>
                  {chatRoom.description}
                </CustomText>
              </View>
              <View className="ml-3">
                <CustomText
                  fontWeight="600"
                  className="text-base text-gray-500 mb-2 ml-[2]">
                  {`참여자 ${chatRoom.count}명`}
                </CustomText>
                <Pressable
                  className="flex-row items-center py-2"
                  onPress={() => {
                    if (chatRoom.manager) {
                      navigation.navigate('Profile', {
                        fanId: chatRoom.manager.id,
                      });
                    }
                  }}>
                  <Avatar uri={chatRoom.manager?.image} size={32} />
                  <View className="bg-gray-800 rounded-xl px-1 py-[1] mx-[5]">
                    <CustomText
                      fontWeight="600"
                      className="text-[11px] text-white">
                      방장
                    </CustomText>
                  </View>
                  <CustomText
                    className="text-[15px] text-slate-700"
                    fontWeight="500">
                    {chatRoom.manager?.name}
                  </CustomText>
                </Pressable>
              </View>
            </>
          }
          renderItem={({item}) => (
            <Pressable
              className="flex-row items-center py-2 ml-3"
              onPress={() => {
                if (item.type !== 'ADMIN')
                  navigation.navigate('Profile', {
                    fanId: item.id,
                  });
              }}>
              <Avatar uri={item.image} size={32} />
              <CustomText
                className="ml-[10] text-[15px] text-slate-700"
                fontWeight="500">
                {item.name}
              </CustomText>
            </Pressable>
          )}
          className="flex-1"
        />
      )}

      <View className="h-[48] border-t border-t-[#eeeeee] justify-between items-center pl-2 pr-4 flex-row">
        <Pressable
          className="p-2"
          onPress={
            chatRoom.notificationsEnabled
              ? handleDisableNotification
              : handleEnableNotification
          }>
          {chatRoom.notificationsEnabled ? (
            <BellSvg width={24} height={24} />
          ) : (
            <BellMuteSvg width={24} height={24} />
          )}
        </Pressable>
        <Pressable
          className="flex-row items-center"
          onPress={() =>
            chatRoom.manager?.id === chatRoom.user?.id
              ? setIsDeleteAlertOpen(true)
              : setIsExitAlertOpen(true)
          }>
          <CustomText fontWeight="600" className="mr-3 text-gray-500 text-base">
            {chatRoom.manager?.id === chatRoom.user?.id
              ? '채팅방 삭제'
              : '채팅방 나가기'}
          </CustomText>
          <ExitSvg width={24} height={24} />
        </Pressable>
      </View>
      {chatRoom.manager?.id === chatRoom.user?.id ? (
        <AlertModal
          isModalOpen={isDeleteAlertOpen}
          setIsModalOpen={setIsDeleteAlertOpen}
          title="채팅방을 삭제하시겠습니까?"
          content="방장이기 때문에 나가실 경우 채팅방이 삭제됩니다."
          button1Text="삭제"
          button1Color="#ff2626"
          button2Text="취소"
          button1Press={handleDeleteChatRoom}
        />
      ) : (
        <AlertModal
          isModalOpen={isExitAlertOpen}
          setIsModalOpen={setIsExitAlertOpen}
          title="채팅방에서 나가시겠습니까?"
          content="모든 대화내용이 삭제됩니다."
          button1Text="나가기"
          button1Color="#ff2626"
          button2Text="취소"
          button1Press={() => {
            if (client.current?.connected) {
              client.current?.publish({
                destination: `/app/chatRooms/leave`,
                body: JSON.stringify({chatRoomId: chatRoom.id}),
              });
            }
            navigation.goBack();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatRoomDrawerContent;
