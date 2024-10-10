import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useRef, useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {login} from '@react-native-seoul/kakao-login';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NaverLogin from '@react-native-seoul/naver-login';
import {AuthStackParamList} from 'navigations/AuthStackNavigator';
import Close from 'hooks/Close';
import CustomText from 'components/common/CustomText';
import KakaoSvg from '../../../assets/images/kakao.svg';
import NaverSvg from '../../../assets/images/naver.svg';
import AppleSvg from '../../../assets/images/apple.svg';
import {AuthContext} from 'navigations/AuthSwitch';
import {
  useAppleSignIn,
  useKakaoSignIn,
  useNaverSignIn,
} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';
import PhoneVerify from 'components/auth/phoneVerify';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import SignOutScreen from 'screens/moreStack/SignOutScreen';

export type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

const SignInScreen = ({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}): JSX.Element => {
  Close(navigation);
  const insets = useSafeAreaInsets();
  const signIn = useContext(AuthContext)?.signIn;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState<string>('');

  const {mutateAsync: kakaoSignIn} = useKakaoSignIn();
  const {mutateAsync: naverSignIn} = useNaverSignIn();
  const {mutateAsync: appleSignIn} = useAppleSignIn();

  const handleKakaoSignIn = async (): Promise<void> => {
    const token = await login();
    const data = await kakaoSignIn({
      accessToken: token.accessToken,
    });

    if (data.message === '카카오 회원가입이 필요합니다.') {
      setStatus('phone');
      setPhone('');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      navigation.navigate('AgreeTerm', {
        accessToken: token.accessToken,
        type: 'kakao',
      });
      return;
    }
    if (data.message === '로그인되었습니다.' && data.result) {
      const {accessToken, refreshToken} = data.result;
      showTopToast(insets.bottom + 20, data.message);
      signIn?.(accessToken, refreshToken);
      return;
    }
  };

  const handleNaverSignIn = async (): Promise<void> => {
    const token = await NaverLogin.login();

    if (token.isSuccess && token.successResponse) {
      const data = await naverSignIn({
        accessToken: token.successResponse.accessToken,
      });
      if (data.message === '네이버 회원가입이 필요합니다.') {
        setStatus('phone');
        setPhone('');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        navigation.navigate('AgreeTerm', {
          accessToken: token.successResponse.accessToken,
          type: 'naver',
        });
        return;
      }
      if (data.message === '로그인되었습니다.' && data.result) {
        const {accessToken, refreshToken} = data.result;
        showTopToast(insets.bottom + 20, data.message);
        signIn?.(accessToken, refreshToken);
        return;
      }
    }
  };

  const handleAppleSignIn = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME],
    });

    if (appleAuthRequestResponse.identityToken) {
      const data = await appleSignIn({
        accessToken: appleAuthRequestResponse.identityToken,
        name: `${appleAuthRequestResponse.fullName?.familyName}${appleAuthRequestResponse.fullName?.givenName}`,
      });
      if (data.message === '애플 회원가입이 필요합니다.') {
        setStatus('phone');
        setPhone('');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        navigation.navigate('AgreeTerm', {
          accessToken: appleAuthRequestResponse.identityToken,
          type: 'apple',
        });
        return;
      }
      if (data.message === '로그인되었습니다.' && data.result) {
        const {accessToken, refreshToken} = data.result;
        showTopToast(insets.bottom + 20, data.message);
        signIn?.(accessToken, refreshToken);
        return;
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={-200}
      keyboardShouldPersistTaps="handled"
      className="p-5 flex-1">
      <CustomText fontWeight="600" className="mt-[15] mb-[18] text-2xl ml-[3]">
        휴대폰 번호로 시작하기
      </CustomText>

      <PhoneVerify
        status={status}
        setStatus={setStatus}
        phone={phone}
        setPhone={setPhone}
        timerRef={timerRef}
        signIn={signIn}
      />
      <View className="flex-row items-center my-9">
        <View className="h-[1] bg-gray-300 flex-1" />
        <CustomText className="mx-[10] text-gray-600">혹은</CustomText>
        <View className="h-[1] bg-gray-300 flex-1" />
      </View>
      <Pressable
        className="flex-row items-center bg-[#FEE500] py-3 px-4 rounded"
        onPress={handleKakaoSignIn}>
        <KakaoSvg width={17} height={17} />
        <CustomText
          fontWeight="500"
          className="text-[17px] text-center flex-1 text-black/[0.85]">
          카카오로 계속하기
        </CustomText>
      </Pressable>
      <Pressable
        className="flex-row items-center bg-[#03c75a] py-3 px-4 rounded mt-5"
        onPress={handleNaverSignIn}>
        <NaverSvg width={17} height={17} />
        <CustomText
          fontWeight="500"
          className="text-[17px] text-center flex-1 text-white">
          네이버로 계속하기
        </CustomText>
      </Pressable>
      <Pressable
        className="flex-row items-center bg-white py-[11] px-3 rounded mt-5 border-black border"
        onPress={handleAppleSignIn}>
        <AppleSvg width={21} height={21} />
        <CustomText
          fontWeight="500"
          className="text-[17px] text-center flex-1 text-black">
          Apple로 계속하기
        </CustomText>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default SignInScreen;
