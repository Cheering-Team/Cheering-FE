import {Community} from 'apis/community/types';
import CustomText from 'components/common/CustomText';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CloseSvg from 'assets/images/close-black.svg';
import PlusSvg from 'assets/images/plus-white.svg';
import PlusGraySvg from 'assets/images/plus-gray.svg';
import PersonSvg from 'assets/images/person-plus-gray.svg';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useGetNearMatch} from 'apis/match/useMatches';
import {
  formatDate,
  formatDateTime,
  formatMonthDayDay,
  formatTime,
} from 'utils/format';
import FastImage from 'react-native-fast-image';
import {MatchDetail} from 'apis/match/types';
import {VotePayload} from 'apis/post/types';
import {useSearchPlayers} from 'apis/community/useCommunities';
import {debounce} from 'lodash';
import SearchSvg from 'assets/images/search-sm.svg';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import {showTopToast} from 'utils/toast';

interface MakeVoteProps {
  community: Community;
  setIsVote: Dispatch<SetStateAction<boolean>>;
  vote: VotePayload;
  setVote: Dispatch<SetStateAction<VotePayload>>;
}

const MakeVote = ({community, setIsVote, vote, setVote}: MakeVoteProps) => {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [curOption, setCurOption] = useState<number | null>(null);
  const [name, setName] = useState('');
  const debouncedSetName = debounce(setName, 300);

  const [isDate, setIsDate] = useState(false);

  const matchModalRef = useRef<BottomSheetModal>(null);
  const playerModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '90%'], []);

  const {data: matches} = useGetNearMatch(community.id);
  const {
    data: communities,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useSearchPlayers(community.id, name, community.type === 'TEAM');

  const loadPlayers = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const renderItem: ListRenderItem<Community> = ({item}) => {
    if (item.id === null) {
      return <View className="flex-1 mx-[2]" />;
    }
    return (
      <Pressable
        className="flex-1 m-[2] mb-1 rounded-[5px] overflow-hidden"
        onPress={() => {
          if (curOption !== null) {
            setVote(prev => {
              const nextOptions = [...prev.options];
              nextOptions[curOption].name = item.koreanName;
              nextOptions[curOption].image = item.image;
              nextOptions[curOption].communityId = item.id;
              return {...prev, options: nextOptions};
            });
            playerModalRef.current?.dismiss();
          }
        }}>
        <FastImage source={{uri: item.image}} className="w-full h-[160]" />
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.8)',
          ]}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <View className="absolute bottom-[5] left-[5]">
          <CustomText className="text-white text-[20px]" type="titleCenter">
            {item.koreanName}
          </CustomText>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="m-3 p-4 bg-gray-100 rounded-md border border-gray-200">
      <View className="flex-row justify-between mb-3 items-center">
        {match ? (
          <View className="flex-row items-center border border-gray-200 rounded-full px-2 bg-white h-[34]">
            <FastImage
              source={{
                uri:
                  community.koreanName === match.homeTeam.koreanName
                    ? match.awayTeam.image
                    : match.homeTeam.image,
              }}
              className="w-7 h-7"
            />
            <CustomText className="ml-1 text-base" fontWeight="500">
              {formatDate(match.time)}
            </CustomText>
            <Pressable
              onPress={() => {
                setMatch(null);
                setVote(prev => ({...prev, matchId: null}));
              }}
              className="bg-gray-200 p-[1] rounded-full ml-2">
              <CloseSvg width={16} height={16} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            className="px-3 rounded-full flex-row items-center h-[34]"
            style={{backgroundColor: community.color}}
            onPress={() => {
              Keyboard.dismiss();
              matchModalRef.current?.present();
            }}>
            <CustomText
              className="text-white text-[15px] mr-[6]"
              fontWeight="500">
              경기 추가
            </CustomText>
            <PlusSvg width={11} height={11} />
          </Pressable>
        )}

        <Pressable onPress={() => setIsVote(false)}>
          <CloseSvg width={25} height={25} />
        </Pressable>
      </View>
      <TextInput
        placeholder="투표 제목"
        className="bg-white py-[10] px-3 my-[2] text-[17px] text-gray-700"
        onChangeText={text => {
          setVote(prev => ({...prev, title: text}));
        }}
        style={{
          includeFontPadding: false,
          fontFamily: 'NotoSansKR-SemiBold',
        }}
        placeholderTextColor={'#848484'}
      />

      {vote.options.map((value, index) => (
        <View
          key={index.toString()}
          className="flex-row items-center bg-white my-[2]">
          {vote.options[index].image && (
            <FastImage
              source={{uri: vote.options[index].image}}
              className="w-8 h-8 rounded-full ml-2 border border-slate-100"
            />
          )}
          <TextInput
            placeholder="항목 입력"
            className="bg-white py-[10] px-3 text-base text-gray-900 flex-1"
            style={{
              includeFontPadding: false,
              fontFamily: 'NotoSansKR-Regular',
            }}
            value={vote.options[index].name}
            onChangeText={text => {
              setVote(prev => {
                const nextOptions = [...prev.options];
                nextOptions[index].name = text;
                return {...prev, options: nextOptions};
              });
            }}
            placeholderTextColor={'#a4a4a4'}
          />
          {community.type === 'TEAM' ? (
            vote.options[index].communityId ? (
              <Pressable
                onPress={() => {
                  setVote(prev => {
                    const nextOptions = [...prev.options];
                    nextOptions[index].communityId = null;
                    nextOptions[index].name = '';
                    nextOptions[index].image = null;
                    return {...prev, options: nextOptions};
                  });
                }}
                className="px-[14]">
                <View className="bg-gray-200 p-[1] rounded-full">
                  <CloseSvg width={16} height={16} />
                </View>
              </Pressable>
            ) : (
              <Pressable
                className="px-3"
                onPress={() => {
                  setCurOption(index);
                  Keyboard.dismiss();
                  playerModalRef.current?.present();
                }}>
                <PersonSvg width={20} height={20} />
              </Pressable>
            )
          ) : (
            <></>
          )}
        </View>
      ))}
      <Pressable
        className="py-[10] items-center my-[2] bg-white flex-row justify-center"
        onPress={() => {
          if (vote.options.length < 20) {
            setVote(prev => {
              const nextOptions = [
                ...prev.options,
                {name: '', image: null, communityId: null},
              ];
              return {...prev, options: nextOptions};
            });
          } else {
            showTopToast({
              type: 'fail',
              message: '항목은 최대 20개입니다',
            });
          }
        }}>
        <PlusGraySvg width={12} height={12} />
        <CustomText className="text-base text-gray-500 ml-[6]">
          항목 추가
        </CustomText>
      </Pressable>
      <View className="mt-3 flex-row items-center">
        <CustomText className="text-[15px] text-gray-600 mr-3" fontWeight="500">
          종료시간
        </CustomText>
        <Pressable
          onPress={() => setIsDate(true)}
          className="bg-gray-200 py-1 px-2 rounded-lg">
          <CustomText className="text-base">
            {formatDateTime(vote.endTime.toISOString())}
          </CustomText>
        </Pressable>
        <DatePicker
          modal
          title={'종료시간'}
          confirmText="완료"
          cancelText="취소"
          open={isDate}
          date={vote.endTime}
          onConfirm={date => {
            setIsDate(false);
            setVote(prev => ({...prev, endTime: date}));
          }}
          onCancel={() => {
            setIsDate(false);
          }}
          minimumDate={new Date()}
        />
      </View>

      <BottomSheetModal
        ref={playerModalRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        snapPoints={snapPoints}>
        <View
          className="bg-gray-100 flex-row px-3 rounded-2xl mx-[10] items-center mb-3"
          style={{paddingVertical: Platform.OS === 'ios' ? 9 : 5}}>
          <SearchSvg width={20} height={20} />
          <TextInput
            onFocus={() => playerModalRef.current?.snapToIndex(1)}
            className="flex-1 p-0 m-0 ml-[6]"
            placeholder="선수 검색"
            onChangeText={debouncedSetName}
            style={{
              fontFamily: 'Pretendard-Regular',
              paddingBottom: 1,
              fontSize: 16,
              includeFontPadding: false,
            }}
          />
        </View>
        <BottomSheetFlatList
          data={
            (communities && [
              ...communities.pages.flatMap(page => page.players),
              ...new Array(
                3 -
                  (communities.pages.flatMap(page => page.players).length % 3),
              ).fill({
                id: null,
              }),
            ]) ||
            []
          }
          contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 10}}
          numColumns={3}
          ListFooterComponent={
            <View className="h-[200] items-center justify-center">
              {isLoading ? (
                <ActivityIndicator />
              ) : communities &&
                communities.pages.flatMap(page => page.players).length > 0 ? (
                <></>
              ) : (
                <CustomText className="text-[17px] text-gray-900">
                  검색 결과가 없습니다
                </CustomText>
              )}
            </View>
          }
          renderItem={renderItem}
          onEndReachedThreshold={1}
          onEndReached={loadPlayers}
        />
      </BottomSheetModal>
      <BottomSheetModal ref={matchModalRef} backdropComponent={renderBackdrop}>
        <BottomSheetFlatList
          data={matches || []}
          contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 10}}
          ListEmptyComponent={
            <View className="h-[200] items-center justify-center">
              <CustomText className="text-[17px] text-gray-900">
                1주일 전/후의 최근 경기가 없습니다
              </CustomText>
            </View>
          }
          renderItem={({item}) => (
            <Pressable
              className="border border-slate-200 rounded-lg bg-wihte my-2 px-3 py-[6] bg-slate-50"
              onPress={() => {
                setMatch(item);
                setVote(prev => ({...prev, matchId: item.id}));
                matchModalRef.current?.dismiss();
              }}>
              <CustomText
                className="text-lg text-slate-800 mb-1 ml-[2]"
                fontWeight="600">
                {formatMonthDayDay(item.time)}
              </CustomText>
              <View className="flex-row justify-between items-center">
                <View className="items-center w-[120]">
                  <FastImage
                    source={{uri: item.homeTeam.image}}
                    className="w-[60] h-[60]"
                  />
                  <CustomText
                    fontWeight={
                      community.koreanName === item.homeTeam.koreanName
                        ? '600'
                        : '400'
                    }
                    className="text-base"
                    style={{
                      color:
                        community.koreanName === item.homeTeam.koreanName
                          ? 'black'
                          : '#2d2d2d',
                    }}>
                    {item.homeTeam.shortName}
                  </CustomText>
                </View>
                <View className="items-center">
                  <CustomText fontWeight="600" className="text-base">
                    {formatTime(item.time)}
                  </CustomText>
                  <CustomText className="text-slate-600" fontWeight="500">
                    {item.location}
                  </CustomText>
                </View>
                <View className="items-center w-[120]">
                  <FastImage
                    source={{uri: item.awayTeam.image}}
                    className="w-[60] h-[60]"
                  />
                  <CustomText
                    fontWeight={
                      community.koreanName === item.homeTeam.koreanName
                        ? '400'
                        : '600'
                    }
                    className="text-base"
                    style={{
                      color:
                        community.koreanName === item.homeTeam.koreanName
                          ? '#2d2d2d'
                          : 'black',
                    }}>
                    {item.awayTeam.shortName}
                  </CustomText>
                </View>
              </View>
            </Pressable>
          )}
        />
      </BottomSheetModal>
    </View>
  );
};

export default MakeVote;
