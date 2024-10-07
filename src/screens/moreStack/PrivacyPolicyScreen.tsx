import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import WebView from 'react-native-webview';
import BackSvg from '../../../assets/images/chevron-left.svg';

const PrivacyPolicyScreen = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1">
      <View className="h-[48] px-[5] flex-row items-center bg-white border-b border-b-[#eeeeee]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>
      </View>
      <WebView
        style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT}}
        source={{
          uri: 'https://shadow-seashore-79d.notion.site/1184837d2d2d800eb5a0dfdbbb78ed9e?pvs=4',
        }}
      />
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
