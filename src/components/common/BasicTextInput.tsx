import React from 'react';
import {Platform, TextInput, View} from 'react-native';
import CustomText from './CustomText';

interface BasicTextInputProps {
  label: string;
  placeholder: string;
  multiline?: boolean;
  height?: number;
}

const BasicTextInput = ({
  label,
  placeholder,
  multiline = false,
  height,
}: BasicTextInputProps) => {
  return (
    <View>
      <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-2">
        {label}
      </CustomText>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#828181'}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        className="border border-gray-200 p-0 px-2 rounded-[5px]"
        style={{
          fontFamily: 'Pretendard-Regular',
          paddingTop: Platform.OS === 'android' ? (multiline ? 10 : 4) : 10,
          paddingBottom: Platform.OS === 'android' ? 4 : 10,
          includeFontPadding: false,
          height: height || undefined,
        }}
      />
    </View>
  );
};

export default BasicTextInput;
