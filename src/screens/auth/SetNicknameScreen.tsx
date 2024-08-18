import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Close from '../../hooks/Close';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {postSignup} from '../../apis/user';
import {NICKNAME_REGEX} from '../../constants/regex';
import {AuthContext} from '../../navigations/AuthSwitch';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';

type SetNicknameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SetPassword'
>;

type SetNicknameScreenRouteProp = RouteProp<AuthStackParamList, 'SetNickname'>;

const SetNickNameScreen = ({
  route,
  navigation,
}: {
  route: SetNicknameScreenRouteProp;
  navigation: SetNicknameScreenNavigationProp;
}) => {
  Close(navigation);
  const signIn = useContext(AuthContext)?.signIn;
  const insets = useSafeAreaInsets();

  const {phone} = route.params;

  const [nickname, setNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(true);

  const mutation = useMutation({mutationFn: postSignup});

  const handleSignUp = async () => {
    if (!NICKNAME_REGEX.test(nickname)) {
      setNicknameValid(false);
      return;
    }
    try {
      const data = await mutation.mutateAsync({phone, nickname});
      if (data.message === '회원가입에 성공하였습니다.') {
        const {accessToken, refreshToken} = data.result;

        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '회원가입이 완료되었습니다.',
        });

        signIn?.(accessToken, refreshToken);
      }
    } catch (error: any) {}
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={62}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={-200}
        style={{flex: 1, padding: 20}}>
        <CustomText fontWeight="600" style={styles.signInTitle}>
          대표 닉네임을 설정해주세요.
        </CustomText>

        <CustomText fontWeight="400" style={styles.signInInfo}>
          설정한 후에도 언제든지 변경 가능합니다.
        </CustomText>

        <CustomTextInput
          label="대표 닉네임"
          value={nickname}
          isValid={nicknameValid}
          maxLength={20}
          curLength={nickname.length}
          length={true}
          inValidMessage="2자~20자, 한글과 영어만 사용 가능합니다."
          onChangeText={e => {
            setNickname(e);
            setNicknameValid(true);
          }}
          containerStyle={{marginTop: 10}}
        />
        <CustomButton
          type="normal"
          text={'시작하기'}
          disabled={nickname.length < 2}
          onPress={handleSignUp}
          style={{marginTop: 15}}
        />
      </KeyboardAwareScrollView>
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
