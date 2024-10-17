import {ActivityIndicator, Image, SafeAreaView} from 'react-native';
import React from 'react';
import LogoTitleSvg from '../../assets/images/logo-title.svg';

const SplashScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-black items-center">
      <LogoTitleSvg width={'90%'} height={'55%'} />
      <ActivityIndicator size="large" />
      <Image
        className="absolute bottom-[-50] w-full"
        source={require('../../assets/images/logo-graphic.png')}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
