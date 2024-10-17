import {SCREEN_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import Video from 'react-native-video';
import VolumeSvg from '../../../assets/images/volume.svg';
import VolumeMuteSvg from '../../../assets/images/volume-mute.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ViewerVideoProps {
  uri: string;
  width: number;
  height: number;
}

const ViewerVideo = (props: ViewerVideoProps) => {
  const {uri, width, height} = props;

  const [isMute, setIsMute] = useState(false);

  return (
    <>
      <Video
        source={{uri: uri}}
        style={{
          width: WINDOW_WIDTH,
          height: '100%',
        }}
        resizeMode="contain"
        repeat={true}
        muted={isMute}
      />
      <Pressable
        className="absolute bg-black/50 rounded-full right-[6] p-[4]"
        style={{
          bottom: (WINDOW_HEIGHT - height * (WINDOW_WIDTH / width)) / 2 + 6,
        }}
        onPress={() => setIsMute(prev => !prev)}>
        {isMute ? (
          <VolumeMuteSvg width={16} height={16} />
        ) : (
          <VolumeSvg width={16} height={16} />
        )}
      </Pressable>
    </>
  );
};

export default ViewerVideo;
