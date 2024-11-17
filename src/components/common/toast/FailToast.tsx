import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {Platform, View} from 'react-native';
import {ToastConfigParams} from 'react-native-toast-message';
import CustomText from '../CustomText';
import XSvg from 'assets/images/x-white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FailToast = (params: ToastConfigParams<any>) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'ios') {
    return (
      <View
        style={{
          marginBottom: insets.bottom - 20,
          marginTop: insets.top - 20,
          overflow: 'hidden',
          width: '85%',
          height: 65,
          borderRadius: 10,
        }}>
        <BlurView
          blurType="dark"
          blurAmount={3}
          style={[
            {
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 10,
            },
          ]}>
          <View
            style={{
              padding: 1,
              backgroundColor: '#e90e5b',
              borderRadius: 999,
              marginLeft: 20,
              marginRight: 15,
            }}>
            <XSvg width={18} height={18} />
          </View>
          <CustomText
            fontWeight="500"
            style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 65,
            }}>
            {params.text1}
          </CustomText>
        </BlurView>
      </View>
    );
  } else {
    return (
      <View
        style={{
          marginBottom: insets.bottom - 20,
          marginTop: insets.top - 20,
          width: '85%',
          height: 60,
          borderRadius: 10,
          backgroundColor: 'rgba(78, 78, 78, 0.98)',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            padding: 3,
            backgroundColor: '#0ea5e9',
            borderRadius: 999,
            marginLeft: 20,
            marginRight: 15,
          }}>
          <XSvg width={13} height={13} />
        </View>
        <CustomText
          fontWeight="500"
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 60,
          }}>
          {params.text1}
        </CustomText>
      </View>
    );
  }
};

export default FailToast;
