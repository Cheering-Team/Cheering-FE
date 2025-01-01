import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackSvg from 'assets/images/chevron-left.svg';
import FastImage from 'react-native-fast-image';
import {formatMonthDaySlash} from 'utils/format';
import {useGetMeetById} from 'apis/meet/useMeets';
import {useCreatePrivateChatRoom} from 'apis/chat/useChats';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const MeetRecruitScreen = () => {
  useDarkStatusBar();
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetRecruit'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meet} = useGetMeetById();
  const {mutateAsync: register} = useCreatePrivateChatRoom();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleRegister = async () => {
    // const {id} = await register();

    navigation.navigate('ChatRoom', {chatRoomId: 2404});
  };

  if (!meet) {
    return null;
  }

  return (
    <View className="flex-1">
      <CCHeader
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{paddingTop: insets.top + 55 + 15}}>
        <View>
          <CustomText>{meet.title}</CustomText>
        </View>
        <View className="flex-row items-center">
          <CustomText>{`${formatMonthDaySlash(meet.match.time)} vs`}</CustomText>
          <FastImage
            source={{uri: meet.match.opponentImage}}
            className="w-5 h-5"
          />
        </View>
        <View>
          <View className="flex-row">
            <View className="flex-1">
              <CustomText>{`${meet.currentCount} / ${meet.max}`}</CustomText>
            </View>
            <View className="flex-1">
              <CustomText>
                {meet.hasTicket ? '티켓 있음' : '티켓 없음'}
              </CustomText>
            </View>
          </View>
          <View className="flex-row">
            <View className="flex-1">
              <CustomText>{meet.gender === 'ANY' && '무관'}</CustomText>
            </View>
            <View className="flex-1">
              <CustomText>{`${meet.minAge} ~ ${meet.maxAge}`}</CustomText>
            </View>
          </View>
        </View>
        <CustomText numberOfLines={999}>{meet.description}</CustomText>
      </Animated.ScrollView>
      <Pressable
        className="justify-center items-center bg-black m-2 p-3 rounded-md"
        onPress={handleRegister}>
        <CustomText className="text-white">신청하기</CustomText>
      </Pressable>
    </View>
  );
};

export default MeetRecruitScreen;
