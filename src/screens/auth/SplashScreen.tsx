import {ActivityIndicator, SafeAreaView} from 'react-native';
import React from 'react';
import LogoTitleSvg from '../../assets/images/logo-title.svg';
import FastImage from 'react-native-fast-image';

const SplashScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-black items-center">
      <LogoTitleSvg width={'90%'} height={'55%'} />
      <ActivityIndicator size="large" />
      <FastImage
        className="absolute bottom-[-50] w-full"
        source={require('../../assets/images/logo-graphic.png')}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
