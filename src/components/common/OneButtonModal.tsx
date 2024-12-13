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
        <View className="bg-[#EDEDED] w-[85%] py-6 px-6 rounded-xl">
          <CustomText
            className="text-[21px] mb-[14] text-[#313A49]"
            numberOfLines={999}
            fontWeight="700">
            {title}
          </CustomText>
          {content && (
            <CustomText
              className="text-[17px] leading-[24px] text-gray-500"
              fontWeight="600"
              numberOfLines={999}>
              {content}
            </CustomText>
          )}
          <Pressable className="self-end mt-6" onPress={onButtonPress}>
            <CustomText className="text-lg text-gray-700" fontWeight="700">
              {buttonTitle}
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default OneButtonModal;
