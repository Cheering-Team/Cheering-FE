import React, {useEffect} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import NotJoin from '../NotJoin';
import {useGetChatRooms} from '../../../apis/chat/useChats';
import {useNavigation} from '@react-navigation/native';
import ChatCard from 'components/common/ChatCard';
import {Pressable, View} from 'react-native';
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
      <Tabs.SectionList
        sections={data?.result || []}
        renderItem={({item}) => (
          <ChatCard
            key={item.id}
            chatRoom={item}
            onPress={() => {
              item.type === 'OFFICIAL' || item.isParticipating
                ? navigation.navigate('ChatRoom', {chatRoomId: item.id})
                : navigation.navigate('ChatRoomEnter', {chatRoomId: item.id});
            }}
          />
        )}
        renderSectionFooter={({section: {title}}) => {
          if (title === 'official') {
            return <View className="h-[1] mx-3 bg-gray-100 my-[2]" />;
          } else {
            return null;
          }
        }}
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
