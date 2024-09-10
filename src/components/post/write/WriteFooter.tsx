import React, {Dispatch, SetStateAction} from 'react';
import {Animated, Image, Pressable, TouchableOpacity, View} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import CustomText from '../../common/CustomText';
import PlusSvg from '../../../../assets/images/plus-gray.svg';
import CropSvg from '../../../../assets/images/crop-white.svg';
import CloseWhiteSvg from '../../../../assets/images/x_white.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {SizeImage} from '../../../screens/communityStack/PostWriteScreen';

interface WriterFooterProps {
  imageData: SizeImage[];
  setImageData: Dispatch<SetStateAction<SizeImage[]>>;
  setIsImageInfo: Dispatch<SetStateAction<boolean>>;
  fadeAnim: Animated.Value;
}

const WriteFooter = (props: WriterFooterProps) => {
  const {imageData, setImageData, setIsImageInfo, fadeAnim} = props;

  const renderImage = ({
    item,
    getIndex,
    drag,
    isActive,
  }: {
    item: SizeImage;
    getIndex: () => number | undefined;
    drag: () => void;
    isActive: boolean;
  }) => {
    return (
      <ScaleDecorator key={item.name}>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Image
            source={{uri: item.uri}}
            style={{
              width: 100,
              height: 130,
              borderRadius: 3,
              marginRight: 10,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 5,
              right: 15,
            }}>
            <Pressable
              style={{
                padding: 6,
                borderRadius: 20,
                backgroundColor: '#000000a1',
              }}
              onPress={() => {
                setImageData(prev =>
                  prev.filter((_, idx) => idx !== getIndex()),
                );
              }}>
              <CloseWhiteSvg width={10} height={10} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const handleImageUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        forceJpg: true,
      });

      const imageObj = images.map(image => ({
        uri: image.path,
        name: image.filename,
        type: image.mime,
      }));

      const newImages = [...imageData, ...imageObj];

      setImageData(newImages);

      setIsImageInfo(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 12,
        marginBottom: 10,
        borderTopWidth: 1,
        backgroundColor: 'white',
        borderColor: '#e1e1e1',
      }}>
      <DraggableFlatList
        data={imageData}
        horizontal={true}
        onDragEnd={({data}) => setImageData(data)}
        keyExtractor={item => item.uri}
        showsHorizontalScrollIndicator={false}
        renderItem={renderImage}
        containerStyle={{width: '100%'}}
        ListFooterComponent={
          <Pressable
            style={{
              width: 100,
              height: 130,
              borderWidth: 1,
              borderRadius: 3,
              borderColor: '#d0d0d0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleImageUpload}>
            <PlusSvg width={18} height={18} />
            <CustomText style={{color: '#858585', marginTop: 8}}>
              사진 추가
            </CustomText>
          </Pressable>
        }
      />
    </View>
  );
};

export default WriteFooter;
