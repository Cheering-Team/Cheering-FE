import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import MaleSvg from 'assets/images/male-blue.svg';
import FemaleSvg from 'assets/images/female-red.svg';
import {Picker} from '@react-native-picker/picker';
import {useSetAgeAndGender} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';
import {toastConfig} from '../../../../../../App';
import Toast from 'react-native-toast-message';
import BasicTextInput from 'components/common/BasicTextInput';
import {NAME_REGEX} from 'constants/regex';

interface MeetProfileModalProps {
  communityId: number;
  initialStep: 'info' | 'profile';
  firstCallback: () => void;
  secondCallback: () => void;
}

const MeetProfileModal = ({
  communityId,
  initialStep = 'info',
  firstCallback,
  secondCallback,
}: MeetProfileModalProps) => {
  const [step, setStep] = useState<'info' | 'profile'>(initialStep);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | null>(null);
  const [age, setAge] = useState<number>(20);
  const [name, setName] = useState<string>('');

  const {mutateAsync: setAgeAndGender} = useSetAgeAndGender();

  const handleNextStep = () => {
    if (gender === null) {
      showTopToast({type: 'fail', message: '성별을 골라주세요'});
      return;
    }
    setStep('profile');
  };

  const handleSetProfile = async () => {
    if (name.length < 2 || name.length > 15) {
      showTopToast({
        type: 'fail',
        message: '이름은 2자~15자여야 합니다',
      });
      return;
    }
    if (!NAME_REGEX.test(name)) {
      showTopToast({
        type: 'fail',
        message: '한글 영어 숫자 . _ 만 사용 가능합니다',
      });
      return;
    }
    await setAgeAndGender({
      communityId,
      age: initialStep === 'info' ? age : null,
      gender: initialStep === 'info' ? gender : null,
      name,
      status: initialStep === 'info' ? 'NEITHER' : 'NULL_PROFILE',
    });
    showTopToast({type: 'success', message: '저장되었습니다'});
    setTimeout(() => {
      secondCallback();
    }, 500);
  };

  return (
    <Modal transparent={true}>
      <View className="w-full h-full bg-black/50 items-center justify-center">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className="bg-white w-[90%] rounded-2xl shadow-md pt-6 pb-4 px-6">
            <CustomText fontWeight="600" className="text-[18px] mb-3">
              {step === 'info' ? '기본정보 입력' : '모임프로필 설정'}
            </CustomText>
            {step === 'info' ? (
              <CustomText
                numberOfLines={3}
                className="text-gray-600 leading-5 text-[15px]">
                <CustomText className="text-black text-[15px]" fontWeight="600">
                  모임
                </CustomText>
                서비스는 실제 팬들과 만나 함께 응원할 수 있는 서비스로 간단한
                <CustomText className="text-black text-[15px]" fontWeight="600">
                  {` 정보 입력`}
                </CustomText>
                이 필요합니다
              </CustomText>
            ) : (
              <CustomText
                numberOfLines={3}
                className="text-gray-600 leading-5 text-[15px]">
                <CustomText className="text-black text-[15px]" fontWeight="600">
                  모임
                </CustomText>
                {`서비스에서 사용할 프로필을 설정해주세요\n이미지와 닉네임은 언제든 수정가능합니다`}
              </CustomText>
            )}
            {step === 'info' && (
              <CustomText
                numberOfLines={3}
                fontWeight="500"
                className="text-red-500 leading-5 text-[14px] mt-[2]">
                한번 저장한 후에는 수정할 수 없습니다
              </CustomText>
            )}
            {step === 'info' ? (
              <View>
                <CustomText
                  fontWeight="500"
                  className="text-[15px] ml-[2] mt-5 mb-2">
                  성별
                </CustomText>
                <View className="flex-row">
                  <Pressable
                    className="flex-1 bg-blue-50 mr-1 py-6 px-6 rounded-xl border-[1.5px]"
                    style={{
                      borderColor: gender === 'MALE' ? '#2563eb' : '#eff6ff',
                    }}
                    onPress={() => setGender('MALE')}>
                    <View className="w-[45] h-[45] bg-white mb-4 rounded-xl shadow-sm justify-center items-center">
                      <MaleSvg width={27} height={27} />
                    </View>
                    <CustomText
                      fontWeight="600"
                      className="text-[15px] ml-1 text-blue-600">
                      남자
                    </CustomText>
                  </Pressable>
                  <Pressable
                    className="flex-1 bg-red-50 ml-1 py-6 px-6 rounded-xl border-[1.5px]"
                    style={{
                      borderColor: gender === 'FEMALE' ? '#dc2626' : '#fef2f2',
                    }}
                    onPress={() => setGender('FEMALE')}>
                    <View className="w-[45] h-[45] bg-white mb-4 rounded-xl shadow-sm justify-center items-center">
                      <FemaleSvg width={27} height={27} />
                    </View>
                    <CustomText
                      fontWeight="600"
                      className="text-[15px] ml-1 text-red-600">
                      여자
                    </CustomText>
                  </Pressable>
                </View>
                <CustomText
                  fontWeight="500"
                  className="text-[15px] ml-[2] mt-5 mb-2">
                  나이
                </CustomText>
                <Picker
                  selectedValue={age}
                  onValueChange={itemValue => setAge(itemValue)}
                  style={{width: '100%'}}>
                  {Array.from({length: 45 - 14 + 1}, (_, i) => i + 14).map(
                    value => (
                      <Picker.Item
                        key={value}
                        label={`${value}`}
                        value={value}
                      />
                    ),
                  )}
                </Picker>
              </View>
            ) : (
              <>
                <BasicTextInput
                  label="이름 (최대 15자)"
                  placeholder="모임에서 사용할 이름을 입력해주세요"
                  value={name}
                  onChangeText={setName}
                />
              </>
            )}
            {step === 'info' ? (
              <View className="flex-row mt-2">
                <Pressable
                  className="flex-grow-[1] justify-center items-center mr-2"
                  onPress={firstCallback}>
                  <CustomText fontWeight="500" className="text-gray-700">
                    취소
                  </CustomText>
                </Pressable>
                <Pressable
                  className="flex-grow-[2] justify-center items-center py-3 rounded-xl ml-2"
                  style={{
                    backgroundColor: gender === null ? '#e0e4ea' : '#1e293b',
                  }}
                  onPress={handleNextStep}
                  disabled={gender === null}>
                  <CustomText
                    fontWeight="500"
                    style={{color: gender === null ? '#acacac' : 'white'}}>
                    다음
                  </CustomText>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row mt-4">
                {initialStep === 'info' ? (
                  <Pressable
                    className="flex-grow-[1] justify-center items-center mr-2"
                    onPress={() => {
                      setStep('info');
                      setName('');
                    }}>
                    <CustomText fontWeight="500" className="text-gray-700">
                      이전
                    </CustomText>
                  </Pressable>
                ) : (
                  <Pressable
                    className="flex-grow-[1] justify-center items-center mr-2"
                    onPress={() => {
                      firstCallback();
                    }}>
                    <CustomText fontWeight="500" className="text-gray-700">
                      취소
                    </CustomText>
                  </Pressable>
                )}

                <Pressable
                  className="flex-grow-[2] justify-center items-center py-3 rounded-xl ml-2"
                  style={{
                    backgroundColor: name.length < 2 ? '#e0e4ea' : '#1e293b',
                  }}
                  onPress={handleSetProfile}
                  disabled={name.length < 2}>
                  <CustomText
                    fontWeight="500"
                    style={{color: name.length < 2 ? '#acacac' : 'white'}}>
                    완료
                  </CustomText>
                </Pressable>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default MeetProfileModal;
