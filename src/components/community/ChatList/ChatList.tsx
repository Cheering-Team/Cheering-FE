import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import NotJoin from '../NotJoin';
import CustomText from '../../common/CustomText';
import {useGetChatRooms} from '../../../apis/chat/useChats';
import {Pressable, View} from 'react-native';
import Avatar from '../../common/Avatar';
import OfficialSvg from '../../../../assets/images/official.svg';
import {useNavigation} from '@react-navigation/native';
import ChatCard from 'components/common/ChatCard';

interface Props {
  playerData: any;
  handlePresentModalPress: any;
}

const ChatList = (props: Props) => {
  const {playerData, handlePresentModalPress} = props;
  const navigation = useNavigation();

  const {data, isLoading} = useGetChatRooms(
    playerData.id,
    playerData.user !== null,
  );

  if (isLoading) {
    return null;
  }

  return (
    <Tabs.FlatList
      data={[]}
      renderItem={() => <></>}
      ListHeaderComponent={
        playerData.user ? (
          <>
            {data?.result.map(chatRoom => (
              <ChatCard
                key={chatRoom.id}
                chatRoom={chatRoom}
                onPress={() => {
                  navigation.navigate('ChatRoom', {chatRoomId: chatRoom.id});
                }}
              />
            ))}
          </>
        ) : (
          <></>
        )
      }
      ListEmptyComponent={
        !playerData.user ? (
          <NotJoin
            playerData={playerData}
            setIsModalOpen={handlePresentModalPress}
          />
        ) : null
      }
    />
  );
};

export default ChatList;
