import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Keyboard, Pressable, View} from 'react-native';
import {
  openPicker,
  Results as ImageSelectType,
} from '@baronha/react-native-multiple-image-picker';
import ImagesSvg from 'assets/images/images.svg';
import VoteSvg from 'assets/images/vote-black.svg';
import CustomText from 'components/common/CustomText';

interface WriterFooterProps {
  imageData: ImageSelectType[];
  setImageData: Dispatch<SetStateAction<ImageSelectType[]>>;
  setIsVote: Dispatch<SetStateAction<boolean>>;
}

const WriteFooter = (props: WriterFooterProps) => {
  const {imageData, setImageData, setIsVote} = props;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleImageUpload = async () => {
    try {
      const response = await openPicker({
        selectedAssets: imageData,
        usedCameraButton: false,
        maxSelectedAssets: 10,
        doneTitle: '추가',
        cancelTitle: '취소',
        emptyMessage: '사진이 하나도 없네요',
        maximumMessageTitle: '',
        tapHereToChange: '앨범',
        maximumMessage: '최대 10장까지만 선택 가능해요',
        selectedColor: '#000000',
      });

      setImageData(Array.isArray(response) ? response : [response]);
    } catch (e) {
      //
    }
  };

  return (
    <View
      style={{
        height: 41,
        backgroundColor: 'yello',
        borderTopWidth: 1,
        borderColor: '#e1e1e1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 6,
        paddingRight: 16,
      }}>
      <View className="flex-row items-center">
        <Pressable onPress={handleImageUpload} className="px-2">
          <ImagesSvg width={24} height={24} />
        </Pressable>

        <Pressable
          onPress={() => {
            setIsVote(true);
          }}
          className="px-3">
          <VoteSvg width={21} height={21} />
        </Pressable>
      </View>

      {isKeyboardVisible && (
        <Pressable onPress={() => Keyboard.dismiss()}>
          <CustomText className="text-[17px]" fontWeight="600">
            닫기
          </CustomText>
        </Pressable>
      )}
    </View>
  );
};

export default WriteFooter;
