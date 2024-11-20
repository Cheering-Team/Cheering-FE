import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CustomButtonProps extends PressableProps {
  text: string;
  type?: 'normal' | 'bottom';
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    text,
    type = 'bottom',
    disabled = false,
    isLoading = false,
    style,
    ...rest
  } = props;

  const bottomHeight = useSafeAreaInsets().bottom;

  return (
    <Pressable
      disabled={disabled || isLoading}
      style={({pressed}) => [
        styles.emailBtn,
        {
          backgroundColor: disabled
            ? '#aeaeae'
            : pressed
              ? '#232323'
              : '#000000',
        },
        type === 'bottom'
          ? {
              paddingBottom: bottomHeight,
              height: bottomHeight + 55,
            }
          : {padding: 10, borderRadius: 5, height: 50},
        style,
      ]}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <CustomText style={[styles.emailBtnText]} fontWeight="500">
          {text}
        </CustomText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  emailBtn: {
    flex: 0,
    justifyContent: 'center',
    width: '100%',
  },
  emailBtnText: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
  },
});

export default CustomButton;
