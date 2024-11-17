import React, {useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import VolumeSvg from '../../../assets/images/volume.svg';
import VolumeMuteSvg from '../../../assets/images/volume-mute.svg';
import {WINDOW_WIDTH} from 'constants/dimension';
import {ImageType} from 'apis/post/types';
import CloseSvg from 'assets/images/x_white.svg';

interface PostVideoProps {
  video: ImageType;
  index: number;
  imagesLength: number;
  width: number;
  height: number;
  type: 'FEED' | 'POST' | 'WRITE';
  handleDeleteImage?: (path: string) => void;
}

const PostVideo = (props: PostVideoProps) => {
  const {video, index, imagesLength, width, height, type, handleDeleteImage} =
    props;

  const offset = type === 'POST' || type === 'FEED' ? 1 : 2;

  const [isMute, setIsMute] = useState(true);

  return (
    <View
      style={[
        {
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: '#d1d1d1',
          overflow: 'hidden',
        },
      ]}>
      <Video
        source={{uri: video.path}}
        repeat={true}
        muted={isMute}
        volume={0.8}
        style={[
          {
            width:
              imagesLength === 1
                ? width
                : Math.max(
                    Math.min(
                      video.width *
                        (type === 'FEED' ? 220 : 250 / offset / video.height),
                      WINDOW_WIDTH / offset -
                        (type === 'FEED' ? 85 : 60 / offset),
                    ),
                    150 / offset,
                  ),
            height:
              imagesLength === 1
                ? height
                : type === 'FEED'
                  ? 220
                  : 250 / offset,
          },
        ]}
      />
      {type === 'WRITE' && (
        <TouchableOpacity
          onPress={() => handleDeleteImage?.(video.path)}
          activeOpacity={0.5}
          className="bg-black/70 absolute right-[6] top-[6] p-[6] rounded-full">
          <CloseSvg width={10} height={10} />
        </TouchableOpacity>
      )}
      <Pressable
        className="absolute bg-black/50 rounded-full bottom-[6] right-[6] p-[4]"
        onPress={() => setIsMute(prev => !prev)}>
        {isMute ? (
          <VolumeMuteSvg width={16} height={16} />
        ) : (
          <VolumeSvg width={16} height={16} />
        )}
      </Pressable>
    </View>
  );
};

export default PostVideo;
