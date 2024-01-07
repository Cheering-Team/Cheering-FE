import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackPramList} from '../types/navigators';

type IntroScreenProps = NativeStackScreenProps<StackPramList, 'Intro'>;

const IntroScreen = ({navigation}: IntroScreenProps) => {
  return (
    <SafeAreaView style={stlyes.main}>
      <View style={stlyes.headerContainer}>
        <Text style={stlyes.headerText}>내 최애 운동선수와</Text>
        <Text style={stlyes.headerText}>소통하는 커뮤니티</Text>
      </View>
      <Pressable
        style={stlyes.startBtn}
        onPress={() => {
          navigation.navigate('SignIn');
        }}>
        <Text style={stlyes.startBtnText}>시작하기</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const stlyes = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 30,
  },
  headerText: {
    fontSize: 27,
    textAlign: 'center',
    fontWeight: '700',
  },
  startBtn: {
    marginBottom: 40,
    backgroundColor: '#EF4365',
    borderRadius: 5,
    padding: 15,
    width: '85%',
  },
  startBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default IntroScreen;
