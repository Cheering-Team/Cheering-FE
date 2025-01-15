import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMeetMembers} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useRef} from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CrownSvg from 'assets/images/crown-flat.svg';
import Avatar from 'components/common/Avatar';
import MoreSvg from 'assets/images/three-dots-black.svg';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const MeetMemberListScreen = () => {
  useDarkStatusBar();
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetPrivateChatList'>>()
      .params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
            <Avatar size={42} uri={item.image} />

            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <CustomText fontWeight="500" className="text-[15px] mb-[2]">
                  {item.name}
                </CustomText>
                {item.isManager && (
                  <CrownSvg width={15} height={15} className="ml-[3] mb-[2]" />
                )}
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
            <Pressable
              onPress={() => {
                bottomSheetModalRef.current?.present();
              }}>
              <MoreSvg width={16} height={16} />
            </Pressable>
          </View>
        )}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
          paddingLeft: 20,
          paddingRight: 15,
        }}
      />
      <OptionModal
        modalRef={bottomSheetModalRef}
        firstText="수정"
        firstSvg="edit"
        firstOnPress={() => {
          //
        }}
        secondText="삭제"
        secondColor="#ff2626"
        secondSvg="trash"
        secondOnPress={() => {
          //
        }}
      />
    </View>
  );
};

export default MeetMemberListScreen;
