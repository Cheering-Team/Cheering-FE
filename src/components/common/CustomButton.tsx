import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CustomButtonProps extends PressableProps {
  text: string;
  type?: 'normal' | 'bottom';
  disabled?: boolean;
  isLoading?: boolean;
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    text,
    type = 'bottom',
    disabled = false,
    isLoading = false,
    ...rest
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const bottomHeight = useSafeAreaInsets().bottom;

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={
        disabled
          ? ['#c1c1c1', '#c1c1c1']
          : isPressed
          ? ['#528e46', '#60bf6a']
          : ['#58a04b', '#63cb6d']
      }
      style={[
        styles.emailBtn,
        type === 'bottom'
          ? {
              paddingBottom: bottomHeight,
              height: bottomHeight + 55,
            }
          : {padding: 10, borderRadius: 5},
      ]}>
      <Pressable
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <CustomText style={[styles.emailBtnText]} fontWeight="500">
            {text}
          </CustomText>
        )}
      </Pressable>
    </LinearGradient>
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
