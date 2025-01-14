import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MeetInfo} from 'apis/meet/types';
import {useFindAllMyMeets} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useEffect} from 'react';
import {ListRenderItem, SectionList, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MeetCard from './community/meetTab/components/MeetCard';
import CustomText from 'components/common/CustomText';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const mergeSectionsEfficiently = (existingSections, newPage) => {
  const firstNewSection = newPage.meets[0];
  const lastExistingSection = existingSections[existingSections.length - 1];

  if (
    !lastExistingSection ||
    lastExistingSection.title !== firstNewSection.title
  ) {
    return [...existingSections, ...newPage.meets];
  }

  const mergedLastSection = {
    ...lastExistingSection,
    data: [...lastExistingSection.data, ...firstNewSection.data],
  };

  return [
    ...existingSections.slice(0, -1),
    mergedLastSection,
    ...newPage.meets.slice(1),
  ];
};

const getMergedSections = pages => {
  return pages.reduce((mergedSections, currentPage) => {
    return mergeSectionsEfficiently(mergedSections, currentPage);
  }, []);
};

const MyMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetPrivateChatList'>>()
      .params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meets} = useFindAllMyMeets(community.id);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const sections = getMergedSections(meets?.pages || []);

  // const renderItem: ListRenderItem<MeetInfo> = ({item}) => {
  //   return (
  //     <MeetCard
  //       meet={item}
  //       onPress={() => {
  //         navigation.navigate('Meet', {meetId: item.id, community});
  //       }}
  //     />
  //   );
  // };

  return (
    <View className="flex-1">
      <CCHeader
        title="내 모임 목록"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <AnimatedSectionList
        sections={sections}
        onScroll={scrollHandler}
        renderSectionHeader={({section: {title}}) => (
          <CustomText
            className="text-[16px] text-slate-800 mt-5 mb-2 mx-3"
            fontWeight="600">
            {title}
          </CustomText>
        )}
        renderItem={({item}) => (
          <MeetCard
            meet={item}
            onPress={() => {
              navigation.navigate('Meet', {
                meetId: item.id,
                communityId: community.id,
              });
            }}
          />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + 45,
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default MyMeetScreen;
