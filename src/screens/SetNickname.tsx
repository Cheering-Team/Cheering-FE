import React from 'react';
import BackClose from '../hooks/BackClose';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

const SetNickname = ({navigation}) => {
  const [nickname, setNickname] = React.useState('');

  BackClose(navigation);

  return (
    <SafeAreaView style={styles.signUpContainer}>
      <View style={styles.signUpForm}>
        <Text style={styles.signUpInfo}>닉네임을 설정해 주세요</Text>
        <View style={styles.pwInfoBox}>
          <Text style={styles.pwInfoText}>영문, 숫자, 특수문자가 포함된</Text>
          <Text style={styles.pwInfoText}>
            1~20자의 닉네임만 사용 가능 합니다.
          </Text>
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
      <CustomButton
        text={'다음'}
        onPress={() => navigation.navigate('SignUpComplete')}
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
  signUpForm: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  signUpInfo: {
    marginTop: 10,
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

export default SetNickname;
