import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import * as React from 'react';
import {emailRegex} from '../constants/regex';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Close from '../hooks/Close';
import {postEmail, postSignin} from '../apis/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthContext, AuthStackParamList} from '../navigations/AuthSwitch';
import CustomText from '../components/CustomText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

function SignInScreen({navigation}: {navigation: SignInScreenNavigationProp}) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [canLogin, setCanLogin] = React.useState(false);

  const [emailValid, setEmailValid] = React.useState(true);

  const signIn = React.useContext(AuthContext)?.signIn;

  Close(navigation);

  const emailSubmit = async () => {
    if (!emailRegex.test(email)) {
      setEmailValid(false);
    } else {
      const response = await postEmail({email});

      if (response?.data.message === 'not duplicated') {
        navigation.navigate('SetPassword', {email});
      } else {
        setCanLogin(true);
      }
    }
  };

  const emailSignin = async () => {
    const response = await postSignin({email, password: pw});

    if (response?.data.message === 'login success') {
      signIn?.(
        response?.headers['access-token'],
        response?.headers['refresh-token'],
      );
    } else {
      Alert.alert('이메일과 비밀번호를 확인해주세요');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={-200}
        style={{flex: 1, padding: 20}}
        contentContainerStyle={{alignItems: 'center'}}>
        <CustomText fontWeight="600" style={styles.signInInfo}>
          {canLogin ? '로그인 해주세요' : '로그인 또는 회원가입 해주세요'}
        </CustomText>

        <CustomTextInput
          label="이메일"
          valid={emailValid}
          placeholder="example@email.com"
          value={email}
          invalidMessage="올바르지 않은 이메일 형식입니다."
          onChangeText={e => {
            setEmail(e);
            setEmailValid(true);
            setCanLogin(false);
          }}
        />

        {canLogin && (
          <CustomTextInput
            label="비밀번호"
            placeholder="********"
            value={pw}
            secureTextEntry={true}
            invalidMessage="올바르지 않은 이메일 형식입니다."
            onChangeText={setPw}
            autoFocus
          />
        )}
      </KeyboardAwareScrollView>
      <CustomButton
        text={!canLogin ? '이메일로 계속하기' : '로그인'}
        onPress={!canLogin ? emailSubmit : emailSignin}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  signInInfo: {
    fontSize: 26,
    paddingBottom: 15,
  },
});

export default SignInScreen;
