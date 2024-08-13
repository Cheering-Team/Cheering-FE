import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {WINDOW_HEIGHT} from '../../../constants/dimension';

const ListLoading = () => {
  return (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.3 + 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default ListLoading;
