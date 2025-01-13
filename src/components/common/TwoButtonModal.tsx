import React from 'react';
import {Modal, Pressable, View} from 'react-native';
import CustomText from './CustomText';

interface TwoButtonModalProps {
  title: string;
  content?: string;
  firstCallback: () => void;
  secondCallback: () => void;
}

const TwoButtonModal = ({
  title,
  content,
  firstCallback,
  secondCallback,
}: TwoButtonModalProps) => {
  return (
    <Modal transparent>
      <View className="w-full h-full bg-black/50 justify-center items-center">
        <View className="bg-white w-[80%] rounded-2xl shadow-md px-6 pt-6 pb-4">
          <CustomText fontWeight="600" className="text-[18px] mb-3">
            {title}
          </CustomText>
          {content && (
            <CustomText className="text-gray-600 leading-5 text-[15px]">
              {content}
            </CustomText>
          )}

          <View className="flex-row mt-6">
            <Pressable
              className="flex-grow-[1] justify-center items-center mr-2"
              onPress={firstCallback}>
              <CustomText fontWeight="500" className="text-gray-700">
                취소
              </CustomText>
            </Pressable>
            <Pressable
              className="flex-grow-[2] justify-center items-center py-3 rounded-xl ml-2 bg-[#1e293b]"
              onPress={secondCallback}>
              <CustomText fontWeight="500" className="text-white">
                완료
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TwoButtonModal;
