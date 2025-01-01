import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from './CustomText';

interface RadioButtonProps {
  title: string;
  description?: string;
  color?: string;
  selected: boolean;
  onPress: () => void;
}

const RadioButton = ({
  title,
  description,
  color = '#000000',
  selected,
  onPress,
}: RadioButtonProps) => {
  return (
    <Pressable
      className="bg-white flex-1 flex-row justify-between items-center border rounded-md"
      style={{
        borderColor: selected ? color : '#e5e7eb',
        paddingVertical: description ? 12 : 10,
        paddingHorizontal: 12,
      }}
      onPress={onPress}>
      <View>
        <CustomText
          className="text-[15px] text-[#2c2c2c]"
          fontWeight="500"
          style={{
            color: selected ? color : '#2c2c2c',
            fontSize: description ? 15 : 14,
          }}>
          {title}
        </CustomText>
        {description && (
          <CustomText
            numberOfLines={2}
            className="text-[12px] text-[#808080] mt-1">
            {description}
          </CustomText>
        )}
      </View>
      {selected && !description && (
        <View
          className="w-[15] h-[15] border rounded-full justify-center items-center"
          style={{borderColor: color}}>
          <View
            className="w-[9] h-[9] rounded-full"
            style={{backgroundColor: color}}
          />
        </View>
      )}
      {selected && description && (
        <View
          className="absolute top-2 right-2 w-[15] h-[15] border rounded-full justify-center items-center"
          style={{borderColor: color}}>
          <View
            className="w-[9] h-[9] rounded-full"
            style={{backgroundColor: color}}
          />
        </View>
      )}
    </Pressable>
  );
};

export default RadioButton;
