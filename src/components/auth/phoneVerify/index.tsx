import {useNavigation} from '@react-navigation/native';
import {ApiResponse} from 'apis/types';
import {User} from 'apis/user/types';
import {
  useCheckCode,
  useCheckCodeSocial,
  useSendSMS,
  useSignIn,
} from 'apis/user/useUsers';
import {AxiosError} from 'axios';
import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/common/CustomText';
import CustomTextInput from 'components/common/CustomTextInput';
import {PHONE_REGEX} from 'constants/regex';

import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {LayoutAnimation, Pressable, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SignInScreenNavigationProp} from 'screens/auth/SignInScreen';
import {showTopToast} from 'utils/toast';

interface PhoneVerifyProps {
  status: 'phone' | 'code';
  setStatus: Dispatch<SetStateAction<'phone' | 'code'>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  timerRef: MutableRefObject<NodeJS.Timeout | null>;
  signIn: ((access: string, refresh: string) => void) | undefined;
  type?: 'default' | 'kakao' | 'naver' | 'apple';
  accessToken?: string;
}

const PhoneVerify = (props: PhoneVerifyProps) => {
  const {
    status,
    setStatus,
    phone,
    setPhone,
    timerRef,
    signIn,
    type = 'default',
    accessToken = '',
  } = props;
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const insets = useSafeAreaInsets();
  const customTextInputRef = useRef<TextInput>(null);

  const [phoneValid, setPhoneValid] = useState<'valid' | 'invalid'>('valid');
  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState(true);

  const [limitTime, setLimitTime] = useState(300);
  const [user, setUser] = useState<User | null>(null);

  const {mutateAsync: sendSMS, isPending} = useSendSMS();
  const {mutateAsync: checkCode} = useCheckCode();
  const {mutateAsync: signInApi} = useSignIn();
  const {mutateAsync: checkCodeSocial} = useCheckCodeSocial();

  const invalidCode = useCallback(
    (errorCode: number) => {
      if (errorCode === 2002) {
        showTopToast(insets.top + 20, '인증번호 만료');
        setStatus('phone');
      }
      if (errorCode === 2003) {
        setCodeValid(false);
        return;
      }
    },
    [insets.top, setStatus],
  );

  const handleSendCode = async (): Promise<void> => {
    try {
      const data = await sendSMS({phone});
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLimitTime(300);
      setStatus('code');
      setCode('');
      setCodeValid(true);
      setUser(data);
      showTopToast(insets.top + 20, '전송 완료');
      customTextInputRef.current?.focus();
    } catch (error: any) {
      if (error.code === 2001) {
        setPhoneValid('invalid');
      }
    }
  };

  const handleCheckCodeToSignUp = useCallback(async () => {
    try {
      await checkCode({phone, code});
      navigation.replace('AgreeTerm', {phone});
    } catch (error: any) {
      invalidCode(error.code);
    }
  }, [checkCode, code, invalidCode, navigation, phone]);

  const handleCheckCodeToSignIn = useCallback(async () => {
    try {
      const {accessToken: sessionToken, refreshToken} = await signInApi({
        phone,
        code,
      });
      showTopToast(insets.top + 20, '로그인 완료');
      signIn?.(sessionToken, refreshToken);
    } catch (error: any) {
      invalidCode(error.code);
    }
  }, [code, insets.top, invalidCode, phone, signIn, signInApi]);

  const handleCheckCodeSocial = useCallback(async () => {
    if (type === 'kakao' || type === 'naver' || type === 'apple') {
      try {
        const data = await checkCodeSocial({
          accessToken,
          phone,
          code,
          type,
        });
        if (data.message === '존재하는 유저' && 'id' in data.result) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          navigation.replace('SocialConnect', {
            accessToken,
            user: data.result,
            type,
          });
        }
        if (data.message === '회원가입 완료' && 'accessToken' in data.result) {
          const {accessToken: sessionToken, refreshToken} = data.result;
          showTopToast(insets.top + 20, data.message);
          signIn?.(sessionToken, refreshToken);
        }
      } catch (error: any) {
        invalidCode(error.code);
      }
    }
  }, [
    accessToken,
    checkCodeSocial,
    code,
    insets.top,
    invalidCode,
    navigation,
    phone,
    signIn,
    timerRef,
    type,
  ]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainedSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainedSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    if (code.length === 6) {
      if (type === 'kakao' || type === 'naver' || type === 'apple') {
        handleCheckCodeSocial();
      } else if (user) {
        handleCheckCodeToSignIn();
      } else {
        handleCheckCodeToSignUp();
      }
    }
  }, [
    code.length,
    handleCheckCodeSocial,
    handleCheckCodeToSignIn,
    handleCheckCodeToSignUp,
    type,
    user,
  ]);

  useEffect(() => {
    if (status === 'code') {
      timerRef.current = setInterval(() => {
        if (limitTime > 0) {
          setLimitTime(prev => prev - 1);
        } else {
          showTopToast(insets.top + 20, '인증번호가 만료되었습니다.');
          navigation.goBack();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [insets.top, limitTime, navigation, status, timerRef]);

  return (
    <>
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
        <View className="flex-row">
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
          <View className="absolute flex-row right-3 top-4 items-center z-10">
            <CustomText
              fontWeight="400"
              className="text-base mb-[3] text-rose-500">
              {formatTime(limitTime)}
            </CustomText>
            <Pressable
              className="border-gray-300 border px-2 py-[2] rounded-md ml-[10]"
              disabled={isPending}
              onPress={handleSendCode}>
              <CustomText className="text-sm">다시 받기</CustomText>
            </Pressable>
          </View>
        </View>
      )}
      {status === 'phone' && (
        <CustomButton
          type="normal"
          text={'시작하기'}
          onPress={handleSendCode}
          isLoading={isPending}
          className="mt-3"
        />
      )}
    </>
  );
};

export default PhoneVerify;
