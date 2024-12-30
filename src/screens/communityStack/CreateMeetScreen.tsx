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
import RangeSlider from 'react-native-range-slider';

const CreateMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'CreateMeet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<'LIVE' | 'BOOK'>('BOOK');

  return (
    <SafeAreaView className="flex-1">
      <View
        className="pl-[6] pr-[10] flex-row justify-between items-center bg-white z-50 border-b border-gray-100"
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
        contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 12}}>
        <View>
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
        <View className="mt-3">
          <CustomText>제목</CustomText>
          <TextInput placeholder="모집글의 제목을 입력해주세요" />
        </View>
        <View className="mt-3">
          <CustomText>설명</CustomText>
          <TextInput placeholder="어떤 사람과 가고 싶은지 구체적으로 설명해 주세요" />
        </View>
        <View className="mt-3">
          <CustomText>최대인원</CustomText>
          <RangeSlider
            minValue={0}
            maxValue={100}
            tintColor={'#da0f22'}
            handleBorderWidth={1}
            handleBorderColor="#454d55"
            selectedMinimum={20}
            selectedMaximum={40}
            style={{flex: 1, height: 70, padding: 10, backgroundColor: '#ddd'}}
            onChange={data => {
              console.log(data);
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateMeetScreen;
