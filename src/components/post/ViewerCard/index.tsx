import {ImageType} from 'apis/post/types';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import Video, {VideoRef} from 'react-native-video';
import Pinchable from 'react-native-pinchable';

interface ViewerCardPorps {
  image: ImageType;
  isFocus: boolean;
}

const ViewerCard = ({image, isFocus}: ViewerCardPorps) => {
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    if (!isFocus) {
      videoRef.current?.seek(0);
    }
  }, [isFocus]);

  return (
    <Pinchable>
      {image.type === 'IMAGE' || image.type === 'image' ? (
        <FastImage
          source={{uri: image.path}}
          className="w-full h-full"
          resizeMode="contain"
        />
      ) : (
        <Video
          ref={videoRef}
          source={{uri: image.path}}
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
          }}
          paused={!isFocus}
          resizeMode="contain"
          repeat={true}
        />
      )}
    </Pinchable>
  );
};

export default ViewerCard;
