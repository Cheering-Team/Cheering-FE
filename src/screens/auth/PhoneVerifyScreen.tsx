import React, {useContext, useEffect, useRef, useState} from 'react';
import BackClose from '../../hooks/BackClose';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomText from '../../components/common/CustomText';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import {useMutation} from '@tanstack/react-query';
import {postKakaoPhoneCode, postPhoneSMS} from '../../apis/user';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PHONE_REGEX} from '../../constants/regex';
import {AuthContext} from '../../navigations/AuthSwitch';

const PhoneVerifyScreen = ({navigation, route}) => {
  BackClose(navigation);
  const {accessToken} = route.params;

  const signIn = useContext(AuthContext)?.signIn;
  const insets = useSafeAreaInsets();

  const customTextInputRef = useRef<TextInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState<'valid' | 'invalid'>('valid');
  const [status, setStatus] = useState<'phone' | 'code'>('phone');

  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState(true);
  const [limitTime, setLimitTime] = useState(300);

  const sendMutation = useMutation({mutationFn: postPhoneSMS});
  const kakaoCodeMutation = useMutation({mutationFn: postKakaoPhoneCode});

  const phoneSubmit = async () => {
    if (!PHONE_REGEX.test(phone)) {
      setPhoneValid('invalid');
    } else {
      try {
        const data = await sendMutation.mutateAsync({phone});
        if (data.message === '인증번호가 전송되었습니다.') {
          setStatus('code');
          Toast.show({
            type: 'default',
            position: 'top',
            visibilityTime: 3000,
            topOffset: insets.top + 20,
            text1: '인증번호가 전송되었습니다.',
          });

          customTextInputRef.current?.focus();
        }
      } catch (error) {}
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

  const handleCodeSubmit = async () => {
    const data = await kakaoCodeMutation.mutateAsync({
      accessToken,
      phone,
      code,
    });

    if (data.message === '이미 가입된 유저입니다.') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      navigation.replace('SocialConnect', {accessToken, user: data.result});
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
      handleCodeSubmit();
    }
  }, [code]);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={-200}
      keyboardShouldPersistTaps="handled"
      style={{flex: 1, padding: 20}}>
      <View style={{marginTop: 5}}>
        <CustomText fontWeight="500" style={styles.signInTitle}>
          서비스 이용을 위해 최초 1회
        </CustomText>
        <CustomText fontWeight="500" style={styles.signInTitle}>
          휴대폰 인증이 필요합니다
        </CustomText>
      </View>

      <CustomTextInput
        value={phone}
        label="휴대폰 번호"
        isValid={phoneValid === 'valid'}
        inValidMessage={'올바르지 않은 휴대폰 번호입니다.'}
        keyboardType="number-pad"
        maxLength={11}
        onChangeText={e => {
          setPhoneValid('valid');
          setStatus('phone');
          setPhone(e);
        }}
        style={{marginTop: 20}}
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  signInTitle: {
    fontSize: 20,
    marginLeft: 3,
    color: '#000000',
  },
  signInTitleNickname: {
    marginTop: 15,
    marginBottom: 18,
    fontSize: 23,
    color: '#58a04b',
    marginLeft: 3,
  },
});

export default PhoneVerifyScreen;
