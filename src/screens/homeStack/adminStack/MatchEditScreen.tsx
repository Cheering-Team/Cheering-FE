import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEditMatch, useGetMatchDetail} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import StackHeader from 'components/common/StackHeader';
import {AdminStackParamList} from 'navigations/adminStack/AdminStackNavigator';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';
import {formatDate} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import UpSvg from 'assets/images/chevron-up-gray.svg';
import {MatchStatus} from 'apis/match/types';
import {showTopToast} from 'utils/toast';
import {useSearchPlayers} from 'apis/community/useCommunities';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import SearchSvg from 'assets/images/search-sm.svg';
import {debounce} from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import {Community} from 'apis/community/types';
import {Picker} from '@react-native-picker/picker';

const MatchEditScreen = () => {
  const {matchId} =
    useRoute<RouteProp<AdminStackParamList, 'MatchEdit'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  const [isDate, setIsDate] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const debouncedSetName = debounce(setName, 300);
  const [time, setTime] = useState<Date>(new Date());
  const [status, setStatus] = useState<MatchStatus>('not_started');
  const [location, setLocation] = useState<string>('');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [step, setStep] = useState<'HOME' | 'AWAY'>('HOME');
  const [homePlayers, setHomePlayers] = useState<Community[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Community[]>([]);

  const playerModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '90%'], []);

  const {data: match} = useGetMatchDetail(matchId);

  const {mutateAsync: editMatch} = useEditMatch();
  const {
    data: communities,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useSearchPlayers(
    step === 'HOME' ? match?.homeTeam.id || null : match?.awayTeam.id || null,
    name,
    isOpen,
  );

  const loadPlayers = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleEditMatch = useCallback(async () => {
    await editMatch({
      matchId,
      time: new Date(time.getTime() - time.getTimezoneOffset() * 60000),
      location,
      status,
      homeScore,
      awayScore,
      homePlayers,
      awayPlayers,
    });
    showTopToast({message: '수정 완료'});
    navigation.goBack();
  }, [
    awayPlayers,
    awayScore,
    editMatch,
    homePlayers,
    homeScore,
    location,
    matchId,
    navigation,
    status,
    time,
  ]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <Pressable
          className="bg-black justify-center mx-3 items-center p-3 rounded-md"
          onPress={() => {
            if (step === 'HOME') {
              setStep('AWAY');
            } else {
              handleEditMatch();
            }
          }}>
          <CustomText className="text-white text-lg" fontWeight="500">
            저장
          </CustomText>
        </Pressable>
      </BottomSheetFooter>
    ),
    [handleEditMatch, step],
  );

  const renderItem: ListRenderItem<Community> = ({item}) => {
    if (item.id === null) {
      return <View className="flex-1 mx-[2]" />;
    }
    return (
      <Pressable
        className="flex-1 m-[2] mb-1 rounded-[5px] overflow-hidden"
        style={{
          opacity:
            homePlayers.includes(item) || awayPlayers.includes(item) ? 0.3 : 1,
        }}
        onPress={() => {
          if (step === 'HOME') {
            setHomePlayers(prev => {
              if (prev.includes(item)) {
                return [...prev].filter(value => value !== item);
              } else {
                return [...prev, item];
              }
            });
          } else {
            setAwayPlayers(prev => {
              if (prev.includes(item)) {
                return [...prev].filter(value => value !== item);
              } else {
                return [...prev, item];
              }
            });
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

  useEffect(() => {
    if (match) {
      setTime(new Date(match.time));
      setLocation(match.location);
      setStatus(match.status);
      setHomeScore(match.homeScore || 0);
      setAwayScore(match.awayScore || 0);
    }
  }, [match]);

  if (!match) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="경기 수정" />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{alignItems: 'center', paddingTop: 10}}>
          <Pressable
            className="py-1 px-3 bg-gray-200 rounded-xl mb-5"
            onPress={() => setIsDate(true)}>
            <CustomText className="text-2xl text-gray-700" fontWeight="600">
              {formatDate(time.toISOString())}
            </CustomText>
          </Pressable>
          <TextInput
            value={location}
            onChangeText={setLocation}
            className="p-0 m-0 border border-gray-200 rounded-sm px-3 py-1 text-xl mb-2"
            style={{includeFontPadding: false}}
          />
          <Picker
            selectedValue={status}
            onValueChange={itemValue => setStatus(itemValue)}
            style={{width: '60%'}}>
            <Picker.Item label="경기전" value={'not_started'} />
            <Picker.Item label="경기중" value={'live'} />
            <Picker.Item label="경기종료" value={'closed'} />
          </Picker>

          <View className="flex-row items-center mt-5">
            <View className="flex-1 items-center">
              <FastImage
                source={{uri: match.homeTeam.image}}
                className="w-[60] h-[60]"
              />
              <CustomText className="text-lg mb-5" fontWeight="600">
                {match.homeTeam.shortName}
              </CustomText>
              <View className="items-center">
                <TextInput
                  keyboardType="numeric"
                  value={homeScore?.toString()}
                  style={{includeFontPadding: false}}
                  onChangeText={text => setHomeScore(Number(text))}
                  className="m-0 p-0 text-6xl"
                />
                <View className="flex-row">
                  <Pressable
                    className="py-3 px-4 border border-gray-500 rounded-sm mr-1"
                    onPress={() => setHomeScore(prev => prev - 1)}>
                    <DownSvg width={25} height={25} />
                  </Pressable>
                  <Pressable
                    className="py-3 px-4 border border-gray-500 rounded-sm ml-1"
                    onPress={() => setHomeScore(prev => prev + 1)}>
                    <UpSvg width={25} height={25} />
                  </Pressable>
                </View>
              </View>
            </View>
            <View className="flex-1 items-center">
              <FastImage
                source={{uri: match.awayTeam.image}}
                className="w-[60] h-[60]"
              />
              <CustomText className="text-lg mb-5" fontWeight="600">
                {match.awayTeam.shortName}
              </CustomText>
              <View className="items-center">
                <TextInput
                  keyboardType="numeric"
                  value={awayScore?.toString()}
                  style={{includeFontPadding: false}}
                  onChangeText={text => setAwayScore(Number(text))}
                  className="m-0 p-0 text-6xl"
                />
                <View className="flex-row">
                  <Pressable
                    className="py-3 px-4 border border-gray-500 rounded-sm mr-1"
                    onPress={() => setAwayScore(prev => prev - 1)}>
                    <DownSvg width={25} height={25} />
                  </Pressable>
                  <Pressable
                    className="py-3 px-4 border border-gray-500 rounded-sm ml-1"
                    onPress={() => setAwayScore(prev => prev + 1)}>
                    <UpSvg width={25} height={25} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <DatePicker
          modal
          title={'경기시간'}
          confirmText="완료"
          cancelText="취소"
          open={isDate}
          date={time}
          onConfirm={date => {
            setIsDate(false);
            setTime(date);
          }}
          onCancel={() => {
            setIsDate(false);
          }}
        />
        <Pressable
          className="justify-center items-center bg-black p-3 m-3 rounded-md"
          onPress={() => {
            if (status === 'closed') {
              playerModalRef.current?.present();
              setIsOpen(true);
            } else {
              handleEditMatch();
            }
          }}>
          <CustomText className="text-lg text-white" fontWeight="500">
            저장하기
          </CustomText>
        </Pressable>
      </KeyboardAvoidingView>
      <BottomSheetModal
        ref={playerModalRef}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        enableDynamicSizing={false}
        onDismiss={() => {
          setStep('HOME');
          setHomePlayers([]);
          setAwayPlayers([]);
        }}
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
    </SafeAreaView>
  );
};

export default MatchEditScreen;
