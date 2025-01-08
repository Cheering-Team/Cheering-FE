import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetMeetById} from 'apis/meet/useMeets';
import {useCreatePrivateChatRoom} from 'apis/chat/useChats';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import MatchInfo from 'components/common/MatchInfo';

const MeetRecruitScreen = () => {
  useDarkStatusBar();
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetRecruit'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meet} = useGetMeetById(meetId);
  const {mutateAsync: register} = useCreatePrivateChatRoom();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleRegister = async () => {
    // const data = await register({communityId: community.id, meetId});

    // console.log(JSON.stringify(data));

    navigation.navigate('ChatRoom', {chatRoomId: 2652});
  };

  if (!meet) {
    return null;
  }

  return (
    <View className="flex-1">
      <CCHeader
        title="모임 참여하기"
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
        <View className="flex-row items-center mt-1">
          <CustomText className="text-[13px] text-slate-500">20대</CustomText>
          <View className="w-[1] h-3 bg-slate-400 mx-1" />
          <CustomText className="text-[13px]  text-slate-500">남자</CustomText>
        </View>

        <View className="mt-3 border border-slate-300 rounded-md p-3">
          <Pressable className="mb-3">
            <MatchInfo match={meet.match} height={85} radius={3} />
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
            {meet.meetType === 'BOOKING' ? (
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

      <Pressable
        className="justify-center items-center bg-black mt-2 mx-2 p-3 rounded-md"
        style={{marginBottom: insets.bottom + 8}}
        onPress={handleRegister}>
        <CustomText className="text-white text-[17px]" fontWeight="500">
          대화하기
        </CustomText>
      </Pressable>
    </View>
  );
};

export default MeetRecruitScreen;
