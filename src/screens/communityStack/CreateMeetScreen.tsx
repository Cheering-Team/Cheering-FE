import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useRef, useState} from 'react';
import {Keyboard, Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {BottomSheetModal, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import AgeSliderLabel from './community/meetTab/components/AgeSliderLabel';
import RadioButton from 'components/common/RadioButton';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import CCHeader from 'components/common/CCHeader';
import BasicTextInput from 'components/common/BasicTextInput';
import {useCreateMeet} from 'apis/meet/useMeets';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showTopToast} from 'utils/toast';
import {useGetTwoWeeksMatches} from 'apis/match/useMatches';
import {formatDate} from 'utils/format';
import FastImage from 'react-native-fast-image';
import {MatchDetail} from 'apis/match/types';
import CloseSvg from 'assets/images/close-black.svg';
import MatchSelectModal from 'components/common/MatchSelectModal';
import DuplicateMatchModal from './community/meetTab/components/DuplicateMatchModal';
import OneButtonModal from 'components/common/OneButtonModal';
import LoadingOverlay from 'components/common/LoadingOverlay';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

const CreateMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'CreateMeet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const matchModalRef = useRef<BottomSheetModal>(null);

  const [type, setType] = useState<'BOOKING' | 'LIVE'>('BOOKING');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gender, setGender] = useState<'ANY' | 'MALE' | 'FEMALE'>('ANY');
  const [hasTicket, setHasTicket] = useState(true);
  const [max, setMax] = useState(2);
  const [ageMin, setAgeMin] = useState(13);
  const [ageMax, setAgeMax] = useState(45);
  const [place, setPlace] = useState<string>('');
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [isDuplicatedMatchModal, setIsDuplicatedMatchModal] = useState(false);
  const [isRestrictedMatchModal, setIsRestrictedMatchModal] = useState(false);

  const {data: matches} = useGetTwoWeeksMatches(community.id);
  const {mutateAsync: createMeet, isPending} = useCreateMeet();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleCreateMeet = async () => {
    if (title.trim().length === 0) {
      showTopToast({
        type: 'fail',
        message: '제목을 입력해 주세요',
      });
      return;
    }

    if (match === null) {
      showTopToast({
        type: 'fail',
        message: '관람할 경기를 선택해 주세요',
      });
      return;
    }

    if (type === 'BOOKING') {
      if (place.trim().length === 0) {
        showTopToast({
          type: 'fail',
          message: '선호하는 지역을 입력해 주세요',
        });
        return;
      }
    }

    try {
      const data = await createMeet({
        communityId: community.id,
        type,
        title,
        description,
        max,
        gender,
        ageMin,
        ageMax,
        place,
        hasTicket: type === 'BOOKING' ? null : hasTicket,
        matchId: match.id,
        communityType: community.type,
      });
      showTopToast({type: 'success', message: '모임을 생성하였습니다'});
      setTimeout(() => {
        navigation.replace('Meet', {
          meetId: data.id,
          communityId: community.id,
        });
      }, 0);
    } catch (error: any) {
      if (error.code === 2010) {
        setIsDuplicatedMatchModal(true);
        return;
      }
      if (error.code === 2013) {
        setIsRestrictedMatchModal(true);
        return;
      }
    }
  };

  return (
    <View className="flex-1">
      <CCHeader
        title="모임 만들기"
        secondType="COMPELETE"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
        onSecondPress={handleCreateMeet}
      />
      <AnimatedKeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: insets.top + 55 + 15,
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
        <View className="items-start">
          <View>
            <CustomText
              fontWeight="500"
              className="text-[15px] ml-[2] mt-5 mb-2">
              경기 선택
            </CustomText>
            <View className="w-[6] h-[6] rounded-full bg-rose-600 absolute top-5 right-[-7]" />
          </View>
          {match ? (
            <View className="flex-row items-center border border-gray-200 rounded-[6px] px-2 bg-white h-[32]">
              <FastImage
                source={{
                  uri:
                    community.koreanName === match.homeTeam.koreanName
                      ? match.awayTeam.image
                      : match.homeTeam.image,
                }}
                className="w-7 h-7"
              />
              <CustomText
                className="ml-1 text-[15px] text-gray-800"
                fontWeight="500">
                {formatDate(match.time)}
              </CustomText>
              <Pressable
                onPress={() => {
                  setMatch(null);
                }}
                className="bg-gray-200 p-[1] rounded-full ml-2">
                <CloseSvg width={16} height={16} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="px-2 rounded-[4px] flex-row items-center h-[32] bg-white border border-gray-200"
              onPress={() => {
                Keyboard.dismiss();
                matchModalRef.current?.present();
              }}>
              <CustomText className="text-[#000000]" fontWeight="400">
                경기 추가 +
              </CustomText>
            </Pressable>
          )}
        </View>

        <BasicTextInput
          label="제목"
          placeholder="모집글의 제목을 입력해주세요"
          value={title}
          onChangeText={setTitle}
          isRequired
        />
        <BasicTextInput
          label="설명"
          multiline={true}
          height={100}
          placeholder="어떤 사람과 가고 싶은지 구체적으로 설명해 주세요"
          value={description}
          onChangeText={setDescription}
        />
        <View>
          <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-3">
            최대인원
          </CustomText>
          <View className="items-center">
            <MultiSlider
              allowOverlap
              values={[max]}
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
                setMax(first);
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
              values={[ageMin, ageMax]}
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
                setAgeMin(first);
                setAgeMax(second);
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
            label="선호 지역"
            placeholder="선호하는 지역을 입력해주세요"
            value={place}
            onChangeText={setPlace}
            isRequired
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
      <MatchSelectModal
        matchModalRef={matchModalRef}
        matches={matches}
        community={community}
        onPress={(item: MatchDetail) => {
          setMatch(item);
        }}
      />
      {isDuplicatedMatchModal && (
        <DuplicateMatchModal
          match={match}
          setIsModalOpen={setIsDuplicatedMatchModal}
          community={community}
        />
      )}
      {isRestrictedMatchModal && (
        <OneButtonModal
          title="모임 생성 제한"
          content="해당 경기 시작 48시간전에 취소한 모임이 있기 때문에 해당 경기 모임을 생성할 수 없습니다."
          onButtonPress={() => setIsRestrictedMatchModal(false)}
        />
      )}
      {isPending && <LoadingOverlay type="LOADING" />}
    </View>
  );
};

export default CreateMeetScreen;
