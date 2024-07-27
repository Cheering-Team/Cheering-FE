import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import BackClose from '../../hooks/BackClose';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useContext, useEffect, useState} from 'react';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMutation} from '@tanstack/react-query';
import {postPhoneCode, postPhoneSMS, postSignin} from '../../apis/user';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../navigations/AuthSwitch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';

type PhoneCodeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SetPassword'
>;

type PhoneCodeScreenRouteProp = RouteProp<AuthStackParamList, 'PhoneCode'>;

const PhoneCodeScreen = ({
  route,
  navigation,
}: {
  route: PhoneCodeScreenRouteProp;
  navigation: PhoneCodeScreenNavigationProp;
}) => {
  BackClose(navigation);
  const signIn = useContext(AuthContext)?.signIn;
  const insets = useSafeAreaInsets();

  const {user, phone} = route.params;

  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState(true);
  const [limitTime, setLimitTime] = useState(300);

  const codeMutation = useMutation({mutationFn: postPhoneCode});
  const signinMutation = useMutation({mutationFn: postSignin});
  const sendMutation = useMutation({mutationFn: postPhoneSMS});

  useEffect(() => {
    const timer = setInterval(() => {
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

    return () => clearInterval(timer);
  }, [insets.top, limitTime, navigation]);

  const handleCodeSubmitToSignIn = async () => {
    try {
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
      }
    } catch (error: any) {
      if (error.message === '인증코드가 일치하지 않습니다.') {
        setCodeValid(false);
      } else if (error.message === '인증코드가 만료되었습니다.') {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '인증번호가 만료되었습니다.',
        });
        navigation.goBack();
      }
    }
  };

  const handleCodeSubmitToSignUp = async () => {
    try {
      const data = await codeMutation.mutateAsync({phone, code});
      if (data.message === '인증번호가 일치합니다.') {
        navigation.replace('SetNickname', {phone});
      }
    } catch (error: any) {
      if (error.message === '인증코드가 일치하지 않습니다.') {
        setCodeValid(false);
      } else if (error.message === '인증코드가 만료되었습니다.') {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '인증번호가 만료되었습니다.',
        });
        navigation.goBack();
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainedSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainedSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={-200}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1, padding: 20}}>
        {user ? (
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <CustomText fontWeight="700" style={styles.signInTitleNickname}>
              {user.nickname}
            </CustomText>
            <CustomText fontWeight="600" style={styles.signInTitle}>
              님! 오랜만이에요
            </CustomText>
          </View>
        ) : (
          <>
            <CustomText fontWeight="600" style={styles.signInTitle}>
              처음 방문 하셨네요!
            </CustomText>
          </>
        )}
        <CustomText fontWeight="400" style={styles.signInInfo}>
          문자로 받은 인증번호를 입력해주시면
        </CustomText>
        {user ? (
          <CustomText fontWeight="400" style={styles.signInInfo}>
            바로 로그인할게요
          </CustomText>
        ) : (
          <CustomText fontWeight="400" style={styles.signInInfo}>
            바로 가입할게요
          </CustomText>
        )}
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <CustomTextInput
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
      </KeyboardAwareScrollView>
      <CustomButton
        text={'인증완료'}
        disabled={code.length !== 6}
        isLoading={codeMutation.isPending}
        onPress={user ? handleCodeSubmitToSignIn : handleCodeSubmitToSignUp}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signInTitleNickname: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 23,
    color: '#58a04b',
  },
  signInTitle: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 21,
  },
  codeTitle: {
    color: 'green',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 21,
  },
  signInInfo: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 1,
  },
});

export default PhoneCodeScreen;
