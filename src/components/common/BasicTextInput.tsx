import React from 'react';
import {Platform, TextInput, View} from 'react-native';
import CustomText from './CustomText';

interface BasicTextInputProps {
  label: string;
  placeholder: string;
  multiline?: boolean;
  height?: number;
  value: string;
  onChangeText: (text: string) => void;
  isRequired?: boolean;
}

const BasicTextInput = ({
  label,
  placeholder,
  multiline = false,
  height,
  value,
  onChangeText,
  isRequired = false,
}: BasicTextInputProps) => {
  return (
    <View className="items-start">
      <View>
        <CustomText fontWeight="500" className="text-[15px] ml-[2] mt-5 mb-2">
          {label}
        </CustomText>
        {isRequired && (
          <View className="w-[6] h-[6] rounded-full bg-rose-600 absolute top-5 right-[-7]" />
        )}
      </View>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#828181'}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        className="border border-gray-200 p-0 px-2 rounded-[5px] w-full"
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
