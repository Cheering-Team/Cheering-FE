import React from 'react';
import {Pressable} from 'react-native';
import CheckSvg from '../../../assets/images/check-white.svg';

interface CheckBoxProps {
  isCheck: boolean;
  onPress: any;
  style?: any;
}

const CheckBox = (props: CheckBoxProps) => {
  const {isCheck, onPress, style} = props;

  return (
    <Pressable
      style={[
        isCheck
          ? {
              width: 22,
              height: 22,
              backgroundColor: 'black',
              borderRadius: 5,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : {
              width: 22,
              height: 22,
              borderWidth: 2,
              borderColor: '#d3d3d3',
              borderRadius: 5,
              marginRight: 10,
            },
        style,
      ]}
      onPress={onPress}>
      {isCheck && <CheckSvg width={13} height={13} />}
    </Pressable>
  );
};

export default CheckBox;
