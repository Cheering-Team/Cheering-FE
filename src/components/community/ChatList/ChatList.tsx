import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import NotJoin from '../NotJoin';
import CustomText from '../../common/CustomText';
import {useGetChatRooms} from '../../../apis/chat/useChats';
import {Pressable, View} from 'react-native';
import Avatar from '../../common/Avatar';
import OfficialSvg from '../../../../assets/images/official.svg';
import {useNavigation} from '@react-navigation/native';

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
      contentContainerStyle={{paddingHorizontal: 15, paddingTop: 12}}
      renderItem={() => <></>}
      ListHeaderComponent={
        playerData.user ? (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomText
                fontWeight="700"
                style={{fontSize: 18, marginRight: 3}}>
                공식 채팅방
              </CustomText>
              <OfficialSvg width={18} height={18} />
            </View>

            {data?.result.map(chatRoom => (
              <Pressable
                key={chatRoom.id}
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  padding: 15,
                  borderRadius: 20,
                  backgroundColor: 'white',
                  borderColor: '#ececec',
                  borderWidth: 1,
                  alignItems: 'center',
                  shadowColor: '#3b3b3b',
                  shadowOffset: {
                    width: 3,
                    height: 3,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
                onPress={() =>
                  navigation.navigate('ChatRoom', {chatRoomId: chatRoom.id})
                }>
                <Avatar
                  uri={chatRoom.image}
                  size={59}
                  style={{borderRadius: 15}}
                />
                <View style={{marginLeft: 13}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CustomText
                      fontWeight="500"
                      style={{fontSize: 17, marginRight: 2}}>
                      {chatRoom.name}
                    </CustomText>
                    <OfficialSvg width={15} height={15} />
                  </View>
                  <CustomText
                    fontWeight="500"
                    style={{
                      color: '#9b9b9b',
                      paddingBottom: 0,
                      lineHeight: 16,
                    }}>
                    {chatRoom.description}
                  </CustomText>
                  <CustomText fontWeight="500" style={{color: '#7d7d7d'}}>
                    {`${chatRoom.count} 명`}
                  </CustomText>
                </View>
              </Pressable>
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
