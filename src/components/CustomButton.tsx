import {Pressable, PressableProps, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CustomButtonProps extends PressableProps {
  text: string;
}

const CustomButton = (props: CustomButtonProps) => {
  const {text, ...rest} = props;
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={['#58a04b', '#63cb6d']}
      style={[
        styles.emailBtn,
        {
          paddingBottom: useSafeAreaInsets().bottom,
          height: useSafeAreaInsets().bottom + 55,
        },
      ]}>
      <Pressable {...rest}>
        <CustomText style={styles.emailBtnText} fontWeight="500">
          {text}
        </CustomText>
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
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default CustomButton;
