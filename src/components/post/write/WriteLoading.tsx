import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../constants/dimension';

const WriteLoading = () => {
  return (
    <View
      style={[
        {
          zIndex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.5)',
        },
        {
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
        },
      ]}>
      <View
        style={{
          width: 200,
          height: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.763)',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CustomText
          fontWeight="500"
          style={{color: 'white', fontSize: 16, marginBottom: 15}}>
          글을 등록하고 있어요
        </CustomText>
        <ActivityIndicator color={'white'} />
      </View>
    </View>
  );
};

export default WriteLoading;
