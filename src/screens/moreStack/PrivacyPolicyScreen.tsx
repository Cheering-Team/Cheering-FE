import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React from 'react';
import {SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';
import StackHeader from 'components/common/StackHeader';

const PrivacyPolicyScreen = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1">
      <StackHeader type="back" />
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
