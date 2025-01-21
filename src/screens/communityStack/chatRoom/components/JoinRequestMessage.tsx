import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Client} from '@stomp/stompjs';
import {Chat, ChatRoom} from 'apis/chat/types';
import {useGetCommunityById} from 'apis/community/useCommunities';
import {useAcceptJoinRequest, useGetMeetById} from 'apis/meet/useMeets';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {MutableRefObject, useState} from 'react';
import {Pressable, View} from 'react-native';
import DuplicateMatchModal from 'screens/communityStack/community/meetTab/components/DuplicateMatchModal';
import {formatAmPmTime} from 'utils/format';

interface JoinRequestMessageProps {
  chat: Chat;
  chatRoom: ChatRoom;
  meetId: number | null;
  client: MutableRefObject<Client | null>;
}

const JoinRequestMessage = ({
  chat,
  chatRoom,
  meetId,
  client,
}: JoinRequestMessageProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isDuplicatedMatchModal, setIsDuplicatedMatchModal] = useState(false);

  const {data: meet} = useGetMeetById(meetId);
  const {data: community} = useGetCommunityById(chatRoom.communityId);

  const handleJoinAccept = async () => {
    if (client.current && client.current.connected && chatRoom.user) {
      client.current?.publish({
        destination: `/app/chatRooms/${chatRoom.id}/accept`,
        body: JSON.stringify({
          chatRoomType: chatRoom.type,
          writerId: chatRoom.user?.id,
          writerImage: chatRoom.user?.image,
          writerName: chatRoom.user?.name,
          content: '확정 신청',
        }),
      });
    }
  };

  if (meet?.isManager) {
    return (
      <View className="justify-center items-center my-4">
        <View className="bg-black/30 py-1 px-3 rounded-xl">
          <CustomText
            numberOfLines={2}
            fontWeight="500"
            className="text-white text-[13px] leading-[19px] text-center">
            {`상대방에게 확정 신청을 보냈습니다\n상대방 수락 시 멤버로 확정됩니다`}
          </CustomText>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          maxWidth: WINDOW_WIDTH / 1.5,
          marginBottom: 7,
        }}>
        <Pressable>
          <Avatar uri={chat.writer.image} size={32} className="mt-[2]" />
        </Pressable>
        <View style={{marginLeft: 6, marginTop: 1}}>
          <Pressable>
            <CustomText
              fontWeight="500"
              style={{color: '#6a6a6a', marginLeft: 2}}
              className="text-[13px]">
              {chat.writer.name}
            </CustomText>
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <View
              className="border border-gray-300"
              style={{
                backgroundColor: '#f1f1f1',
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 10,
                marginTop: 5,
              }}>
              <CustomText
                numberOfLines={999}
                className="text-[15px] leading-[22px]"
                style={{color: '#343434'}}>
                {`모임으로 초대받았습니다.\n수락 시에 모임 멤버로 확정됩니다.`}
              </CustomText>
              <Pressable
                className="justify-center items-center py-[10] mt-3 bg-white rounded-lg border border-gray-200"
                onPress={handleJoinAccept}>
                <CustomText>수락하기</CustomText>
              </Pressable>
            </View>
            <CustomText
              className="text-[11px]"
              style={{
                marginLeft: 5,
                marginBottom: 2,
                color: '#575757',
              }}>
              {formatAmPmTime(chat.createdAt)}
            </CustomText>
          </View>
        </View>
        {isDuplicatedMatchModal && meet && community && (
          <DuplicateMatchModal
            match={meet?.match}
            setIsModalOpen={setIsDuplicatedMatchModal}
            community={community}
          />
        )}
      </View>
    );
  }
};

export default JoinRequestMessage;
