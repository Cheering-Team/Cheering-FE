import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';

interface LoadingOverlayProps {
  type: 'LOADING' | 'OVERLAY';
}

const LoadingOverlay = ({type}: LoadingOverlayProps) => {
  return (
    <Modal transparent>
      <View
        className="w-full h-full items-center justify-center"
        style={type === 'LOADING' && {backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
        {type === 'LOADING' && (
          <View className="p-5 bg-black/50 rounded-lg">
            <ActivityIndicator size={'small'} color={'#ffffff'} />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
