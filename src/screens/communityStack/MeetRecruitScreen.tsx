import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useState} from 'react';
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
import {useIsAgeAndGenderSet} from 'apis/user/useUsers';
import MeetProfileModal from './community/meetTab/components/MeetProfileModal';
import OneButtonModal from 'components/common/OneButtonModal';

const MeetRecruitScreen = () => {
  useDarkStatusBar();
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetRecruit'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [isAgeGenderModalOpen, setIsAgeGenderModalOpen] = useState(false);
  const [isExceeded, setIsExceeded] = useState(false);
  const [initialStep, setInitialStep] = useState<'info' | 'profile'>('info');
  const [isRestrictedMatchModal, setIsRestrictedMatchModal] = useState(false);

  const {data: meet} = useGetMeetById(meetId);
  const {mutateAsync: register} = useCreatePrivateChatRoom();
  const {refetch: isAgeGenderSetRefetch} = useIsAgeAndGenderSet(community.id);

  const handleRegister = async () => {
    const response = await isAgeGenderSetRefetch();
    if (response.data === 'BOTH') {
      try {
        const data = await register({communityId: community.id, meetId});
        navigation.navigate('ChatRoom', {
          chatRoomId: data.chatRoomId,
          type: 'PRIVATE',
        });
      } catch (error: any) {
        if (error.code === 2015) {
          setIsExceeded(true);
        }
        if (error.code === 2013) {
          setIsRestrictedMatchModal(true);
          return;
        }
      }
    } else if (response.data === 'NEITHER') {
      setIsAgeGenderModalOpen(true);
    } else {
      setInitialStep('profile');
      setIsAgeGenderModalOpen(true);
    }
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
        <View className="flex-row items-center">
          {meet.type === 'LIVE' && (
            <CustomText
              className="text-[17px] text-gray-500 mr-[3]"
              fontWeight="600">
              {`[직관]`}
            </CustomText>
          )}
          {meet.type === 'BOOKING' && (
            <CustomText
              className="text-[17px] text-gray-500 mr-[3]"
              fontWeight="600">
              {`[모관]`}
            </CustomText>
          )}
          <CustomText className="text-[19px]" fontWeight="500">
            {meet.title}
          </CustomText>
        </View>

        <View className="flex-row items-center mt-1 ml-[1]">
          <CustomText className="text-[13px] text-slate-500">
            {`${Math.floor(meet.writer.age / 10) * 10}대`}
          </CustomText>
          <View className="w-[1] h-3 bg-slate-400 mx-1" />
          <CustomText className="text-[13px]  text-slate-500">
            {meet.writer.gender === 'MALE' ? '남자' : '여자'}
          </CustomText>
        </View>

        <View className="mt-3 border border-slate-300 rounded-md p-3">
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
          <View className="flex-row mt-[6]">
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

      {meet.isMember ? (
        <Pressable
          className="justify-center items-center bg-black mt-2 mx-2 p-3 rounded-md"
          style={{marginBottom: insets.bottom + 8}}
          onPress={() => {
            navigation.navigate('Meet', {
              meetId: meet.id,
              communityId: community.id,
            });
          }}>
          <CustomText className="text-white text-[17px]" fontWeight="500">
            모임으로 이동하기
          </CustomText>
        </Pressable>
      ) : (
        <Pressable
          className="justify-center items-center bg-black mt-2 mx-2 p-3 rounded-md"
          style={{marginBottom: insets.bottom + 8}}
          onPress={handleRegister}>
          <CustomText className="text-white text-[17px]" fontWeight="500">
            대화하기
          </CustomText>
        </Pressable>
      )}

      {isAgeGenderModalOpen && (
        <MeetProfileModal
          communityId={community.id}
          initialStep={initialStep}
          initialName={community.curFan?.name}
          firstCallback={() => {
            setIsAgeGenderModalOpen(false);
          }}
          secondCallback={async () => {
            try {
              const data = await register({communityId: community.id, meetId});
              navigation.navigate('ChatRoom', {
                chatRoomId: data.chatRoomId,
                type: 'PRIVATE',
              });
              setIsAgeGenderModalOpen(false);
            } catch (error: any) {
              if (error.code === 2015) {
                setIsExceeded(true);
              }
              if (error.code === 2013) {
                setIsRestrictedMatchModal(true);
                return;
              }
            }
          }}
        />
      )}
      {isExceeded && (
        <OneButtonModal
          title="인원 초과"
          content="모임의 인원이 이미 가득 찼습니다"
          onButtonPress={() => {
            setIsExceeded(false);
          }}
        />
      )}
      {isRestrictedMatchModal && (
        <OneButtonModal
          title="모임 참여 제한"
          content="해당 경기 시작 48시간전에 취소한 모임이 있기 때문에 해당 경기 모임에 참여할 수 없습니다."
          onButtonPress={() => setIsRestrictedMatchModal(false)}
        />
      )}
    </View>
  );
};

export default MeetRecruitScreen;
