import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Chat} from 'apis/chat/types';
import {useAcceptJoinRequest, useGetMeetById} from 'apis/meet/useMeets';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import {formatAmPmTime} from 'utils/format';

interface JoinRequestMessageProps {
  chat: Chat;
  chatRoomId: number;
  meetId: number | null;
}

const JoinRequestMessage = ({
  chat,
  chatRoomId,
  meetId,
}: JoinRequestMessageProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const {data: meet} = useGetMeetById(meetId);
  const {mutateAsync: acceptJoinRequest} = useAcceptJoinRequest(chatRoomId);

  const handleJoinAccept = async () => {
    await acceptJoinRequest(chatRoomId);
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
        <Pressable
          onPress={() => {
            navigation.navigate('Profile', {fanId: chat.writer.id});
          }}>
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
      </View>
    );
  }
};

export default JoinRequestMessage;
