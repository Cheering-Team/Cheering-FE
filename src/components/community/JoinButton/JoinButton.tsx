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
        bottom: insets.bottom + 65,
      }}>
      <BlurView
        blurType="xlight"
        style={{
          paddingVertical: 12,
          paddingHorizontal: 22,
        }}>
        <CustomText fontWeight="600" style={{color: 'white', fontSize: 17}}>
          커뮤니티 가입하기
        </CustomText>
      </BlurView>
    </View>
  );
};

export default JoinButton;
