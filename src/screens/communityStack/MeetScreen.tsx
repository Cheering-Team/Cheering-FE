import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMeetById} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import CustomText from 'components/common/CustomText';
import MatchInfo from 'components/common/MatchInfo';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChatSvg from 'assets/images/chat-line-black.svg';
import MemberSvg from 'assets/images/people-black.svg';
import MemberAddSvg from 'assets/images/people-plus-black.svg';

const MeetScreen = () => {
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'Meet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meet} = useGetMeetById(meetId);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!meet) {
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
              navigation.navigate('ChatRoom', {chatRoomId: meet.chatRoom.id});
            }}>
            <ChatSvg width={22} height={22} />
            <CustomText
              className="text-gray-700 mt-[7] text-[13px]"
              fontWeight="500">
              단체대화
            </CustomText>
          </Pressable>
          <Pressable className="flex-1 items-center justify-center pt-5 pb-4">
            <MemberSvg width={22} height={22} />
            <CustomText
              className="text-gray-700 mt-[7] text-[13px]"
              fontWeight="500">
              멤버
            </CustomText>
          </Pressable>
          <Pressable className="flex-1 items-center justify-center pt-5 pb-4">
            <MemberAddSvg width={22} height={22} />
            <CustomText
              className="text-gray-700 mt-[7] text-[13px]"
              fontWeight="500">
              신청목록
            </CustomText>
          </Pressable>
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
            {meet.type === 'BOOKING' ? (
              <View className="flex-1 flex-row items-center">
                <CustomText className="mr-2 text-slate-500" fontWeight="500">
                  선호 위치
                </CustomText>
                <CustomText className="text-[15px]">{meet.place}</CustomText>
              </View>
            ) : (
              <View className="flex-1 flex-row items-center">
                <CustomText className="mr-2 text-slate-500" fontWeight="500">
                  티켓 여부
                </CustomText>
                <CustomText className="text-[15px]">{`${meet.hasTicket ? '있음' : '없음'}`}</CustomText>
              </View>
            )}
          </View>
        </View>
        <CustomText numberOfLines={999} className="mt-3 text-[15px]">
          {meet.description}
        </CustomText>
      </Animated.ScrollView>
    </View>
  );
};

export default MeetScreen;
