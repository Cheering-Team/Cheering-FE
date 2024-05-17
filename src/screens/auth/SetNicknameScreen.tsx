import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Close from '../../hooks/Close';

const SetNickNameScreen = ({navigation}) => {
  Close(navigation);

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
          invalidMessage="휴대폰 번호를 다시 확인해주세요"
          onChangeText={e => {}}
        />
      </KeyboardAwareScrollView>
      <CustomButton text={'시작하기'} />
    </KeyboardAvoidingView>
  );
};

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

export default SetNickNameScreen;
