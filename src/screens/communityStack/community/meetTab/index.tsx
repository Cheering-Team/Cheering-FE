import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import {useMainTabScroll} from 'context/useMainTabScroll';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {MutableRefObject, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusSvg from 'assets/images/plus-white.svg';
import FastImage from 'react-native-fast-image';
import {formatMonthDaySlash} from 'utils/format';

const MOCK_DATA = [
  {
    title: '같이 직관갈 사람 구해요',
    description:
      '직관 가실분 모집중이에요 뭐 어쩌구 저쩌구 티켓 자리는 얼씨구 절씨구 이야호',
    curCount: 1,
    maxCount: 5,
    hasTicket: false,
    gender: 'MALE',
    minAge: 20,
    maxAge: 29,
    writer: {
      id: 1,
      age: 20,
      gender: 'MALE',
    },
    match: {
      id: 1,
      opponentImage:
        'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/kt_wiz_emblem.png',
      time: new Date(),
    },
  },
];

interface MeetTabProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<any> | ScrollView | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
}

const MeetTab = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  listArrRef,
  tabRoute,
  community,
}: MeetTabProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const buttonOpacity = useSharedValue(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const scrollHandler = useAnimatedScrollHandler(event => {
    const currentScrollY = event.contentOffset.y;
    if (isTabFocused) {
      scrollY.value = currentScrollY;
    }

    if (currentScrollY > previousScrollY.value + 2 && currentScrollY > 0) {
      tabScrollY.value = withTiming(50);
    } else if (
      currentScrollY < previousScrollY.value - 2 &&
      currentScrollY > 0
    ) {
      tabScrollY.value = withTiming(0);
    }
    previousScrollY.value = currentScrollY;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderItem: ListRenderItem<any> = ({item}) => {
    return (
      <Pressable className="p-2">
        <CustomText className="text-base">{item.title}</CustomText>
        <View className="flex-row justify-between items-end mt-3">
          <View>
            <View className="flex-row">
              <View className="w-[60]">
                <CustomText>{`${item.curCount} / ${item.maxCount}`}</CustomText>
              </View>
              <View className="w-[60]">
                <CustomText>
                  {item.ticket ? '티켓 있음' : '티켓 없음'}
                </CustomText>
              </View>
            </View>
            <View className="flex-row">
              <View className="w-[60]">
                <CustomText>{item.gender === 'MALE' && '남자'}</CustomText>
              </View>
              <View className="w-[60]">
                <CustomText>{`${item.minAge} ~ ${item.maxAge}`}</CustomText>
              </View>
            </View>
          </View>
          <View className="flex-row items-center">
            <CustomText>{`${formatMonthDaySlash(item.match.time)} vs`}</CustomText>
            <FastImage
              source={{uri: item.match.opponentImage}}
              className="w-5 h-5"
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <Animated.FlatList
        ref={ref => {
          const foundIndex = listArrRef.current.findIndex(
            e => e.key === tabRoute.key,
          );

          if (foundIndex === -1) {
            listArrRef.current.push({
              key: tabRoute.key,
              value: ref,
            });
          } else {
            listArrRef.current[foundIndex] = {
              key: tabRoute.key,
              value: ref,
            };
          }
        }}
        showsVerticalScrollIndicator={false}
        data={MOCK_DATA}
        renderItem={renderItem}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          marginTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 40,
          paddingBottom: insets.bottom + 200,
        }}
        scrollIndicatorInsets={{
          top: 110 + insets.top,
        }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollBegin={() => {
          buttonOpacity.value = withTiming(0.1, {duration: 150});
          onMomentumScrollBegin();
        }}
        onMomentumScrollEnd={() => {
          buttonOpacity.value = withTiming(1, {duration: 300});
          onMomentumScrollEnd();
        }}
        onScrollEndDrag={onScrollEndDrag}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={HEADER_HEIGHT}
            colors={['#787878']}
          />
        }
        ListHeaderComponent={
          <View>
            <View className="p-3">
              <View className="flex-row">
                <Pressable className="flex-1 justify-center items-center">
                  <CustomText>모관</CustomText>
                  <CustomText>우리끼리 모여서 볼 때</CustomText>
                </Pressable>
                <Pressable className="flex-1 justify-center items-center">
                  <CustomText>직관</CustomText>
                  <CustomText>직접 경기장 가서 볼 때</CustomText>
                </Pressable>
              </View>
            </View>
            <ScrollView horizontal>
              <Pressable>
                <CustomText>성별</CustomText>
              </Pressable>
              <Pressable>
                <CustomText>나이대</CustomText>
              </Pressable>
              <Pressable>
                <CustomText>경기</CustomText>
              </Pressable>
              <Pressable>
                <CustomText>티켓</CustomText>
              </Pressable>
            </ScrollView>
            <View>
              <TextInput placeholder="검색" />
            </View>
          </View>
        }
        // onEndReached={community.curFan && loadPosts}
        // onEndReachedThreshold={community.curFan && 1}
        // ListEmptyComponent={
        //   isLoading ? (
        //     <FeedSkeleton type="Community" />
        //   ) : (
        //     <ListEmpty type="feed" />
        //   )
        // }
        // ListFooterComponent={
        //   isFetchingNextPage && community.curFan ? <ActivityIndicator /> : null
        // }
      />
      <Animated.View style={{opacity: buttonOpacity}}>
        <Pressable
          onPress={() => navigation.navigate('CreateMeet', {community})}
          className="absolute p-[11] rounded-full z-50"
          style={{
            backgroundColor: community.color,
            bottom: insets.bottom + 57,
            right: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}>
          <PlusSvg width={21} height={21} />
        </Pressable>
      </Animated.View>
    </>
  );
};

export default MeetTab;
