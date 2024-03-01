import {StyleSheet, View} from 'react-native';
import CustomButton from '../components/CustomButton';
import {AuthContext, AuthStackParamList} from '../navigations/AuthSwitch';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import CustomText from '../components/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SignUpCompleteScreenRouteProp = RouteProp<
  AuthStackParamList,
  'SignUpComplete'
>;

const SignUpComplete = ({route}: {route: SignUpCompleteScreenRouteProp}) => {
  const signIn = React.useContext(AuthContext)?.signIn;

  return (
    <View style={[{flex: 1}, {paddingTop: useSafeAreaInsets().top + 20}]}>
      <View style={styles.main}>
        <CustomText fontWeight="600" style={styles.signUpInfo}>
          회원가입이 완료되었습니다
        </CustomText>
      </View>
      <CustomButton
        text={'Cheering  시작하기'}
        onPress={() => signIn?.(route.params.access, route.params.refresh)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  signUpInfo: {
    fontSize: 30,
  },
});

export default SignUpComplete;
