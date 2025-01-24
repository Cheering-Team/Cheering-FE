import {ActivityIndicator, Pressable, PressableProps} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CustomButtonProps extends PressableProps {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const CustomButton = (props: CustomButtonProps) => {
  const {text, disabled = false, isLoading = false, ...rest} = props;
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      disabled={disabled || isLoading}
      className="justify-center items-center bg-black mt-2 mx-2 p-3 rounded-md"
      style={{marginBottom: insets.bottom + 8}}
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
