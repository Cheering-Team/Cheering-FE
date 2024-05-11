import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/CustomTextInput';
import React from 'react';
import CustomButton from '../components/CustomButton';
import {passwordRegex} from '../constants/regex';
import BackClose from '../hooks/BackClose';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigations/AuthSwitch';
import {RouteProp} from '@react-navigation/native';
import CustomText from '../components/CustomText';
import Toast from 'react-native-toast-message';

type SetPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SetPassword'
>;

type SetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'SetPassword'>;

const SetPassword = ({
  route,
  navigation,
}: {
  route: SetPasswordScreenRouteProp;
  navigation: SetPasswordScreenNavigationProp;
}) => {
  const [pw, setPw] = React.useState('');
  const [pwConfirm, setPwConfirm] = React.useState('');
  const [pwValid, setPwValid] = React.useState(true);
  const [confirmValid, setConfirmValid] = React.useState(true);

  BackClose(navigation);

  React.useEffect(() => {
    if (passwordRegex.test(pw) || pw.length === 0) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  }, [pw]);

  React.useEffect(() => {
    if (pw === pwConfirm || pwConfirm.length === 0) {
      setConfirmValid(true);
    } else {
      setConfirmValid(false);
    }
  }, [pw, pwConfirm]);

  const passwordSubmit = () => {
    if (pw.length === 0) {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '비밀번호를 입력해주세요',
      });
    } else if (pwConfirm.length === 0) {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '비밀번호 확인을 입력해주세요',
      });
    } else if (pwValid && confirmValid) {
      navigation.navigate('SetNickname', {
        email: route.params.email,
        pw,
        pwConfirm,
      });
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
        <CustomText>
          <CustomText fontWeight="700" style={styles.signUpInfoEmail}>
            {route.params.email}
          </CustomText>
        </CustomText>
        <CustomText fontWeight="600" style={styles.signUpInfo}>
          비밀번호를 설정해 주세요
        </CustomText>
        <View style={styles.pwInfoBox}>
          <CustomText fontWeight="500" style={styles.pwInfoText}>
            영문, 숫자, 특수문자가 반드시 포함된
          </CustomText>
          <CustomText fontWeight="400" style={styles.pwInfoText}>
            8~20자의 비밀번호만 사용 가능 합니다.
          </CustomText>
        </View>
        <CustomTextInput
          label="새 비밀번호"
          placeholder="비밀번호 입력"
          valid={pwValid}
          onChangeText={setPw}
          secureTextEntry={true}
          value={pw}
          invalidMessage="비밀번호 형식을 확인해주세요."
        />
        <CustomTextInput
          label="새 비밀번호 확인"
          placeholder="비밀번호 확인 입력"
          valid={confirmValid}
          onChangeText={setPwConfirm}
          value={pwConfirm}
          secureTextEntry={true}
          invalidMessage="비밀번호가 일치하지 않습니다."
        />
      </KeyboardAwareScrollView>

      <CustomButton text={'다음'} onPress={passwordSubmit} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signUpInfoEmail: {
    fontSize: 25,
    color: '#58a04b',
  },
  signUpInfo: {
    fontSize: 24,
  },
  pwInfoBox: {
    marginTop: 20,
    width: '100%',
    padding: 12,
    borderRadius: 7,
    backgroundColor: '#eff3ee',
  },
  pwInfoText: {
    color: '#727272',
    fontSize: 15,
  },
});

export default SetPassword;
