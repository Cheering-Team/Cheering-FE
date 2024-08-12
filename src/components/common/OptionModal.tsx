import React, {forwardRef, useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  View,
} from 'react-native';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface OptionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  option1Text: string;
  option2Text?: string;
  option1color?: string;
  option2color?: string;
  option1Press: any;
  option2Press?: any;
}

export type closeModalHandle = {
  closeModal: () => void;
};

const OptionModal = forwardRef<closeModalHandle, OptionModalProps>(
  (props, ref) => {
    const {
      isModalOpen,
      setIsModalOpen,
      option1Text,
      option2Text = null,
      option1color = 'black',
      option2color = 'black',
      option1Press,
      option2Press,
    } = props;

    const insets = useSafeAreaInsets();
    const screenHeight = Dimensions.get('screen').height;
    const panY = useRef(new Animated.Value(screenHeight)).current;

    const translateY = panY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-1, 0, 1],
    });

    const resetBottomSheet = Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });

    const closeBottomSheet = Animated.timing(panY, {
      toValue: screenHeight,
      duration: 350,
      useNativeDriver: true,
    });

    const panResponders = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
          if (gestureState.dy > 0) {
            panY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (event, gestureState) => {
          if (gestureState.dy > 0 && gestureState.vy > 1.0) {
            closeModal();
          } else {
            resetBottomSheet.start();
          }
        },
      }),
    ).current;

    useEffect(() => {
      if (isModalOpen) {
        resetBottomSheet.start();
      }
    }, [isModalOpen, resetBottomSheet]);

    const closeModal = () => {
      closeBottomSheet.start(() => {
        setIsModalOpen(false);
      });
    };

    return (
      <Modal animationType="none" visible={isModalOpen} transparent={true}>
        {isModalOpen && (
          <Pressable
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            onPressOut={closeModal}
          />
        )}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            {transform: [{translateY}]},
          ]}>
          <View
            style={{
              height: 30,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: 'center',
              width: '100%',
            }}
            {...panResponders.panHandlers}>
            <View
              style={{
                backgroundColor: '#a2a2a2',
                width: 50,
                height: 6,
                marginTop: 13,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{padding: 17, paddingBottom: insets.bottom + 20}}>
            <Pressable
              style={{marginBottom: 20}}
              onPress={() => {
                closeModal();
                option1Press();
              }}>
              <CustomText
                fontWeight="500"
                style={{fontSize: 18, color: option1color}}>
                {option1Text}
              </CustomText>
            </Pressable>
            {option2Text !== null && (
              <Pressable
                onPress={() => {
                  closeModal();
                  option2Press();
                }}>
                <CustomText
                  fontWeight="500"
                  style={{fontSize: 18, color: option2color}}>
                  {option2Text}
                </CustomText>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Modal>
    );
  },
);

export default OptionModal;
