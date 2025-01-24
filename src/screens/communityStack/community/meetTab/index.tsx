import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {useMainTabScroll} from 'context/useMainTabScroll';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {MutableRefObject, useRef, useState} from 'react';
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
import {formatDate} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AgeSliderLabel from './components/AgeSliderLabel';
import RadioButton from 'components/common/RadioButton';
import SearchSvg from 'assets/images/search-sm.svg';
import {useGetAllMeetsByCommunity} from 'apis/meet/useMeets';
import {MeetInfo} from 'apis/meet/types';
import MatchSelectModal from 'components/common/MatchSelectModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useGetTwoWeeksMatches} from 'apis/match/useMatches';
import {MatchDetail} from 'apis/match/types';
import CloseSvg from 'assets/images/close-black.svg';
import {debounce} from 'lodash';

import MeetProfileModal from './components/MeetProfileModal';
import {useIsAgeAndGenderSet} from 'apis/user/useUsers';
import MeetCard from './components/MeetCard';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

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

  const matchModalRef = useRef<BottomSheetModal>(null);

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
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const debouncedSetKeyword = debounce(setKeyword, 300);
  const [isAgeGenderModalOpen, setIsAgeGenderModalOpen] = useState(false);
  const [initialStep, setInitialStep] = useState<'info' | 'profile'>('info');

  const {data: matches} = useGetTwoWeeksMatches(community.id);
  const {
    data: meets,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useGetAllMeetsByCommunity({
    communityId: community.id,
    type,
    gender,
    minAge,
    maxAge,
    ticketOption: type === 'BOOKING' ? 'ALL' : hasTicket,
    matchId: match ? match.id : null,
    keyword,
  });
  const {refetch: isAgeGenderSetRefetch} = useIsAgeAndGenderSet(community.id);

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
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const loadMeets = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleCreateButton = async () => {
    const response = await isAgeGenderSetRefetch();
    if (response.data === 'BOTH') {
      navigation.navigate('CreateMeet', {community});
    } else if (response.data === 'NEITHER') {
      setIsAgeGenderModalOpen(true);
    } else {
      setInitialStep('profile');
      setIsAgeGenderModalOpen(true);
    }
  };

  const handleMyButton = async () => {
    const response = await isAgeGenderSetRefetch();
    if (response.data === 'BOTH') {
      navigation.navigate('MyMeet', {community});
    } else if (response.data === 'NEITHER') {
      setIsAgeGenderModalOpen(true);
    } else {
      setInitialStep('profile');
      setIsAgeGenderModalOpen(true);
    }
  };

  const renderItem: ListRenderItem<MeetInfo> = ({item}) => {
    return (
      <MeetCard
        meet={item}
        onPress={() => {
          navigation.navigate('MeetRecruit', {meetId: item.id, community});
        }}
      />
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
        data={meets?.pages.flatMap(page => page.meets)}
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
                  onChangeText={debouncedSetKeyword}
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
              style={{marginBottom: 5}}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              {(match ||
                isAgeFirstOpen ||
                isGenderFirstOpen ||
                (type === 'LIVE' && isTicketFirstOpen)) && (
                <Pressable
                  className="items-center justify-center mr-2 my-[2] border h-[26] w-[26] px-2 rounded-full border-[#cbd5e1]"
                  onPress={() => {
                    setMatch(null);
                    setIsAgeFirstOpen(false);
                    setMinAge(13);
                    setMaxAge(45);
                    setIsGenderFirstOpen(false);
                    setGender('ANY');
                    setIsTicketFirstOpen(false);
                    setHasTicket('ALL');
                    setIsAgeOpen(false);
                    setIsGenderOpen(false);
                    setIsTicketOpen(false);
                  }}>
                  <CloseSvg width={18} height={18} />
                </Pressable>
              )}

              <Pressable
                className="flex-row items-center mr-2 border h-[31] px-2 rounded-[4px]"
                style={{
                  borderColor: match ? community.color : '#cbd5e1',
                }}
                onPress={() => {
                  matchModalRef.current?.present();
                  setIsGenderOpen(false);
                  setIsAgeOpen(false);
                  setIsTicketOpen(false);
                }}>
                {match ? (
                  <>
                    <FastImage
                      source={{
                        uri:
                          community.koreanName === match.homeTeam.koreanName
                            ? match.awayTeam.image
                            : match.homeTeam.image,
                      }}
                      className="w-[25] h-[25]"
                    />
                    <CustomText
                      className="mx-1"
                      style={{color: community.color}}
                      fontWeight="500">
                      {formatDate(match.time)}
                    </CustomText>
                    <DownSvg width={12} height={12} />
                  </>
                ) : (
                  <>
                    <CustomText
                      fontWeight="400"
                      className="text-[#5c5c5c] mr-1">
                      경기
                    </CustomText>
                    <DownSvg width={12} height={12} />
                  </>
                )}
              </Pressable>
              <Pressable
                className="flex-row items-center justify-between mr-2 border h-[31] px-2 rounded-[4px]"
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
                className="flex-row items-center mr-2 border h-[31] px-2 rounded-[4px]"
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
                      ? '성별 전체'
                      : gender === 'MALE'
                        ? '남자'
                        : '여자'
                    : '성별'}
                </CustomText>
                <DownSvg width={12} height={12} />
              </Pressable>
              {type === 'LIVE' && (
                <Pressable
                  className="flex-row items-center mr-2 border h-[31] px-2 rounded-[4px]"
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
              <View className="items-center px-3 flex-1 pt-[11] bg-gray-100">
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
              <View className="items-center flex-row px-[10] py-2 bg-gray-100">
                <RadioButton
                  title="전체"
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
              <View className="items-center flex-row px-[10] py-2 bg-gray-100">
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
        onEndReached={loadMeets}
        onEndReachedThreshold={1}
        ListEmptyComponent={
          isLoading ? null : type === 'BOOKING' ? (
            <ListEmpty type="booking" />
          ) : (
            <ListEmpty type="live" />
          )
        }
      />
      <Animated.View style={{opacity: buttonOpacity}}>
        <Pressable
          onPress={handleMyButton}
          className="absolute rounded-full z-50 w-[44] h-[44] justify-center items-center border border-gray-200 shadow-sm shadow-gray-200"
          style={{
            backgroundColor: 'white',
            bottom: insets.bottom + 162,
            right: 11.5,
          }}>
          <CustomText
            fontWeight="600"
            className="text-[15px] text-center"
            style={{color: community.color}}>
            MY
          </CustomText>
        </Pressable>
        <Pressable
          onPress={handleCreateButton}
          className="absolute rounded-full z-50 w-[43] h-[43] justify-center items-center"
          style={{
            backgroundColor: community.color,
            bottom: insets.bottom + 112,
            right: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}>
          <PlusSvg width={21} height={21} />
        </Pressable>
      </Animated.View>
      <MatchSelectModal
        matchModalRef={matchModalRef}
        community={community}
        matches={matches}
        onPress={(item: MatchDetail) => {
          setMatch(item);
        }}
      />
      {isAgeGenderModalOpen && (
        <MeetProfileModal
          communityId={community.id}
          initialStep={initialStep}
          initialName={community.curFan?.name}
          firstCallback={() => {
            setIsAgeGenderModalOpen(false);
          }}
          secondCallback={() => {
            navigation.navigate('CreateMeet', {community});
            setIsAgeGenderModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default MeetTab;
