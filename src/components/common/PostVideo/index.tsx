import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import Video from 'react-native-video';
import VolumeSvg from '../../../../assets/images/volume.svg';
import VolumeMuteSvg from '../../../../assets/images/volume-mute.svg';
import {ImageSizeType} from 'apis/post/types';
import {WINDOW_WIDTH} from 'constants/dimension';

interface PostVideoProps {
  video: ImageSizeType;
  index: number;
  imagesLength: number;
  width: number;
  height: number;
  type: 'FEED' | 'POST';
}

const PostVideo = (props: PostVideoProps) => {
  const {video, index, imagesLength, width, height, type} = props;

  const [isMute, setIsMute] = useState(true);

  return (
    <View
      style={[
        {
          borderRadius: 5,
          marginLeft: 10,
          borderWidth: 0.5,
          borderColor: '#d1d1d1',
          overflow: 'hidden',
        },
        index === 0 && type === 'FEED' && {marginLeft: 53},
      ]}>
      <Video
        source={{uri: video.url}}
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
                        (type === 'FEED' ? 220 : 250 / video.height),
                      WINDOW_WIDTH - (type === 'FEED' ? 85 : 60),
                    ),
                    150,
                  ),
            height: imagesLength === 1 ? height : type === 'FEED' ? 220 : 250,
          },
        ]}
      />
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
