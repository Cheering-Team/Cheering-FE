import {SafeAreaView, StyleSheet, Text} from 'react-native';
import * as React from 'react';
import {emailRegex} from '../constants/regex';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Close from '../hooks/Close';

function SignInScreen({navigation}) {
  const [email, setEmail] = React.useState('');

  const [emailValid, setEmailValid] = React.useState(true);

  // const authContext = React.useContext(AuthContext);

  Close(navigation);

  const emailSubmit = () => {
    if (!emailRegex.test(email)) {
      setEmailValid(false);
    } else {
      // 이메일 중복 확인 요청 !
      navigation.navigate('SetPassword');
    }
  };

  return (
    <SafeAreaView style={styles.signInEmailContainer}>
      <Text style={styles.signInInfo}>로그인 또는 회원가입 해주세요</Text>
      <CustomTextInput
        label="이메일"
        valid={emailValid}
        placeholder="example@email.com"
        value={email}
        invalidMessage="올바르지 않은 이메일 형식입니다."
        onChangeText={e => {
          setEmail(e);
          setEmailValid(true);
        }}
      />
      <CustomButton text="이메일로 계속하기" onPress={emailSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    fontSize: 20,
    fontWeight: '400',
  },
  signInEmailContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  signInInfo: {
    marginTop: 25,
    fontSize: 27,
    fontWeight: '600',
  },
});

export default SignInScreen;
