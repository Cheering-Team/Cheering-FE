import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import React from 'react';
import CustomButton from '../components/CustomButton';
import {passwordRegex} from '../constants/regex';
import BackClose from '../hooks/BackClose';

const SetPassword = ({navigation}) => {
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
    if (pwValid && confirmValid) {
      navigation.navigate('SetNickname');
    }
  };

  return (
    <SafeAreaView style={styles.signUpContainer}>
      <View style={styles.signUpForm}>
        <Text style={styles.signUpInfo}>비밀번호를 설정해 주세요</Text>
        <View style={styles.pwInfoBox}>
          <Text style={styles.pwInfoText}>
            영문, 숫자, 특수문자가 반드시 포함된
          </Text>
          <Text style={styles.pwInfoText}>
            8~20자의 비밀번호만 사용 가능 합니다.
          </Text>
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
      </View>

      <CustomButton text={'다음'} onPress={passwordSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  signUpForm: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  signUpInfo: {
    marginTop: 17,
    fontSize: 25,
    fontWeight: '700',
  },
  pwInfoBox: {
    marginTop: 20,
    width: '90%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#ffe6ea',
  },
  pwInfoText: {
    color: '#626161',
    fontSize: 13,
  },
});

export default SetPassword;
