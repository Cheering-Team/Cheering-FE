import React from 'react';
import {View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

const JoinButton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        width: '100%',
        bottom: insets.bottom + 60,
        zIndex: 5,
      }}>
      <BlurView
        blurType="dark"
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 20,
        }}>
        <CustomText fontWeight="600" style={{color: 'white', fontSize: 17}}>
          커뮤니티 가입하기
        </CustomText>
      </BlurView>
    </View>
  );
};

export default JoinButton;
