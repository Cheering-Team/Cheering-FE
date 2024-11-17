import React from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

interface AvatarProps extends FastImageProps {
  uri?: string | null;
  size: number;
}

const Avatar = (props: AvatarProps) => {
  const {
    uri = 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/profile-image.jpg',
    size,
    style,
    ...rest
  } = props;
  return (
    <FastImage
      source={{
        uri:
          uri ||
          'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/profile-image.jpg',
      }}
      style={[
        {
          backgroundColor: 'white',
          width: size,
          height: size,
          borderRadius: size,
          borderWidth: 0.5,
          borderColor: '#ebebeb',
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default Avatar;
