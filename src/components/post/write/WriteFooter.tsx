import React, {Dispatch, SetStateAction} from 'react';
import {Pressable, View} from 'react-native';
import {
  openPicker,
  Results as ImageSelectType,
} from '@baronha/react-native-multiple-image-picker';
import ImagesSvg from 'assets/images/images.svg';

interface WriterFooterProps {
  imageData: ImageSelectType[];
  setImageData: Dispatch<SetStateAction<ImageSelectType[]>>;
}

const WriteFooter = (props: WriterFooterProps) => {
  const {imageData, setImageData} = props;

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
        height: 45,
        justifyContent: 'center',
        backgroundColor: 'yello',
        borderTopWidth: 1,
        borderColor: '#e1e1e1',
        paddingHorizontal: 13,
      }}>
      <Pressable onPress={handleImageUpload}>
        <ImagesSvg width={26} height={26} />
      </Pressable>
    </View>
  );
};

export default WriteFooter;
