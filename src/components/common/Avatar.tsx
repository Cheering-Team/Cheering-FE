import React from 'react';
import {Image, ImageProps} from 'react-native';

interface AvatarProps extends ImageProps {
  uri?: string | null;
  size: number;
}

const Avatar = (props: AvatarProps) => {
  const {
    uri = 'https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800',
    size,
    style,
    ...rest
  } = props;
  return (
    <Image
      source={{
        uri:
          uri ||
          'https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800',
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
