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
        <View className="bg-[#ffffff] w-[85%] py-5 px-6 rounded-3xl">
          <CustomText
            className="text-xl mb-[14] text-[#313A49]"
            numberOfLines={999}
            fontWeight="700">
            {title}
          </CustomText>
          {content && (
            <CustomText
              className="text-[15px] leading-[22px] text-gray-600"
              fontWeight="500"
              numberOfLines={999}>
              {content}
            </CustomText>
          )}
          <Pressable className="self-end mt-6" onPress={onButtonPress}>
            <CustomText className="text-lg text-gray-700" fontWeight="600">
              {buttonTitle}
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default OneButtonModal;
