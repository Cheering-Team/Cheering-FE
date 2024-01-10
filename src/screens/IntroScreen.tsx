import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';

const IntroScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>내 최애 운동선수와</Text>
        <Text style={styles.headerText}>소통하는 커뮤니티</Text>
      </View>
      <CustomButton
        text="시작하기"
        onPress={() => {
          navigation.navigate('SignIn');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerContainer: {
    marginTop: 30,
  },
  headerText: {
    fontSize: 27,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default IntroScreen;
