import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMeetMembers} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React from 'react';
import {
  SectionList,
  SectionListProps,
  SectionListRenderItem,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MeetMember} from 'apis/meet/types';
import MeetMemberCard from './community/meetTab/components/MeetMemberCard';

const AnimatedSectionList =
  Animated.createAnimatedComponent<SectionListProps<MeetMember>>(SectionList);

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

  const renderItem: SectionListRenderItem<MeetMember> = ({item}) => {
    return (
      <MeetMemberCard member={item} community={community} meetId={meetId} />
    );
  };

  if (!members) {
    return null;
  }

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
      <AnimatedSectionList
        sections={members.filter(section => section.data.length > 0)}
        renderItem={renderItem}
        onScroll={scrollHandler}
        renderSectionHeader={({section: {title}}) => {
          return (
            <CustomText
              className="text-[15px] text-slate-700 mt-3 mb-2"
              fontWeight="600">
              {title === 'MEMBERS' ? '현재 멤버' : '탈퇴한 멤버'}
            </CustomText>
          );
        }}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
          paddingLeft: 20,
        }}
      />
    </View>
  );
};

export default MeetMemberListScreen;
