import {ActivityIndicator, Platform, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SplashScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white justify-center items-center"
      style={{paddingTop: Platform.OS === 'android' ? insets.top : undefined}}>
      <FastImage
        source={require('assets/images/splash.png')}
        className="w-full h-full"
        resizeMode="contain"
      />
      <View className="absolute bottom-[200]">
        <ActivityIndicator size={'small'} color={'#323232'} />
      </View>
    </View>
  );
};

export default SplashScreen;
