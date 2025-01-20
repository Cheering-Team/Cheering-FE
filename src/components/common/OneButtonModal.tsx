import React from 'react';
import {Modal, Pressable, View} from 'react-native';
import CustomText from './CustomText';

interface OneButtonModalProps {
  title: string;
  content?: string;
  buttonTitle?: string;
  onButtonPress: () => void;
}

const OneButtonModal = ({
  title,
  content,
  buttonTitle = '확인',
  onButtonPress,
}: OneButtonModalProps) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View className="w-full h-full bg-black/50 justify-center items-center">
        <View className="bg-white w-[80%] shadow-md px-6 pt-6 pb-4 rounded-2xl">
          <CustomText
            fontWeight="600"
            className="text-[18px] mb-3"
            numberOfLines={999}>
            {title}
          </CustomText>
          {content && (
            <CustomText
              className="text-gray-600 leading-5 text-[15px]"
              numberOfLines={999}>
              {content}
            </CustomText>
          )}
          <Pressable className="self-end mt-6" onPress={onButtonPress}>
            <CustomText fontWeight="500" className="text-gray-700">
              {buttonTitle}
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default OneButtonModal;
