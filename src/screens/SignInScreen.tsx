import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {PHONE_REGEX} from '../constants/regex';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Close from '../hooks/Close';
import {postEmail, postSignin} from '../apis/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthContext, AuthStackParamList} from '../navigations/AuthSwitch';
import CustomText from '../components/CustomText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useContext, useState} from 'react';
import React from 'react';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

function SignInScreen({navigation}: {navigation: SignInScreenNavigationProp}) {
  const [phone, setPhone] = useState('');
  const [loginStatus, setLoginStatus] = useState<'phone' | 'code'>('phone');
  const [phoneValid, setPhoneValid] = useState(true);

  const signIn = useContext(AuthContext)?.signIn;

  Close(navigation);

  const phoneSubmit = async () => {
    if (!PHONE_REGEX.test(phone)) {
      setPhoneValid(false);
    } else {
      // const response = await postEmail({phone});
      // if (response?.data.message === 'not duplicated') {
      //   // navigation.navigate('SetPassword', {phone});
      // } else {
      //   setCanLogin(true);
      // }
    }
  };

  // const emailSignin = async () => {
  //   const response = await postSignin({email, password: pw});

  //   if (response?.data.message === 'login success') {
  //     signIn?.(
  //       response?.headers['access-token'],
  //       response?.headers['refresh-token'],
  //     );
  //   } else {
  //     Alert.alert('이메일과 비밀번호를 확인해주세요');
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={-200}
        style={{flex: 1, padding: 20}}>
        <CustomText fontWeight="600" style={styles.signInTitle}>
          {loginStatus
            ? '로그인 해주세요'
            : '휴대폰 번호로 바로 시작할 수 있어요.'}
        </CustomText>
        <CustomText fontWeight="400" style={styles.signInInfo}>
          '-' 없이 숫자만 입력해주세요.
        </CustomText>

        <CustomTextInput
          placeholder="휴대폰 번호"
          value={phone}
          valid={phoneValid}
          invalidMessage="휴대폰 번호를 다시 확인해주세요"
          onChangeText={e => {
            setPhone(e);
            setPhoneValid(true);
          }}
        />
      </KeyboardAwareScrollView>
      <CustomButton
        text={!loginStatus ? '시작하기' : '인증완료'}
        onPress={phoneSubmit}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  signInTitle: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 22,
  },
  signInInfo: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 5,
  },
});

export default SignInScreen;
