import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMeetMembers} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CrownSvg from 'assets/images/crown-flat.svg';
import Avatar from 'components/common/Avatar';

const MeetMemberListScreen = () => {
  useDarkStatusBar();
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetPrivateChatList'>>()
      .params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: members} = useGetMeetMembers(meetId);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  return (
    <View className="flex-1">
      <CCHeader
        title="멤버 목록"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.FlatList
        data={members}
        renderItem={({item}) => (
          <View className="flex-row items-center py-[10]">
            <Avatar size={42} />

            <View className="ml-3">
              <View className="flex-row items-center">
                <CustomText fontWeight="500" className="text-[15px] mb-[2]">
                  {item.name}
                </CustomText>
                <CrownSvg width={15} height={15} className="ml-[3] mb-[2]" />
              </View>

              <View className="flex-row items-center">
                <CustomText className="text-gray-500">
                  {item.userAge}
                </CustomText>
                <View className="w-[2] h-[2] bg-gray-400 mx-[5] rounded-full" />
                <CustomText className="text-gray-500">
                  {item.userGender === 'MALE' ? '남자' : '여자'}
                </CustomText>
              </View>
            </View>
          </View>
        )}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
          paddingHorizontal: 20,
        }}
      />
    </View>
  );
};

export default MeetMemberListScreen;
