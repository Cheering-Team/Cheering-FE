import {ImageSizeType} from 'apis/post/types';
import {WINDOW_WIDTH} from 'constants/dimension';
import React, {Dispatch, SetStateAction, useRef} from 'react';
import {Animated, Modal, PanResponder, Pressable} from 'react-native';
import Carousel, {CarouselRenderItem} from 'react-native-reanimated-carousel';
import CloseSvg from '../../../../assets/images/x_white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import ViewerVideo from '../ViewerVideo';

interface ImageVideoViewerProps {
  isViewer: boolean;
  setIsViewer: Dispatch<SetStateAction<boolean>>;
  images: ImageSizeType[];
  curImage: number;
}

const ImageVideoViewer = (props: ImageVideoViewerProps) => {
  const {isViewer, setIsViewer, images, curImage} = props;
  const insets = useSafeAreaInsets();

  const renderItem: CarouselRenderItem<ImageSizeType> = ({item}) => {
    return (
      <>
        {item.type === 'VIDEO' ? (
          <ViewerVideo uri={item.url} width={item.width} height={item.height} />
        ) : (
          <ImageZoom
            source={{uri: item.url}}
            style={{
              width: WINDOW_WIDTH,
              height: '100%',
            }}
            resizeMode="contain"
          />
        )}
      </>
    );
  };

  return (
    <Modal visible={isViewer} transparent={true} animationType="fade">
      <Pressable
        className="absolute z-10 left-[15] bg-black/60 p-[10] rounded-full"
        style={{top: insets.top + 10}}
        onPress={() => setIsViewer(false)}>
        <CloseSvg width={16} height={16} />
      </Pressable>

      <Carousel
        width={WINDOW_WIDTH}
        data={images}
        renderItem={renderItem}
        loop={false}
        overscrollEnabled={false}
        defaultIndex={curImage}
        style={{backgroundColor: 'rgba(0,0,0,0.95)'}}
      />
    </Modal>
  );
};

export default ImageVideoViewer;
