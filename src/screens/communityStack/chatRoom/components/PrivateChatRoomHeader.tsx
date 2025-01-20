import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from 'apis/chat/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {MutableRefObject, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeftSvg from 'assets/images/chevron-left.svg';
import {useGetMeetById} from 'apis/meet/useMeets';
import MatchInfo from 'components/common/MatchInfo';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';
import TwoButtonModal from 'components/common/TwoButtonModal';
import {Client} from '@stomp/stompjs';

interface PrivateChatRoomHeader {
  chatRoom: ChatRoom;
  client: MutableRefObject<Client | null>;
}

const PrivateChatRoomHeader = ({chatRoom, client}: PrivateChatRoomHeader) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: meet} = useGetMeetById(chatRoom.meetId);

  const handleCreateRequest = () => {
    if (client.current && client.current.connected) {
      client.current?.publish({
        destination: `/app/chatRooms/${chatRoom.id}/join-message`,
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

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 5,
        flex: 1,
      }}>
      <View
        className="flex-1"
        style={{
          height: insets.top + 45,
          paddingTop: insets.top,
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#f4f4f4',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeftSvg width={25} height={25} />
        </Pressable>

        <View style={{marginLeft: 6, flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText fontWeight="600" style={{fontSize: 16}}>
              {chatRoom.type === 'PRIVATE' ? chatRoom.name : meet?.title}
            </CustomText>
          </View>

          <View
            className="flex-row items-center mt-[1]"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {chatRoom.type === 'CONFIRM' && (
              <CustomText className="color-[#757575] text-[13px]">
                모임 단체대화
              </CustomText>
            )}
            {chatRoom.type === 'PRIVATE' && chatRoom.opponentAge && (
              <View className="flex-row items-center">
                <CustomText className="color-[#757575] text-[13px]">
                  {chatRoom.opponentGender === 'FEMALE' ? '여자' : '남자'}
                </CustomText>
                <View className="w-[2] h-[2] bg-[#a2a2a2] mx-[3] rounded-full" />
                <CustomText className="color-[#757575] text-[13px]">
                  {new Date().getFullYear() - chatRoom.opponentAge}
                </CustomText>
              </View>
            )}

            {chatRoom.type === 'CONFIRM' && (
              <>
                <View
                  style={{
                    width: 1,
                    height: 12,
                    backgroundColor: '#cccccc',
                    marginHorizontal: 4,
                  }}
                />
                <Pressable
                  onPress={() => {
                    if (chatRoom.community) {
                      navigation.navigate('Community', {
                        communityId: chatRoom.community?.id,
                        initialIndex: 0,
                      });
                    }
                  }}
                  className="flex-row items-center">
                  <CustomText
                    style={{color: '#757575', marginRight: 2, fontSize: 13}}>
                    모임으로 가기
                  </CustomText>
                  <ChevronRightSvg width={9} height={9} />
                </Pressable>
              </>
            )}
          </View>
        </View>
        {chatRoom.type === 'PRIVATE' &&
          meet?.isManager &&
          !chatRoom.isConfirmed && (
            <Pressable
              className="h-[30] justify-center items-center px-[10] bg-black rounded-md mr-2"
              onPress={() => setIsModalOpen(true)}>
              <CustomText className="text-[13px] text-white" fontWeight="500">
                멤버 확정
              </CustomText>
              {isModalOpen && (
                <TwoButtonModal
                  title="멤버로 확정하시겠습니까?"
                  content="신청자1님을 멤버로 초대합니다"
                  firstCallback={() => {
                    setIsModalOpen(false);
                  }}
                  secondCallback={() => {
                    handleCreateRequest();
                    setIsModalOpen(false);
                  }}
                />
              )}
            </Pressable>
          )}
      </View>
      {meet && (
        <View className="px-2 mt-1">
          <MatchInfo match={meet.match} height={55} radius={3} />
          <View className="px-2 py-[6] border border-slate-200 bg-white mt-1 rounded-md shadow-sm shadow-gray-100">
            <CustomText className="text-[15px] text-gray-700" fontWeight="500">
              {meet.title}
            </CustomText>
            <View className="flex-row mt-[5]">
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500 text-[13px]"
                  fontWeight="500">
                  모집 인원
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.currentCount}/${meet.max}`}</CustomText>
              </View>
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500  text-[13px]"
                  fontWeight="500">
                  선호 성별
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.gender === 'ANY' ? '성별 무관' : '남자만'}`}</CustomText>
              </View>
            </View>
            <View className="flex-row mt-[5]">
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500 text-[13px]"
                  fontWeight="500">
                  선호 나이
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.minAge}~${meet.maxAge}세`}</CustomText>
              </View>
              {meet.type === 'BOOKING' ? (
                <View className="flex-1 flex-row items-center">
                  <CustomText
                    className="mr-2 text-slate-500 text-[13px]"
                    fontWeight="500">
                    선호 위치
                  </CustomText>
                  <CustomText className="text-[14px] flex-1">
                    {meet.place}
                  </CustomText>
                </View>
              ) : (
                <View className="flex-1 flex-row items-center">
                  <CustomText
                    className="mr-2 text-slate-500 text-[13px]"
                    fontWeight="500">
                    티켓 여부
                  </CustomText>
                  <CustomText className="text-[14px]">{`${meet.hasTicket ? '있음' : '없음'}`}</CustomText>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PrivateChatRoomHeader;
