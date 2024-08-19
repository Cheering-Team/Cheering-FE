import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {PHONE_REGEX} from '../../constants/regex';
import Close from '../../hooks/Close';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useContext, useEffect, useRef, useState} from 'react';
import React from 'react';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {
  postPhoneCode,
  postPhoneSMS,
  postSignin,
  siginWithKakao,
  siginWithNaver,
} from '../../apis/user';
import {useMutation} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import {login} from '@react-native-seoul/kakao-login';
import KakaoSvg from '../../../assets/images/kakao.svg';
import NaverSvg from '../../../assets/images/naver.svg';
import GoogleSvg from '../../../assets/images/google.svg';
import {User} from '../../types/user';
import {AuthContext} from '../../navigations/AuthSwitch';
import NaverLogin from '@react-native-seoul/naver-login';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

function SignInScreen({navigation}: {navigation: SignInScreenNavigationProp}) {
  Close(navigation);

  const insets = useSafeAreaInsets();
  const signIn = useContext(AuthContext)?.signIn;

  const customTextInputRef = useRef<TextInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState<'valid' | 'invalid'>('valid');
  const [status, setStatus] = useState<'phone' | 'code'>('phone');

  const [user, setUser] = useState<User | null>(null);

  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState(true);
  const [limitTime, setLimitTime] = useState(300);

  const sendMutation = useMutation({mutationFn: postPhoneSMS});
  const kakaoMutation = useMutation({mutationFn: siginWithKakao});
  const naverMutation = useMutation({mutationFn: siginWithNaver});
  const signinMutation = useMutation({mutationFn: postSignin});
  const codeMutation = useMutation({mutationFn: postPhoneCode});

  const phoneSubmit = async () => {
    if (!PHONE_REGEX.test(phone)) {
      setPhoneValid('invalid');
    } else {
      const data = await sendMutation.mutateAsync({phone});
      if (data.message === '인증번호가 전송되었습니다.') {
        setLimitTime(300);
        setStatus('code');
        setUser(data.result);
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '인증번호가 전송되었습니다.',
        });
        customTextInputRef.current?.focus();
      }
    }
  };

  const handleReSend = async () => {
    try {
      const data = await sendMutation.mutateAsync({phone});
      if (data.message === '인증번호가 전송되었습니다.') {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '인증번호가 전송되었습니다.',
        });
        setLimitTime(300);
        setCode('');
        setCodeValid(true);
      }
    } catch (error) {}
  };

  const handleCodeSubmitToSignIn = async () => {
    const data = await signinMutation.mutateAsync({phone, code});
    if (data.message === '로그인에 성공하였습니다.') {
      const {accessToken, refreshToken} = data.result;

      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '로그인되었습니다.',
      });

      signIn?.(accessToken, refreshToken);
      return;
    }

    if (data.message === '인증코드가 일치하지 않습니다.') {
      setCodeValid(false);
      return;
    } else if (data.message === '인증코드가 만료되었습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '인증번호가 만료되었습니다.',
      });
      setStatus('phone');
      return;
    }
  };

  const handleCodeSubmitToSignUp = async () => {
    const data = await codeMutation.mutateAsync({phone, code});
    if (data.message === '인증번호가 일치합니다.') {
      navigation.replace('SetNickname', {phone});
    }

    if (data.message === '인증코드가 일치하지 않습니다.') {
      setCodeValid(false);
      return;
    } else if (data.message === '인증코드가 만료되었습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '인증번호가 만료되었습니다.',
      });
      setStatus('phone');
    }
  };

  const siginInWithKakao = async () => {
    try {
      const token = await login();

      const data = await kakaoMutation.mutateAsync({
        accessToken: token.accessToken,
      });

      if (data.message === '카카오 회원가입이 필요합니다.') {
        setStatus('phone');
        setPhone('');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        navigation.navigate('PhoneVerify', {accessToken: token.accessToken});
      } else if (data.message === '로그인되었습니다.') {
        const {accessToken, refreshToken} = data.result;

        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '로그인되었습니다.',
        });

        signIn?.(accessToken, refreshToken);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const siginInWithNaver = async () => {
    const token = await NaverLogin.login();

    if (token.isSuccess) {
      const data = await naverMutation.mutateAsync({
        accessToken: token.successResponse!.accessToken,
      });

      if (data.message === '이미 가입된 유저입니다.') {
        navigation.replace('SocialConnect', {
          accessToken: token.successResponse!.accessToken,
          user: data.result,
          type: 'naver',
        });
      } else if (data.message === '회원가입되었습니다.') {
        const {accessToken: sessionToken, refreshToken} = data.result;

        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '회원가입되었습니다.',
        });

        signIn?.(sessionToken, refreshToken);
        return;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainedSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainedSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    if (status === 'code') {
      timerRef.current = setInterval(() => {
        if (limitTime > 0) {
          setLimitTime(prev => prev - 1);
        } else {
          Toast.show({
            type: 'default',
            position: 'top',
            visibilityTime: 3000,
            topOffset: insets.top + 20,
            text1: '인증번호가 만료되었습니다.',
          });
          navigation.goBack();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [insets.top, limitTime, navigation, status]);

  useEffect(() => {
    if (code.length === 6) {
      if (user) {
        handleCodeSubmitToSignIn();
      } else {
        handleCodeSubmitToSignUp();
      }
    }
  }, [code.length]);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={-200}
      keyboardShouldPersistTaps="handled"
      style={{flex: 1, padding: 20}}>
      <CustomText fontWeight="600" style={styles.signInTitle}>
        휴대폰 번호로 시작하기
      </CustomText>

      <CustomTextInput
        value={phone}
        label="휴대폰 번호"
        isValid={phoneValid === 'valid'}
        inValidMessage={'올바르지 않은 휴대폰 번호입니다.'}
        keyboardType="number-pad"
        maxLength={11}
        onChangeText={e => {
          setPhoneValid('valid');
          setCodeValid(true);
          setStatus('phone');
          setCode('');
          setPhone(e);
        }}
      />
      {status === 'code' && (
        <View style={{flexDirection: 'row'}}>
          <CustomTextInput
            ref={customTextInputRef}
            value={code}
            label="인증번호 6자리"
            isValid={codeValid}
            inValidMessage="인증번호가 일치하지 않습니다."
            onChangeText={e => {
              setCode(e);
              setCodeValid(true);
            }}
            maxLength={6}
            keyboardType="number-pad"
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              right: 10,
              top: 17,
              alignItems: 'center',
              zIndex: 2,
            }}>
            <CustomText
              fontWeight="400"
              style={{
                color: '#ff5252',
                fontSize: 16,
                marginBottom: 3,
              }}>
              {formatTime(limitTime)}
            </CustomText>
            <Pressable
              style={{
                borderColor: '#b5b5b5',
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 5,
                marginLeft: 10,
              }}
              disabled={sendMutation.isPending}
              onPress={handleReSend}>
              <CustomText style={{fontSize: 14}}>다시 받기</CustomText>
            </Pressable>
          </View>
        </View>
      )}
      {status === 'phone' && (
        <CustomButton
          type="normal"
          text={'시작하기'}
          onPress={phoneSubmit}
          isLoading={sendMutation.isPending}
          style={{marginTop: 13}}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 35,
        }}>
        <View style={{height: 1, backgroundColor: '#bcbcbc', flex: 1}} />
        <CustomText style={{marginHorizontal: 10, color: '#484848'}}>
          혹은
        </CustomText>
        <View style={{height: 1, backgroundColor: '#bcbcbc', flex: 1}} />
      </View>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FEE500',
          paddingVertical: 13,
          paddingHorizontal: 17,
          borderRadius: 5,
        }}
        onPress={siginInWithKakao}>
        <KakaoSvg width={17} height={17} />
        <CustomText
          fontWeight="500"
          style={{
            fontSize: 17,
            textAlign: 'center',
            flex: 1,
            color: 'rgba(0,0,0,0.85)',
          }}>
          카카오로 시작하기
        </CustomText>
      </Pressable>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#03c75a',
          paddingVertical: 13,
          paddingHorizontal: 17,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={siginInWithNaver}>
        <NaverSvg width={17} height={17} />
        <CustomText
          fontWeight="500"
          style={{
            fontSize: 17,
            textAlign: 'center',
            flex: 1,
            color: 'white',
          }}>
          네이버로 시작하기
        </CustomText>
      </Pressable>
      {/* <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 13,
          paddingHorizontal: 17,
          borderRadius: 5,
          marginTop: 20,
          borderWidth: 0.5,
          borderColor: '#cccccc',
        }}>
        <GoogleSvg width={17} height={17} />
        <CustomText
          fontWeight="500"
          style={{
            fontSize: 17,
            textAlign: 'center',
            flex: 1,
            color: 'black',
          }}>
          구글로 시작하기
        </CustomText>
      </Pressable> */}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  signInTitle: {
    marginTop: 15,
    marginBottom: 18,
    fontSize: 23,
    marginLeft: 3,
  },
  signInTitleNickname: {
    marginTop: 15,
    marginBottom: 18,
    fontSize: 23,
    color: '#58a04b',
    marginLeft: 3,
  },
  codeTitle: {
    color: 'green',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 21,
  },
});

export default SignInScreen;
