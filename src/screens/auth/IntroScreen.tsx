import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';

type IntroScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Intro'
>;

const IntroScreen = ({navigation}: {navigation: IntroScreenNavigationProp}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.main,
        {paddingTop: insets.top + 20, paddingBottom: insets.bottom + 15},
      ]}>
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
        type="normal"
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
    paddingHorizontal: 15,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 32,
  },
});

export default IntroScreen;
