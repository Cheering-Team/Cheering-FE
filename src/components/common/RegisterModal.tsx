import React, {Dispatch, SetStateAction, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import CustomText from './CustomText';
import {useApplyCommunity} from 'apis/apply/useApplies';
import {useNavigation} from '@react-navigation/native';

interface RegisterModalProps {
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
}

const RegisterModal = ({setIsRegisterOpen}: RegisterModalProps) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'apply' | 'compelete'>('apply');
  const [content, setContent] = useState('');

  const {mutateAsync: applyCommunity, isPending} = useApplyCommunity();

  const handleApply = async () => {
    try {
      await applyCommunity({content});
      setStep('compelete');
    } catch (error: any) {
      //
    }
  };

  return (
    <Modal transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="w-full h-full bg-black/60 justify-center items-center">
        <Pressable
          className="bg-white p-4 pb-3 rounded-2xl w-[95%]"
          style={{
            shadowColor: '#000',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
          onPress={() => Keyboard.dismiss()}>
          {step === 'apply' && (
            <>
              <CustomText
                className="text-xl mb-3 ml-1 text-slate-700"
                fontWeight="700">
                등록하기
              </CustomText>
              <View className="p-2 mb-3 rounded-md bg-gray-200">
                <CustomText
                  numberOfLines={2}
                  fontWeight="500"
                  className="text-base text-slate-600">
                  등록하고 싶은 종목, 리그, 팀, 선수등을 알려주세요
                </CustomText>
                <CustomText
                  numberOfLines={2}
                  fontWeight="500"
                  className="text-base text-slate-600">
                  국적, 은퇴 여부, 종목, 성별 모두 무관하며
                </CustomText>
                <CustomText
                  numberOfLines={2}
                  fontWeight="500"
                  className="text-base text-slate-600">
                  형식없이 이름만 작성하셔도 좋습니다
                </CustomText>
              </View>

              <TextInput
                placeholder={'예시) 축구/EPL/토트넘/손흥민\n예시) 리버풀'}
                multiline
                value={content}
                onChangeText={setContent}
                className="px-2 py-1 border border-gray-300 h-[100] rounded-md text-base"
              />
              <CustomText className="text-gray-400 my-2" fontWeight="600">
                신청 횟수에는 제한이 없습니다.
              </CustomText>
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setIsRegisterOpen(false)}
                  className="h-[45] flex-1 items-center justify-center mr-1 rounded-xl bg-gray-200">
                  <CustomText
                    fontWeight="500"
                    className="text-[17px] text-gray-600">
                    취소
                  </CustomText>
                </Pressable>
                <Pressable
                  disabled={content.trim().length === 0 || isPending}
                  style={{
                    backgroundColor:
                      content.trim().length === 0 ? '#afafaf' : 'black',
                  }}
                  className="h-[45] flex-1 items-center justify-center ml-1 rounded-xl"
                  onPress={handleApply}>
                  {isPending ? (
                    <ActivityIndicator />
                  ) : (
                    <CustomText
                      className="text-white text-[17px]"
                      fontWeight="500">
                      등록
                    </CustomText>
                  )}
                </Pressable>
              </View>
            </>
          )}
          {step === 'compelete' && (
            <>
              <CustomText
                className="text-xl mb-3 text-slate-700"
                fontWeight="700">
                신청완료
              </CustomText>

              <CustomText
                numberOfLines={2}
                fontWeight="500"
                className="text-base text-slate-600">
                내용 확인 후, 하루 이내로 등록 완료됩니다
              </CustomText>
              <CustomText
                numberOfLines={2}
                fontWeight="500"
                className="text-base text-slate-600">
                {'신청 내역은 [더보기] > [커뮤니티 신청 내역]'}
              </CustomText>
              <CustomText
                numberOfLines={2}
                fontWeight="500"
                className="text-base text-slate-600">
                에서 확인 가능 합니다
              </CustomText>

              <View className="justify-between mt-4">
                <Pressable
                  onPress={() => {
                    setIsRegisterOpen(false);
                    navigation.navigate('MoreStack', {
                      screen: 'CommunityApplyList',
                    });
                  }}
                  className="items-center justify-center mb-[10] p-3 rounded-xl bg-gray-200">
                  <CustomText
                    fontWeight="500"
                    className="text-[17px] text-gray-600">
                    신청 내역 확인
                  </CustomText>
                </Pressable>
                <Pressable
                  disabled={content.trim().length === 0}
                  style={{
                    backgroundColor:
                      content.trim().length === 0 ? '#afafaf' : 'black',
                  }}
                  className="items-center justify-center p-3 rounded-xl"
                  onPress={() => setIsRegisterOpen(false)}>
                  <CustomText
                    className="text-white text-[17px]"
                    fontWeight="500">
                    완료
                  </CustomText>
                </Pressable>
              </View>
            </>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RegisterModal;
