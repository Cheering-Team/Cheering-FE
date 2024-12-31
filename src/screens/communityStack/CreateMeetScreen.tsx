import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
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
import ArrowLeftSvg from 'assets/images/arrow-left.svg';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CCHeader from 'components/common/CCHeader';
import BasicTextInput from 'components/common/BasicTextInput';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

const CreateMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'CreateMeet'>>().params;
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<'BOOKING' | 'LIVE'>('BOOKING');
  const [gender, setGender] = useState<'ANY' | 'MALE' | 'FEMALE'>('ANY');
  const [hasTicket, setHasTicket] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View className="flex-1">
      <CCHeader scrollY={scrollY} community={community} />
      <AnimatedKeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: insets.top + 55 + 10,
          paddingBottom: 40,
        }}
        onScroll={scrollHandler}>
        <View className="flex-row">
          <RadioButton
            title="모관"
            color={community.color}
            description={`경기장 안가고 우리끼리\n보고 싶을 때`}
            selected={type === 'BOOKING'}
            onPress={() => {
              setType('BOOKING');
            }}
          />
          <View className="w-[15]" />
          <RadioButton
            title="직관"
            color={community.color}
            description={`직접 경기장 가서\n보고 싶을 때`}
            selected={type === 'LIVE'}
            onPress={() => {
              setType('LIVE');
            }}
          />
        </View>

        <BasicTextInput
          label="제목"
          placeholder="모집글의 제목을 입력해주세요"
        />
        <BasicTextInput
          label="설명"
          multiline={true}
          height={100}
          placeholder="어떤 사람과 가고 싶은지 구체적으로 설명해 주세요"
        />
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-3">
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
                  <View className="w-5 h-5 bg-white border border-gray-100 rounded-full shadow-sm shadow-slate-400" />
                );
              }}
              customLabel={AgeSliderLabel}
              selectedStyle={{backgroundColor: community.color}}
              unselectedStyle={{backgroundColor: '#eeeeee'}}
              onValuesChange={([first]) => {
                // setMinAge(first);
                // setMaxAge(second);
              }}
            />
          </View>
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-3">
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
                  <View className="w-5 h-5 bg-white border border-gray-100 rounded-full shadow-sm shadow-gray-400" />
                );
              }}
              customLabel={AgeSliderLabel}
              selectedStyle={{backgroundColor: community.color}}
              unselectedStyle={{backgroundColor: '#eeeeee'}}
              onValuesChange={([first, second]) => {
                // setMinAge(first);
                // setMaxAge(second);
              }}
            />
          </View>
        </View>
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-2">
            성별
          </CustomText>
          <View className="items-center flex-row pl-1 pb-2">
            <RadioButton
              title="성별 무관"
              selected={gender === 'ANY'}
              color={community.color}
              onPress={() => setGender('ANY')}
            />
            <View className="w-[10]" />
            <RadioButton
              title="남자"
              selected={gender === 'MALE'}
              color={community.color}
              onPress={() => setGender('MALE')}
            />
            <View className="w-[10]" />
            <RadioButton
              title="여자"
              selected={gender === 'FEMALE'}
              color={community.color}
              onPress={() => setGender('FEMALE')}
            />
          </View>
        </View>
        {type === 'BOOKING' && (
          <BasicTextInput
            label="위치"
            placeholder="선호하는 지역을 입력해주세요"
          />
        )}

        {type === 'LIVE' && (
          <View>
            <CustomText
              fontWeight="500"
              className="text-[15px] ml-[2] mt-5 mb-2">
              티켓 여부
            </CustomText>
            <View className="items-center flex-row pl-1 pb-2">
              <RadioButton
                title="티켓 있음"
                selected={hasTicket}
                color={community.color}
                onPress={() => setHasTicket(true)}
              />
              <View className="w-[10]" />
              <RadioButton
                title="티켓 없음"
                selected={!hasTicket}
                color={community.color}
                onPress={() => setHasTicket(false)}
              />
            </View>
          </View>
        )}
      </AnimatedKeyboardAwareScrollView>
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
    </View>
  );
};

export default CreateMeetScreen;
