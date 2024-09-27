import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import NotJoin from '../NotJoin';
import {useGetChatRooms} from '../../../apis/chat/useChats';
import {useNavigation} from '@react-navigation/native';
import ChatCard from 'components/common/ChatCard';
import {Pressable} from 'react-native';
import PlusSvg from '../../../../assets/images/plus-gray.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CommunityScreenNavigationProp} from 'screens/communityStack/CommunityScreen';

interface Props {
  playerData: any;
  handlePresentModalPress: any;
}

const ChatList = (props: Props) => {
  const {playerData, handlePresentModalPress} = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CommunityScreenNavigationProp>();

  const {data, isLoading} = useGetChatRooms(
    playerData.id,
    playerData.user !== null,
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
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
      {playerData.user && (
        <Pressable
          className="items-center absolute right-[17] w-[42] h-[42] justify-center bg-[#ffffff] rounded-full"
          style={{
            bottom: insets.bottom + 67,
            shadowColor: '#000',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}
          onPress={() => {
            navigation.navigate('CreateChatRoom', {playerId: playerData.id});
          }}>
          <PlusSvg width={20} height={20} />
        </Pressable>
      )}
    </>
  );
};

export default ChatList;
