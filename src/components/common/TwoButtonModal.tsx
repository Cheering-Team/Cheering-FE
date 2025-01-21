import React, {useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import CustomText from './CustomText';
import BasicTextInput from './BasicTextInput';
import LoadingOverlay from './LoadingOverlay';

interface TwoButtonModalProps {
  title: string;
  content?: string;
  firstCallback: () => void;
  secondText: string;
  secondCallback?: () => void;
  textInputSecondCallback?: (text: string) => void;
  secondButtonColor?: string;
  textInputLabel?: string;
  textInputPlaceholder?: string;
  isLoading?: boolean;
}

const TwoButtonModal = ({
  title,
  content,
  firstCallback,
  secondText = '완료',
  secondCallback,
  textInputSecondCallback,
  secondButtonColor = '#1e293b',
  textInputLabel,
  textInputPlaceholder,
  isLoading = false,
}: TwoButtonModalProps) => {
  const [text, setText] = useState('');
  return (
    <Modal transparent animationType="fade">
      <View className="w-full h-full bg-black/50 justify-center items-center">
        <View
          className="bg-white w-[80%] rounded-2xl shadow-md px-6 pt-6 pb-4"
          style={{width: textInputLabel ? '92%' : '80%'}}>
          <CustomText fontWeight="600" className="text-[18px] mb-3">
            {title}
          </CustomText>
          {content && (
            <CustomText
              className="text-gray-600 leading-5 text-[15px]"
              numberOfLines={999}>
              {content}
            </CustomText>
          )}
          {textInputLabel && (
            <BasicTextInput
              label={textInputLabel}
              multiline={true}
              height={100}
              placeholder={textInputPlaceholder || textInputLabel}
              value={text}
              onChangeText={setText}
            />
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
              onPress={() => {
                if (textInputLabel) {
                  textInputSecondCallback?.(text);
                } else {
                  secondCallback?.();
                }
              }}
              style={{backgroundColor: secondButtonColor}}>
              <CustomText fontWeight="500" className="text-white">
                {secondText}
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
      {isLoading && <LoadingOverlay type="LOADING" />}
    </Modal>
  );
};

export default TwoButtonModal;
