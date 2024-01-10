import {SafeAreaView, StyleSheet, Text} from 'react-native';

import CustomButton from '../components/CustomButton';

const SignUpComplete = ({navigation}) => {
  return (
    <SafeAreaView style={styles.signUpContainer}>
      <Text style={styles.signUpInfo}>회원가입이 완료되었습니다</Text>
      <CustomButton
        text={'Cheering  시작하기'}
        onPress={() => navigation.navigate('SignIn')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signUpInfo: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: '700',
  },
});

export default SignUpComplete;
