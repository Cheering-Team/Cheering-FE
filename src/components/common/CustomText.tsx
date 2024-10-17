import {StyleSheet, TextProps} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

interface CustomTextProps extends TextProps {
  fontWeight?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
}

const CustomText = (props: CustomTextProps) => {
  const {fontWeight = '400', style, children, ...rest} = props;
  if (fontWeight === '100') {
    return (
      <Animated.Text style={[styles.Thin, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '200') {
    return (
      <Animated.Text style={[styles.ExtraLight, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '300') {
    return (
      <Animated.Text style={[styles.Light, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '400') {
    return (
      <Animated.Text style={[styles.Regular, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '500') {
    return (
      <Animated.Text style={[styles.Medium, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '600') {
    return (
      <Animated.Text style={[styles.SemiBold, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '700') {
    return (
      <Animated.Text style={[styles.Bold, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '800') {
    return (
      <Animated.Text style={[styles.ExtraBold, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '900') {
    return (
      <Animated.Text style={[styles.Black, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  }
};

const styles = StyleSheet.create({
  Thin: {
    fontFamily: 'Pretendard-Thin',
    includeFontPadding: false,
  },
  ExtraLight: {
    fontFamily: 'Pretendard-ExtraLight',
    includeFontPadding: false,
  },
  Light: {
    fontFamily: 'Pretendard-Light',
    includeFontPadding: false,
  },
  Regular: {
    fontFamily: 'Pretendard-Regular',
    includeFontPadding: false,
  },
  Medium: {
    fontFamily: 'Pretendard-Medium',
    includeFontPadding: false,
  },
  SemiBold: {
    fontFamily: 'Pretendard-SemiBold',
    includeFontPadding: false,
  },
  Bold: {
    fontFamily: 'Pretendard-Bold',
    includeFontPadding: false,
  },
  ExtraBold: {
    fontFamily: 'Pretendard-ExtraBold',
    includeFontPadding: false,
  },
  Black: {
    fontFamily: 'Pretendard-Black',
    includeFontPadding: false,
  },
});

export default CustomText;
