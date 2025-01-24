import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFindAllMyMeets} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  SectionListProps,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MeetCard from './community/meetTab/components/MeetCard';
import CustomText from 'components/common/CustomText';
import CheckSvg from 'assets/images/check-white.svg';
import {MeetInfo} from 'apis/meet/types';
import {useGetFanInfo} from 'apis/fan/useFans';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

const AnimatedSectionList =
  Animated.createAnimatedComponent<SectionListProps<MeetInfo>>(SectionList);

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
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [pastFiltering, setPastFiltering] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: meets,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useFindAllMyMeets(community.id, pastFiltering);
  const {data: profile} = useGetFanInfo(community.curFan?.id);

  const loadMeets = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const sections = getMergedSections(meets?.pages || []);

  return (
    <View className="flex-1">
      <CCHeader
        title="내 모임 목록"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
        secondType="PROFILE"
        onSecondPress={() => {
          if (community.curFan) {
            navigation.navigate('ProfileEdit', {
              fanId: community.curFan?.id,
              type: 'MEET',
            });
          }
        }}
        secondImage={profile?.meetImage}
      />
      <AnimatedSectionList
        sections={sections}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={loadMeets}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            progressViewOffset={insets.top + 55}
            onRefresh={handleRefresh}
            colors={['#787878']}
          />
        }
        ListHeaderComponent={
          <View className="pr-4 pt-3">
            <Pressable
              className="self-end flex-row items-center"
              onPress={() => {
                setPastFiltering(prev => !prev);
              }}>
              <View
                className="w-[15] h-[15] rounded-[4px] border mr-[5] justify-center items-center"
                style={{
                  backgroundColor: pastFiltering ? community.color : 'white',
                  borderColor: pastFiltering ? community.color : '#9ca3af',
                }}>
                {pastFiltering && <CheckSvg />}
              </View>
              <CustomText
                className="text-[15px] text-gray-600"
                fontWeight="500">
                지난 모임 보기
              </CustomText>
            </Pressable>
          </View>
        }
        renderSectionHeader={({section: {title}}) => (
          <CustomText
            className="text-[16px] text-slate-800 mt-3 mb-2 mx-3"
            fontWeight="600">
            {title}
          </CustomText>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View className="h-[150] justify-center items-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ListEmpty type="myMeet" />
          )
        }
        renderItem={({item}) => (
          <MeetCard
            meet={item}
            type="MY"
            onPress={() => {
              if (item.status === 'MANAGER' || item.status === 'CONFIRMED') {
                navigation.navigate('Meet', {
                  meetId: item.id,
                  communityId: community.id,
                });
              } else {
                navigation.navigate('MeetRecruit', {
                  meetId: item.id,
                  community,
                });
              }
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
