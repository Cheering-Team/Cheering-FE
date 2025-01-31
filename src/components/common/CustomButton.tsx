import {ActivityIndicator, Pressable, PressableProps} from 'react-native';
import React from 'react';
import CustomText from './CustomText';

interface CustomButtonProps extends PressableProps {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const CustomButton = (props: CustomButtonProps) => {
  const {text, disabled = false, isLoading = false, ...rest} = props;

  return (
    <Pressable
      disabled={disabled || isLoading}
      className="justify-center items-center bg-black p-3 rounded-md"
      {...rest}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <CustomText className="text-white text-[17px]" fontWeight="500">
          {text}
        </CustomText>
      )}
    </Pressable>
  );
};

export default CustomButton;
