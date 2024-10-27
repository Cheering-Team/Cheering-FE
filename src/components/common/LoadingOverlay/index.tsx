import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';

interface LoadingOverlayProps {
  isLoading: boolean;
  type: 'LOADING' | 'OVERLAY';
}

const LoadingOverlay = ({isLoading, type}: LoadingOverlayProps) => {
  return (
    <Modal transparent={true} visible={isLoading}>
      <View
        className="absolute top-0 left-0 bottom-0 right-0 items-center justify-center"
        style={type === 'LOADING' && {backgroundColor: 'rgba(0,0,0,0.1)'}}>
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
