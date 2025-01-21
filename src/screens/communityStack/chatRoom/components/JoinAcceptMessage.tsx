import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Chat} from 'apis/chat/types';
import {useGetMeetById} from 'apis/meet/useMeets';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {formatAmPmTime} from 'utils/format';
import {queryClient} from '../../../../../App';
import {chatRoomKeys} from 'apis/chat/queries';
import {matchKeys} from 'apis/match/queries';

interface JoinAcceptMessageProps {
  chat: Chat;
  meetId: number | null;
  chatRoomId: number;
  communityId?: number;
}

const JoinAcceptMessage = ({
  chat,
  meetId,
  chatRoomId,
  communityId,
}: JoinAcceptMessageProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const {data: meet} = useGetMeetById(meetId);

  useEffect(() => {
    if (meet?.isManager) {
      queryClient.invalidateQueries({
        queryKey: chatRoomKeys.detail(chatRoomId),
      });
    } else if (communityId) {
      queryClient.invalidateQueries({
        queryKey: matchKeys.nearList(communityId),
      });
    }
  }, [chatRoomId, communityId, meet?.isManager]);

  if (meet?.isManager) {
    return (
      <View className="justify-center items-center my-4">
        <View className="bg-black/30 py-1 px-3 rounded-xl">
          <CustomText
            numberOfLines={2}
            fontWeight="500"
            className="text-white text-[13px] leading-[19px] text-center">
            {`상대방이 모임 참여를 확정하였습니다`}
          </CustomText>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          alignSelf: 'flex-end',
          alignItems: 'flex-end',
          maxWidth: WINDOW_WIDTH / 1.8,
          marginBottom: 7,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <CustomText
            className="text-[11px]"
            style={{
              marginRight: 5,
              marginBottom: 2,
              color: '#575757',
            }}>
            {formatAmPmTime(chat.createdAt)}
          </CustomText>
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
              className="text-[15px] leading-[22px]"
              numberOfLines={999}
              style={{color: '#343434'}}>
              모임 참여를 확정하였습니다.
            </CustomText>
            <Pressable
              className="justify-center items-center py-[10] mt-3 bg-white rounded-lg border border-gray-200"
              onPress={() => {
                if (communityId && meetId) {
                  navigation.replace('Meet', {meetId, communityId});
                }
              }}>
              <CustomText>모임으로 이동</CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
};

export default JoinAcceptMessage;
