import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from 'apis/chat/types';
import ChatCard from 'components/common/ChatCard';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React from 'react';
import {View} from 'react-native';

interface OfficialChatProps {
  officialChatRoom: ChatRoom | undefined;
}

const OfficialChat = ({officialChatRoom}: OfficialChatProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  if (!officialChatRoom) {
    return null;
  }

  return (
    <View className="px-[14] mt-3">
      <CustomText className="text-lg mb-2" fontWeight="500">
        팬들과 응원하기
      </CustomText>
      <ChatCard
        chatRoom={officialChatRoom}
        location="COMMUNITY"
        onPress={() =>
          navigation.navigate('ChatRoom', {
            chatRoomId: officialChatRoom.id,
            type: 'OFFICIAL',
          })
        }
      />
    </View>
  );
};

export default OfficialChat;
