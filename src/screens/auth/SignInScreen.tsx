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
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {postPhoneSMS} from '../../apis/user';
import {useMutation} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignIn'
>;

function SignInScreen({navigation}: {navigation: SignInScreenNavigationProp}) {
  Close(navigation);

  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState<'empty' | 'valid' | 'invalid'>(
    'empty',
  );

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
            topOffset: insets.top + 20,
            text1: '인증번호가 전송되었습니다.',
          });
          navigation.navigate('PhoneCode', {user, phone});
        }
      } catch (error) {}
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
        style={{flex: 1, padding: 20}}>
        <CustomText fontWeight="600" style={styles.signInTitle}>
          휴대폰 번호로 바로 시작하세요
        </CustomText>

        <CustomTextInput
          value={phone}
          label="휴대폰 번호"
          isValid={phoneValid !== 'invalid'}
          inValidMessage={'올바르지 않은 휴대폰 번호입니다.'}
          keyboardType="number-pad"
          maxLength={11}
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
    marginBottom: 14,
    fontSize: 22,
  },
  codeTitle: {
    color: 'green',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 21,
  },
});

export default SignInScreen;
