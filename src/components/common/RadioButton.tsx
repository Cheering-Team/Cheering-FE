import React from 'react';
import {View} from 'react-native';

interface RadioButtonProps {
  size?: number;
  color?: string;
  selected: boolean;
}

const RadioButton = ({
  size = 15,
  color = '#000000',
  selected,
}: RadioButtonProps) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderColor: selected ? color : '#acacac',
        borderWidth: selected ? 4 : 1,
        borderRadius: 999,
      }}></View>
  );
};

export default RadioButton;
