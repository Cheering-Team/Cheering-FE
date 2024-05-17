import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {PHONE_REGEX} from '../../constants/regex';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Close from '../../hooks/Close';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from '../../components/CustomText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useEffect, useState} from 'react';
import React from 'react';
import {AuthStackParamList} from '../../navigations/AuthStack';
import {postPhoneSMS} from '../../apis/user';
import {useMutation} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

function SignInScreen({navigation}: {navigation: SignInScreenNavigationProp}) {
  Close(navigation);

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState<'empty' | 'valid' | 'invalid'>(
    'empty',
  );

  // const signIn = useContext(AuthContext)?.signIn;

  const mutation = useMutation({mutationFn: postPhoneSMS});

  useEffect(() => {
    if (phone.length === 0) {
      setPhoneValid('empty');
    } else if (!PHONE_REGEX.test(phone)) {
      setPhoneValid('invalid');
    } else {
      setPhoneValid('valid');
    }
  }, [phone]);

  const phoneSubmit = async () => {
    if (!PHONE_REGEX.test(phone)) {
      setPhoneValid('valid');
    } else {
      try {
        const data = await mutation.mutateAsync({phone});
        if (data.message === '인증번호가 전송되었습니다.') {
          const user = data.result;
          Toast.show({
            type: 'default',
            position: 'top',
            visibilityTime: 3000,
            bottomOffset: 30,
            text1: '인증번호가 전송되었습니다.',
          });
          navigation.navigate('PhoneCode', {user, phone});
        }
      } catch (error) {}
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
          휴대폰 번호로 바로 시작할 수 있어요.
        </CustomText>

        <CustomText fontWeight="400" style={styles.signInInfo}>
          '-' 없이 숫자만 입력해주세요.
        </CustomText>

        <CustomTextInput
          placeholder="휴대폰 번호"
          value={phone}
          valid={phoneValid !== 'invalid'}
          invalidMessage="휴대폰 번호를 다시 확인해주세요"
          onChangeText={e => {
            setPhone(e);
          }}
        />
      </KeyboardAwareScrollView>
      <CustomButton
        disabled={phoneValid !== 'valid'}
        text={'시작하기'}
        onPress={phoneSubmit}
        isLoading={mutation.isPending}
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
  codeTitle: {
    color: 'green',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 21,
  },
  signInInfo: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 5,
  },
});

export default SignInScreen;
