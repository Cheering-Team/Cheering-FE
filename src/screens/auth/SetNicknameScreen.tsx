import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Close from '../../hooks/Close';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {NAME_REGEX} from '../../constants/regex';
import {AuthContext} from '../../navigations/AuthSwitch';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {useSignUp} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';

type SetNicknameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SetNickname'
>;

type SetNicknameScreenRouteProp = RouteProp<AuthStackParamList, 'SetNickname'>;

const SetNickNameScreen = ({
  route,
  navigation,
}: {
  route: SetNicknameScreenRouteProp;
  navigation: SetNicknameScreenNavigationProp;
}) => {
  Close(navigation);
  const signIn = useContext(AuthContext)?.signIn;

  const {phone} = route.params;

  const [nickname, setNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(true);

  const {mutateAsync: signUp} = useSignUp();

  const handleSignUp = async () => {
    if (!NAME_REGEX.test(nickname)) {
      setNicknameValid(false);
      return;
    }
    const {accessToken, refreshToken} = await signUp({phone, name: nickname});
    showTopToast({message: '회원가입 완료'});
    signIn?.(accessToken, refreshToken);
    return;
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={-200}
        className="flex-1 p-5">
        <CustomText fontWeight="600" className="mt-5 mb-1 text-[22px]">
          대표 닉네임을 설정해주세요.
        </CustomText>

        <CustomText fontWeight="400" className="text-[17px] text-gray-500 mb-1">
          설정한 후에도 언제든지 변경 가능합니다.
        </CustomText>

        <CustomTextInput
          label="대표 닉네임"
          value={nickname}
          isValid={nicknameValid}
          maxLength={20}
          curLength={nickname.length}
          length={true}
          inValidMessage="2자~20자, 한글 영어 숫자 . _ 만 사용 가능합니다."
          onChangeText={e => {
            setNickname(e);
            setNicknameValid(true);
          }}
          containerStyle={'mt-[10]'}
        />
        <CustomButton
          type="normal"
          text={'시작하기'}
          disabled={nickname.length < 2}
          onPress={handleSignUp}
          className="mt-[15]"
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SetNickNameScreen;
