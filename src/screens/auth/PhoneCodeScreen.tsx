import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import BackClose from '../../hooks/BackClose';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import React, {useContext, useEffect, useState} from 'react';
import CustomButton from '../../components/CustomButton';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMutation} from '@tanstack/react-query';
import {postPhoneCode, postPhoneSMS, postSignin} from '../../apis/user';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../navigations/AuthSwitch';

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
          bottomOffset: 30,
          text1: '인증번호가 만료되었습니다.',
          text2: '다시시도 해주세요.',
        });
        navigation.goBack();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [limitTime, navigation]);

  const handleCodeSubmitToSignIn = async () => {
    try {
      const data = await signinMutation.mutateAsync({phone, code});
      if (data.message === '로그인에 성공하였습니다.') {
        const {accessToken, refreshToken} = data.result;

        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          bottomOffset: 30,
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
          bottomOffset: 30,
          text1: '인증번호가 만료되었습니다.',
          text2: '다시시도 해주세요.',
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
          bottomOffset: 30,
          text1: '인증번호가 만료되었습니다.',
          text2: '다시시도 해주세요.',
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
          bottomOffset: 30,
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
        <CustomText fontWeight="400" style={styles.signInInfo}>
          바로 서비스 이용이 가능합니다.
        </CustomText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <CustomTextInput
              value={code}
              valid={codeValid}
              invalidMessage="인증번호가 일치하지 않습니다."
              onChangeText={e => {
                setCode(e);
                setCodeValid(true);
              }}
              placeholder="인증번호"
              maxLength={6}
              curLength={code.length}
              keyboardType="number-pad"
            />
          </View>

          <CustomText
            fontWeight="400"
            style={{
              color: '#ff5252',
              fontSize: 16,
              marginBottom: 10,
              marginLeft: 15,
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
              marginBottom: 10,
            }}
            disabled={sendMutation.isPending}
            onPress={handleReSend}>
            <CustomText style={{fontSize: 14}}>다시 받기</CustomText>
          </Pressable>
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
