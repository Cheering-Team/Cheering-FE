import React from 'react';
import BackClose from '../hooks/BackClose';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigations/AuthSwitch';
import {RouteProp} from '@react-navigation/native';
import {postSignup} from '../apis/user';
import CustomText from '../components/CustomText';
import Toast from 'react-native-toast-message';

type SetNicknameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SetNickname'
>;

type SetNicknameScreenRouteProp = RouteProp<AuthStackParamList, 'SetNickname'>;

const SetNickname = ({
  route,
  navigation,
}: {
  route: SetNicknameScreenRouteProp;
  navigation: SetNicknameScreenNavigationProp;
}) => {
  const [nickname, setNickname] = React.useState('');

  BackClose(navigation);

  const signup = async () => {
    if (nickname.length === 0) {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '닉네임을 입력해주세요',
      });
    } else {
      const response = await postSignup({
        email: route.params.email,
        nickName: nickname,
        password: route.params.pw,
        passwordConfirm: route.params.pwConfirm,
      });

      if (response?.data.message === 'signup success') {
        navigation.navigate('SignUpComplete', {
          access: response?.headers['access-token'],
          refresh: response?.headers['refresh-token'],
        });
      } else {
        //
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <View style={{flex: 1, padding: 20, alignItems: 'center'}}>
        <CustomText fontWeight="600" style={styles.signUpInfo}>
          닉네임을 설정해 주세요
        </CustomText>
        <View style={styles.pwInfoBox}>
          <CustomText style={styles.pwInfoText}>
            영문, 숫자, 특수문자가 포함된
          </CustomText>
          <CustomText style={styles.pwInfoText}>
            1~20자의 닉네임만 사용 가능 합니다.
          </CustomText>
        </View>
        <CustomTextInput
          label="새 닉네임"
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
          invalidMessage="닉네임 형식을 확인해주세요."
        />
      </View>

      <CustomButton text={'다음'} onPress={signup} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
  },
  signUpInfo: {
    fontSize: 27,
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

export default SetNickname;
