import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {useMainTabScroll} from 'context/useMainTabScroll';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {MutableRefObject, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
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
import {formatDOW, formatMonthDaySlash} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AgeSliderLabel from './components/AgeSliderLabel';
import RadioButton from 'components/common/RadioButton';
import SearchSvg from 'assets/images/search-sm.svg';
import PersonSvg from 'assets/images/person-gray-fill.svg';
import GenderSvg from 'assets/images/gender-gray.svg';
import TicketSvg from 'assets/images/ticket-gray.svg';
import AgeSvg from 'assets/images/age-gray.svg';

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
      opponentName: 'KT',
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
  const [type, setType] = useState<'BOOK' | 'LIVE'>('BOOK');
  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [isAgeFirstOpen, setIsAgeFirstOpen] = useState(false);
  const [minAge, setMinAge] = useState(13);
  const [maxAge, setMaxAge] = useState(45);
  const [isGengerOpen, setIsGenderOpen] = useState(false);
  const [isGenderFirstOpen, setIsGenderFirstOpen] = useState(false);
  const [gender, setGender] = useState<'ANY' | 'MALE' | 'FEMALE'>('ANY');
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isTicketFirstOpen, setIsTicketFirstOpen] = useState(false);
  const [hasTicket, setHasTicket] = useState<'ALL' | 'HAS' | 'NOT'>('ALL');

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
      <Pressable
        className="mx-[10] pt-4 pb-2 border-b border-gray-100"
        onPress={() =>
          navigation.navigate('MeetRecruit', {meetId: 1, community})
        }>
        <CustomText numberOfLines={2} className="text-[15px]">
          {item.title}
        </CustomText>
        <View className="flex-row justify-between items-end mt-4">
          <View className="pb-1">
            <View className="flex-row mb-1">
              <View className="w-[80] flex-row items-center">
                <PersonSvg width={13} height={12} />
                <CustomText
                  className="text-[13px] text-gray-500 ml-[3]"
                  fontWeight="500">{`${item.curCount} / ${item.maxCount}명`}</CustomText>
              </View>
              <View className="w-[80] flex-row items-center">
                <AgeSvg width={15} height={11} />
                <CustomText
                  className="text-[13px] text-gray-500 ml-[3]"
                  fontWeight="500">{`${item.minAge} ~ ${item.maxAge}세`}</CustomText>
              </View>
            </View>
            <View className="flex-row">
              <View className="w-[80] flex-row items-center">
                <GenderSvg width={13} height={13} />
                <CustomText
                  className="text-[13px] text-gray-500 ml-[3]"
                  fontWeight="500">
                  {item.gender === 'MALE' && '남자'}
                </CustomText>
              </View>
              <View className="w-[80] flex-row items-center">
                <TicketSvg width={15} height={15} />
                <CustomText
                  className="text-[13px] text-gray-500 ml-[3]"
                  fontWeight="500">
                  {item.ticket ? '티켓 있음' : '티켓 없음'}
                </CustomText>
              </View>
            </View>
          </View>
          <View className="flex-row items-center">
            <CustomText
              className="mr-[3] text-gray-900 text-[13px]"
              fontWeight="500">{`${formatMonthDaySlash(item.match.time)}${formatDOW(item.match.time)} vs ${item.match.opponentName}`}</CustomText>
            <FastImage
              source={{uri: item.match.opponentImage}}
              className="w-[22] h-[22]"
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
            <View className="px-[10] py-2">
              <View className="flex-row bg-[#ecebec] p-[2.5] rounded-[3px]">
                <Pressable
                  className="flex-1 justify-center items-center py-[2] rounded-[2px]"
                  style={{
                    backgroundColor: type === 'BOOK' ? 'white' : undefined,
                  }}
                  onPress={() => setType('BOOK')}>
                  <CustomText
                    fontWeight="600"
                    className="text-[14px] mb-[1]"
                    style={{color: type === 'BOOK' ? '#3755ff' : '#8b8b8b'}}>
                    모관
                  </CustomText>
                  <CustomText
                    className="text-[11px]"
                    style={{color: type === 'BOOK' ? '#5c5c5c' : '#8b8b8b'}}>
                    모여서 우리끼리 보자
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-1 justify-center items-center py-[2] rounded-[2px]"
                  onPress={() => setType('LIVE')}
                  style={{
                    backgroundColor: type === 'LIVE' ? 'white' : undefined,
                  }}>
                  <CustomText
                    fontWeight="600"
                    className="text-[14px] mb-[1]"
                    style={{color: type === 'LIVE' ? '#ff3737' : '#8b8b8b'}}>
                    직관
                  </CustomText>
                  <CustomText
                    className="text-[11px]"
                    style={{color: type === 'LIVE' ? '#5c5c5c' : '#8b8b8b'}}>
                    직접 경기장 가서 보자
                  </CustomText>
                </Pressable>
              </View>
            </View>
            <View
              className="bg-[#F5F4F5] flex-row px-2 rounded-md items-center mb-1 mx-[10] mt-[2]"
              style={{paddingVertical: Platform.OS === 'ios' ? 8 : 4}}>
              <SearchSvg width={18} height={18} />
              <TextInput
                className="flex-1 p-0 m-0 ml-[6]"
                placeholder="모임 검색"
                placeholderTextColor={'#9e9e9e'}
                // onChangeText={debouncedSetName}
                style={{
                  fontFamily: 'Pretendard-Regular',
                  paddingBottom: 1,
                  fontSize: 15,
                  includeFontPadding: false,
                }}
              />
            </View>
            <ScrollView
              horizontal
              className="mt-[6]"
              contentContainerStyle={{paddingHorizontal: 10}}>
              <Pressable className="flex-row items-center mr-2 border border-[#dcdcdc] py-[6] px-2 rounded-[4px]">
                <CustomText fontWeight="400" className="text-[#5c5c5c] mr-1">
                  경기
                </CustomText>
                <DownSvg width={12} height={12} />
              </Pressable>
              <Pressable
                className="flex-row items-center justify-between mr-2 border py-[6] px-2 rounded-[4px]"
                style={{borderColor: isAgeFirstOpen ? 'black' : '#dcdcdc'}}
                onPress={() => {
                  setIsAgeOpen(prev => !prev);
                  setIsAgeFirstOpen(true);
                  setIsGenderOpen(false);
                  setIsTicketOpen(false);
                }}>
                <CustomText
                  className="mr-1"
                  style={{color: isAgeFirstOpen ? 'black' : '#5c5c5c'}}>
                  {isAgeFirstOpen
                    ? minAge === maxAge
                      ? `${minAge === 45 ? '45+' : maxAge}세`
                      : `${minAge}~${maxAge === 45 ? '45+' : maxAge}세`
                    : '나이대'}
                </CustomText>
                <DownSvg width={12} height={12} />
              </Pressable>
              <Pressable
                className="flex-row items-center mr-2 border py-[6] px-2 rounded-[4px]"
                style={{borderColor: isGenderFirstOpen ? 'black' : '#dcdcdc'}}
                onPress={() => {
                  setIsGenderOpen(prev => !prev);
                  setIsGenderFirstOpen(true);
                  setIsAgeOpen(false);
                  setIsTicketOpen(false);
                }}>
                <CustomText
                  className="mr-1"
                  style={{color: isGenderFirstOpen ? 'black' : '#5c5c5c'}}>
                  {isGenderFirstOpen
                    ? gender === 'ANY'
                      ? '성별 무관'
                      : gender === 'MALE'
                        ? '남자'
                        : '여자'
                    : '성별'}
                </CustomText>
                <DownSvg width={12} height={12} />
              </Pressable>
              {type === 'LIVE' && (
                <Pressable
                  className="flex-row items-center mr-2 border py-[6] px-2 rounded-[4px]"
                  style={{borderColor: isTicketFirstOpen ? 'black' : '#dcdcdc'}}
                  onPress={() => {
                    setIsTicketOpen(prev => !prev);
                    setIsTicketFirstOpen(true);
                    setIsAgeOpen(false);
                    setIsGenderOpen(false);
                  }}>
                  <CustomText
                    className="mr-1"
                    style={{color: isTicketFirstOpen ? 'black' : '#5c5c5c'}}>
                    {isTicketFirstOpen
                      ? hasTicket === 'ALL'
                        ? '전체'
                        : hasTicket === 'HAS'
                          ? '티켓 있음'
                          : '티켓 없음'
                      : '티켓 여부'}
                  </CustomText>
                  <DownSvg width={12} height={12} />
                </Pressable>
              )}
            </ScrollView>
            {isAgeOpen && (
              <View className="items-center px-3 flex-1 pt-[13]">
                <MultiSlider
                  allowOverlap
                  values={[minAge, maxAge]}
                  min={13}
                  max={45}
                  sliderLength={WINDOW_WIDTH * 0.8}
                  enableLabel
                  snapped
                  customMarker={e => {
                    return (
                      <View className="w-5 h-5 bg-white rounded-full shadow-sm shadow-slate-400"></View>
                    );
                  }}
                  customLabel={AgeSliderLabel}
                  selectedStyle={{backgroundColor: '#909090'}}
                  unselectedStyle={{backgroundColor: '#eeeeee'}}
                  onValuesChange={([first, second]) => {
                    setMinAge(first);
                    setMaxAge(second);
                  }}
                />
              </View>
            )}
            {isGengerOpen && (
              <View className="items-center flex-row px-[14] py-6">
                <Pressable
                  className="flex-row items-center"
                  onPress={() => {
                    setGender('ANY');
                    setIsGenderOpen(false);
                  }}>
                  <RadioButton selected={gender === 'ANY'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: gender === 'ANY' ? 'black' : '#898989'}}>
                    성별 무관
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-row items-center ml-4"
                  onPress={() => {
                    setGender('MALE');
                    setIsGenderOpen(false);
                  }}>
                  <RadioButton selected={gender === 'MALE'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: gender === 'MALE' ? 'black' : '#898989'}}>
                    남자
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-row items-center ml-4"
                  onPress={() => {
                    setGender('FEMALE');
                    setIsGenderOpen(false);
                  }}>
                  <RadioButton selected={gender === 'FEMALE'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: gender === 'FEMALE' ? 'black' : '#898989'}}>
                    여자
                  </CustomText>
                </Pressable>
              </View>
            )}
            {isTicketOpen && (
              <View className="items-center flex-row px-[14] py-6">
                <Pressable
                  className="flex-row items-center"
                  onPress={() => {
                    setHasTicket('ALL');
                    setIsTicketOpen(false);
                  }}>
                  <RadioButton selected={hasTicket === 'ALL'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: hasTicket === 'ALL' ? 'black' : '#898989'}}>
                    전체
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-row items-center ml-4"
                  onPress={() => {
                    setHasTicket('HAS');
                    setIsTicketOpen(false);
                  }}>
                  <RadioButton selected={hasTicket === 'HAS'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: hasTicket === 'HAS' ? 'black' : '#898989'}}>
                    티켓 있음
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-row items-center ml-4"
                  onPress={() => {
                    setHasTicket('NOT');
                    setIsTicketOpen(false);
                  }}>
                  <RadioButton selected={hasTicket === 'NOT'} />
                  <CustomText
                    fontWeight="500"
                    className="ml-[6] text-[13px]"
                    style={{color: hasTicket === 'NOT' ? 'black' : '#898989'}}>
                    티켓 없음
                  </CustomText>
                </Pressable>
              </View>
            )}
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
