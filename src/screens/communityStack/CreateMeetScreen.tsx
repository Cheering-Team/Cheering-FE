import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useState} from 'react';
import {Platform, Pressable, SafeAreaView, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CloseSvg from 'assets/images/close-black.svg';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import AgeSliderLabel from './community/meetTab/components/AgeSliderLabel';
import RadioButton from 'components/common/RadioButton';

const CreateMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'CreateMeet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<'BOOK' | 'LIVE'>('BOOK');
  const [gender, setGender] = useState<'ANY' | 'MALE' | 'FEMALE'>('ANY');
  const [hasTicket, setHasTicket] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <View
        className="pl-[6] pr-[10] flex-row justify-between items-center bg-white z-50"
        style={{
          height: 40,
          marginTop: Platform.OS === 'android' ? insets.top : undefined,
        }}>
        <Pressable
          className="w-[50]"
          onPress={() => {
            navigation.goBack();
          }}>
          <CloseSvg width={27} height={27} />
        </Pressable>
        <View className="items-center">
          <CustomText fontWeight="500" className="text-[15px] text-slate-900">
            모임 만들기
          </CustomText>
          <CustomText
            fontWeight="500"
            className="text-[13px]"
            style={{color: community.color}}>
            {community.koreanName}
          </CustomText>
        </View>
        <Pressable
          onPress={() => {
            // handleWritePost();
          }}
          // disabled={isWriting}
          style={{
            backgroundColor: community.color,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}>
          <CustomText fontWeight="500" className="text-[15px] text-white">
            등록
          </CustomText>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 20,
          paddingBottom: 40,
        }}>
        <View>
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
        {/* <View className="mt-3">
          <CustomText>경기 선택</CustomText>
          <Pressable>
            <CustomText>경기 선택하기</CustomText>
          </Pressable>
        </View> */}
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
            제목
          </CustomText>
          <TextInput
            placeholder="모집글의 제목을 입력해주세요"
            placeholderTextColor={'#9e9e9e'}
            className="border border-gray-200 py-2 px-[6] rounded-[4px]"
            style={{
              fontFamily: 'Pretendard-Regular',
              includeFontPadding: false,
            }}
          />
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
            설명
          </CustomText>
          <TextInput
            placeholder="어떤 사람과 가고 싶은지 구체적으로 설명해 주세요"
            multiline
            placeholderTextColor={'#9e9e9e'}
            className="border border-gray-200 py-2 px-[6] rounded-[4px] h-[100]"
            style={{
              fontFamily: 'Pretendard-Regular',
              includeFontPadding: false,
            }}
          />
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
            최대인원
          </CustomText>
          <View className="items-center">
            <MultiSlider
              allowOverlap
              values={[2]}
              min={2}
              max={10}
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
              onValuesChange={([first]) => {
                // setMinAge(first);
                // setMaxAge(second);
              }}
            />
          </View>
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
            나이대
          </CustomText>
          <View className="items-center">
            <MultiSlider
              allowOverlap
              values={[13, 45]}
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
                // setMinAge(first);
                // setMaxAge(second);
              }}
            />
          </View>
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
            성별
          </CustomText>
          <View className="items-center flex-row pl-1 pb-2">
            <Pressable
              className="flex-row items-center"
              onPress={() => {
                setGender('ANY');
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
        </View>
        {type === 'BOOK' && (
          <View>
            <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
              위치
            </CustomText>
            <TextInput
              placeholder="모집글의 제목을 입력해주세요"
              placeholderTextColor={'#9e9e9e'}
              className="border border-gray-200 py-2 px-[6] rounded-[4px]"
              style={{
                fontFamily: 'Pretendard-Regular',
                includeFontPadding: false,
              }}
            />
          </View>
        )}

        {type === 'LIVE' && (
          <View>
            <CustomText fontWeight="500" className="text-[15px] ml-[2] my-4">
              티켓여부
            </CustomText>
            <View className="items-center flex-row pl-1 pb-2">
              <Pressable
                className="flex-row items-center"
                onPress={() => {
                  setHasTicket(false);
                }}>
                <RadioButton selected={!hasTicket} />
                <CustomText
                  fontWeight="500"
                  className="ml-[6] text-[13px]"
                  style={{color: !hasTicket ? 'black' : '#898989'}}>
                  티켓 없음
                </CustomText>
              </Pressable>
              <Pressable
                className="flex-row items-center ml-4"
                onPress={() => {
                  setHasTicket(true);
                }}>
                <RadioButton selected={hasTicket} />
                <CustomText
                  fontWeight="500"
                  className="ml-[6] text-[13px]"
                  style={{color: hasTicket ? 'black' : '#898989'}}>
                  티켓 있음
                </CustomText>
              </Pressable>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      {/* <BottomSheetModal ref={matchModalRef} backdropComponent={renderBackdrop}>
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
              onPress={() => {}}>
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
      </BottomSheetModal> */}
    </SafeAreaView>
  );
};

export default CreateMeetScreen;
