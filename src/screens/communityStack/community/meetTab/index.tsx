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
import {formatDOW, formatMonthDayDay, formatMonthDaySlash} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AgeSliderLabel from './components/AgeSliderLabel';
import RadioButton from 'components/common/RadioButton';
import SearchSvg from 'assets/images/search-sm.svg';
import PersonSvg from 'assets/images/person-slate.svg';
import GenderSvg from 'assets/images/gender-gray.svg';
import TicketSvg from 'assets/images/ticket-white.svg';
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
  const [type, setType] = useState<'BOOKING' | 'LIVE'>('BOOKING');
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
        className="flex-row mx-[10] my-3 border border-gray-200 bg-white rounded-[4px] overflow-hidden"
        style={{height: 105, width: WINDOW_WIDTH - 20}}
        onPress={() =>
          navigation.navigate('MeetRecruit', {meetId: 1, community})
        }>
        <View className="flex-1 px-3 pt-3 pb-[9] justify-between">
          <View>
            <CustomText className="text-[15px]" fontWeight="500">
              {item.title}
            </CustomText>
            <CustomText className="text-[14px] mt-1 text-gray-500">
              {item.description}
            </CustomText>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <CustomText className="text-[13px] text-[#798497]">{`${item.minAge}~${item.maxAge}세`}</CustomText>
              <View className="w-[1] h-3 bg-slate-400 mx-1" />
              <CustomText className="text-[13px] text-[#798497]">
                {item.gender === 'MALE' && '남자만'}
              </CustomText>
            </View>
            <View className="flex-row items-center">
              <PersonSvg width={11} height={11} />
              <CustomText className="text-[13px] ml-[2] text-[#798497]">{`${item.curCount}`}</CustomText>
              <CustomText className="text-[13px] mx-[2] text-[#798497]">{`/`}</CustomText>
              <CustomText className="text-[13px] text-[#798497]">{`${item.maxCount}`}</CustomText>
            </View>
          </View>
        </View>
        <View
          className="items-center justify-center w-[85]"
          style={{backgroundColor: `${'#000000'}E0`}}>
          <TicketSvg
            width={22}
            height={22}
            className="absolute top-[1] right-[3]"
          />
          <FastImage
            source={{uri: MOCK_DATA[0].match.opponentImage}}
            className="w-[42] h-[42]"
          />
          <CustomText className="text-white mt-[2]">
            {`vs ${MOCK_DATA[0].match.opponentName}`}
          </CustomText>
          <CustomText className="text-[#e9e9e9] mt-[2] text-[11.5px]">
            {formatMonthDayDay(MOCK_DATA[0].match.time.toISOString())}
          </CustomText>
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
          backgroundColor: '#ffffff',
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
            <View className="bg-[#ececec] mx-[10] my-2 border border-slate-300 rounded-t-[6px] rounded-b-[6px]">
              <View className="flex-row">
                <Pressable
                  className="flex-1 justify-center items-center py-[3] border-r border-slate-300 rounded-tl-[4px]"
                  style={{
                    backgroundColor: type === 'BOOKING' ? 'white' : undefined,
                  }}
                  onPress={() => setType('BOOKING')}>
                  <CustomText
                    fontWeight="600"
                    className="text-[15px] mb-[1]"
                    style={{
                      color: type === 'BOOKING' ? community.color : '#858585',
                    }}>
                    모관
                  </CustomText>
                  {type === 'BOOKING' && (
                    <CustomText
                      fontWeight="500"
                      className="text-[11px]"
                      style={{
                        color: type === 'BOOKING' ? '#5c5c5c' : '#8b8b8b',
                      }}>
                      모여서 우리끼리
                    </CustomText>
                  )}
                </Pressable>
                <Pressable
                  className="flex-1 justify-center items-center py-[3] rounded-tr-[4px]"
                  onPress={() => setType('LIVE')}
                  style={{
                    backgroundColor: type === 'LIVE' ? 'white' : undefined,
                  }}>
                  <CustomText
                    fontWeight="600"
                    className="text-[15px] mb-[1]"
                    style={{
                      color: type === 'LIVE' ? community.color : '#858585',
                    }}>
                    직관
                  </CustomText>
                  {type === 'LIVE' && (
                    <CustomText
                      fontWeight="500"
                      className="text-[11px]"
                      style={{color: type === 'LIVE' ? '#5c5c5c' : '#8b8b8b'}}>
                      직접 경기장 가서
                    </CustomText>
                  )}
                </Pressable>
              </View>
              <View
                className="bg-white flex-row items-center px-2 border-t border-slate-300 rounded-b-[4px]"
                style={{paddingVertical: Platform.OS === 'ios' ? 10 : 6}}>
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
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 10}}>
              <Pressable className="flex-row items-center mr-2 border border-slate-300 py-[6] px-2 rounded-[4px]">
                <CustomText fontWeight="400" className="text-[#5c5c5c] mr-1">
                  경기
                </CustomText>
                <DownSvg width={12} height={12} />
              </Pressable>
              <Pressable
                className="flex-row items-center justify-between mr-2 border py-[6] px-2 rounded-[4px]"
                style={{
                  borderColor: isAgeFirstOpen ? community.color : '#cbd5e1',
                }}
                onPress={() => {
                  setIsAgeOpen(prev => !prev);
                  setIsAgeFirstOpen(true);
                  setIsGenderOpen(false);
                  setIsTicketOpen(false);
                }}>
                <CustomText
                  className="mr-1"
                  style={{color: isAgeFirstOpen ? community.color : '#5c5c5c'}}>
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
                style={{
                  borderColor: isGenderFirstOpen ? community.color : '#cbd5e1',
                }}
                onPress={() => {
                  setIsGenderOpen(prev => !prev);
                  setIsGenderFirstOpen(true);
                  setIsAgeOpen(false);
                  setIsTicketOpen(false);
                }}>
                <CustomText
                  className="mr-1"
                  style={{
                    color: isGenderFirstOpen ? community.color : '#5c5c5c',
                  }}>
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
                  style={{
                    borderColor: isTicketFirstOpen
                      ? community.color
                      : '#cbd5e1',
                  }}
                  onPress={() => {
                    setIsTicketOpen(prev => !prev);
                    setIsTicketFirstOpen(true);
                    setIsAgeOpen(false);
                    setIsGenderOpen(false);
                  }}>
                  <CustomText
                    className="mr-1"
                    style={{
                      color: isTicketFirstOpen ? community.color : '#5c5c5c',
                    }}>
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
              <View className="items-center px-3 flex-1 pt-[11] mt-2 bg-gray-50">
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
                  selectedStyle={{backgroundColor: community.color}}
                  unselectedStyle={{backgroundColor: '#eeeeee'}}
                  onValuesChange={([first, second]) => {
                    setMinAge(first);
                    setMaxAge(second);
                  }}
                />
              </View>
            )}
            {isGengerOpen && (
              <View className="items-center flex-row px-[10] py-2 mt-2 bg-gray-50">
                <RadioButton
                  title="성별 무관"
                  selected={gender === 'ANY'}
                  onPress={() => {
                    setGender('ANY');
                    setIsGenderOpen(false);
                  }}
                  color={community.color}
                />
                <View className="w-[8]" />
                <RadioButton
                  title="남자"
                  selected={gender === 'MALE'}
                  onPress={() => {
                    setGender('MALE');
                    setIsGenderOpen(false);
                  }}
                  color={community.color}
                />
                <View className="w-[8]" />
                <RadioButton
                  title="여자"
                  selected={gender === 'FEMALE'}
                  onPress={() => {
                    setGender('FEMALE');
                    setIsGenderOpen(false);
                  }}
                  color={community.color}
                />
              </View>
            )}
            {isTicketOpen && (
              <View className="items-center flex-row px-[10] py-2 mt-2 bg-gray-50">
                <RadioButton
                  title="전체"
                  selected={hasTicket === 'ALL'}
                  onPress={() => {
                    setHasTicket('ALL');
                    setIsTicketOpen(false);
                  }}
                  color={community.color}
                />
                <View className="w-[8]" />
                <RadioButton
                  title="티켓 있음"
                  selected={hasTicket === 'HAS'}
                  onPress={() => {
                    setHasTicket('HAS');
                    setIsTicketOpen(false);
                  }}
                  color={community.color}
                />
                <View className="w-[8]" />
                <RadioButton
                  title="티켓 없음"
                  selected={hasTicket === 'NOT'}
                  onPress={() => {
                    setHasTicket('NOT');
                    setIsTicketOpen(false);
                  }}
                  color={community.color}
                />
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
