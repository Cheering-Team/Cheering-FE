import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDeleteMeet, useGetMeetById, useLeaveMeet} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import CustomText from 'components/common/CustomText';
import MatchInfo from 'components/common/MatchInfo';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChatSvg from 'assets/images/chat-line-black.svg';
import MemberSvg from 'assets/images/people-black.svg';
import MemberAddSvg from 'assets/images/people-plus-black.svg';
import {useGetCommunityById} from 'apis/community/useCommunities';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import TwoButtonModal from 'components/common/TwoButtonModal';
import {showTopToast} from 'utils/toast';

const MeetScreen = () => {
  const {meetId, communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'Meet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  const {data: meet} = useGetMeetById(meetId);
  const {data: community} = useGetCommunityById(communityId);
  const {mutateAsync: deleteMeet} = useDeleteMeet();
  const {mutateAsync: leaveMeet} = useLeaveMeet();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleDeleteMeet = async () => {
    try {
      await deleteMeet(meetId);
      setIsDeleteOpen(false);
      showTopToast({type: 'success', message: '모임이 삭제되었습니다'});
      if (community) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Community',
                params: {communityId, initialIndex: 4},
              },
            ],
          }),
        );
      }
    } catch (error: any) {
      //
    }
  };

  const handleLeaveMeet = async () => {
    try {
      await leaveMeet(meetId);
      setIsLeaveOpen(false);
      showTopToast({type: 'success', message: '모임에서 탈퇴하였습니다'});
      if (community) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Community',
                params: {communityId, initialIndex: 4},
              },
            ],
          }),
        );
      }
    } catch (error: any) {
      //
    }
  };

  if (!meet || !community) {
    return null;
  }

  return (
    <View className="flex-1">
      <CCHeader
        title="모임 정보"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
        secondType="MORE"
        onSecondPress={() => {
          bottomSheetModalRef.current?.present();
        }}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
          paddingHorizontal: 12,
        }}>
        <CustomText className="text-[19px]" fontWeight="500">
          {meet.title}
        </CustomText>
        <View className="flex-row">
          <Pressable
            className="flex-1 items-center justify-center pt-5 pb-4"
            onPress={() => {
              navigation.navigate('ChatRoom', {
                chatRoomId: meet.chatRoom.id,
                type: 'CONFIRM',
              });
            }}>
            <ChatSvg width={22} height={22} />
            <CustomText
              className="text-gray-700 mt-[7] text-[13px]"
              fontWeight="500">
              단체대화
            </CustomText>
          </Pressable>
          <Pressable
            className="flex-1 items-center justify-center pt-5 pb-4"
            onPress={() => {
              navigation.navigate('MeetMeberList', {
                meetId: meet.id,
                community,
              });
            }}>
            <MemberSvg width={22} height={22} />
            <CustomText
              className="text-gray-700 mt-[7] text-[13px]"
              fontWeight="500">
              멤버
            </CustomText>
          </Pressable>
          {meet.isManager && (
            <Pressable
              className="flex-1 items-center justify-center pt-5 pb-4"
              onPress={() => {
                navigation.navigate('MeetPrivateChatList', {
                  meetId: meet.id,
                  community,
                });
              }}>
              <MemberAddSvg width={22} height={22} />
              <CustomText
                className="text-gray-700 mt-[7] text-[13px]"
                fontWeight="500">
                신청목록
              </CustomText>
            </Pressable>
          )}
        </View>
        <View className="border border-slate-300 rounded-md p-3">
          <Pressable
            className="mb-3"
            onPress={() => {
              navigation.navigate('Match', {
                matchId: meet.match.id,
                communityId: community.id,
              });
            }}>
            <MatchInfo match={meet.match} height={65} radius={3} />
          </Pressable>
          <View className="flex-row">
            <View className="flex-1 flex-row items-center">
              <CustomText className="mr-2 text-slate-500" fontWeight="500">
                모집 인원
              </CustomText>
              <CustomText className="text-[15px]">{`${meet.currentCount}/${meet.max}`}</CustomText>
            </View>
            <View className="flex-1 flex-row items-center">
              <CustomText className="mr-2 text-slate-500" fontWeight="500">
                선호 성별
              </CustomText>
              <CustomText className="text-[15px]">{`${meet.gender === 'ANY' ? '성별 무관' : '남자만'}`}</CustomText>
            </View>
          </View>
          <View className="flex-row mt-2">
            <View className="flex-1 flex-row items-center">
              <CustomText className="mr-2 text-slate-500" fontWeight="500">
                선호 나이
              </CustomText>
              <CustomText className="text-[15px]">{`${meet.minAge}~${meet.maxAge}세`}</CustomText>
            </View>
            {meet.type === 'LIVE' && (
              <View className="flex-1 flex-row items-center">
                <CustomText className="mr-2 text-slate-500" fontWeight="500">
                  티켓 여부
                </CustomText>
                <CustomText className="text-[15px]">{`${meet.hasTicket ? '있음' : '없음'}`}</CustomText>
              </View>
            )}
          </View>
          {meet.type === 'BOOKING' && (
            <View className="flex-1 flex-row items-center mt-[6]">
              <CustomText className="mr-2 text-slate-500" fontWeight="500">
                선호 위치
              </CustomText>
              <CustomText className="text-[15px]">{meet.place}</CustomText>
            </View>
          )}
        </View>
        <CustomText numberOfLines={999} className="mt-3 text-[15px]">
          {meet.description}
        </CustomText>
      </Animated.ScrollView>
      {meet.isManager && (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="모임 수정"
          firstSvg="edit"
          firstOnPress={() => {
            //
          }}
          secondText="모임 삭제"
          secondColor="#ff2626"
          secondSvg="trash"
          secondOnPress={() => {
            setIsDeleteOpen(true);
          }}
        />
      )}
      {!meet.isManager && (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="모임 탈퇴"
          firstSvg="exit"
          firstColor="#ff2626"
          firstOnPress={() => {
            setIsLeaveOpen(true);
          }}
        />
      )}
      {isDeleteOpen && (
        <TwoButtonModal
          title="모임을 삭제하시겠습니까?"
          content={
            '복구할 수 없으며 모든 팀원들에게\n모임 취소에 대한 알림이 전송됩니다'
          }
          firstCallback={() => {
            setIsDeleteOpen(false);
          }}
          secondText="삭제"
          secondCallback={handleDeleteMeet}
          secondButtonColor="#e65151"
        />
      )}
      {isLeaveOpen && (
        <TwoButtonModal
          title="모임에서 탈퇴하시겠습니까?"
          content={
            '경기까지 이틀 이내로 남았다면 해당 경기에 대해서는 다른 모임에 참가할 수 없습니다'
          }
          firstCallback={() => {
            setIsLeaveOpen(false);
          }}
          secondText="탈퇴"
          secondCallback={handleLeaveMeet}
          secondButtonColor="#e65151"
        />
      )}
    </View>
  );
};

export default MeetScreen;
