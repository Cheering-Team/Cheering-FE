import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '../components/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigations/AuthSwitch';
import CustomText from '../components/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type IntroScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Intro'
>;

const IntroScreen = ({navigation}: {navigation: IntroScreenNavigationProp}) => {
  return (
    <View style={[styles.main, {paddingTop: useSafeAreaInsets().top + 20}]}>
      <View>
        <CustomText style={styles.headerText} fontWeight="600">
          언제 어디서든
        </CustomText>
        <CustomText style={styles.headerText} fontWeight="600">
          내 선수를 응원할 때
        </CustomText>
      </View>
      <CustomButton
        text="시작하기"
        onPress={() => {
          navigation.navigate('SignIn');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 35,
  },
});

export default IntroScreen;
