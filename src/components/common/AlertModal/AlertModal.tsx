import React from 'react';
import {Modal, Pressable, View} from 'react-native';
import CustomText from '../CustomText';

interface AlertModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  title?: string;
  content?: string;
  button1Text: string;
  button1Color?: string;
  button2Text?: string;
  button2Color?: string;
  button1Press: any;
  button2Press?: any;
}

const AlertModal = (props: AlertModalProps) => {
  const {
    isModalOpen,
    setIsModalOpen,
    title,
    content,
    button1Text,
    button1Color,
    button2Text,
    button2Color,
    button1Press,
    button2Press,
  } = props;

  return (
    <Modal animationType="fade" transparent={true} visible={isModalOpen}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '65%',
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {title && (
              <CustomText
                fontWeight="600"
                style={{marginBottom: 10, fontSize: 16}}>
                {title}
              </CustomText>
            )}
            {content && (
              <CustomText
                style={{color: '#757575', fontSize: 14, textAlign: 'center'}}>
                {content}
              </CustomText>
            )}
          </View>
          <Pressable
            style={{
              alignItems: 'center',
              paddingVertical: 13,
              borderTopWidth: 1,
              borderColor: '#eeeeee',
            }}
            onPress={() => {
              setIsModalOpen(false);
              button1Press();
            }}>
            <CustomText fontWeight="500" style={[{color: button1Color}]}>
              {button1Text}
            </CustomText>
          </Pressable>
          {button2Text && (
            <Pressable
              style={{
                alignItems: 'center',
                paddingVertical: 13,
                borderTopWidth: 1,
                borderColor: '#eeeeee',
              }}
              onPress={() => {
                setIsModalOpen(false);
                button2Press?.();
              }}>
              <CustomText fontWeight="500" style={[{color: button2Color}]}>
                {button2Text}
              </CustomText>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
