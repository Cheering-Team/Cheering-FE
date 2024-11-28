import {Platform, StyleSheet, TextProps} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

interface CustomTextProps extends TextProps {
  numberOfLines?: number;
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
  type?: 'title' | 'titleCenter' | 'normal';
}

const CustomText = (props: CustomTextProps) => {
  const {
    fontWeight = '400',
    style,
    children,
    type = 'normal',
    numberOfLines = 1,
    ...rest
  } = props;
  if (type === 'titleCenter') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[
          styles.Title,
          style,
          {paddingTop: Platform.OS === 'android' ? 8 : 5},
        ]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  }
  if (type === 'title') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Title, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  }
  if (fontWeight === '100') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Thin, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '200') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.ExtraLight, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '300') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Light, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '400') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Regular, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '500') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Medium, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '600') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.SemiBold, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '700') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Bold, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '800') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.ExtraBold, style]}
        {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '900') {
    return (
      <Animated.Text
        numberOfLines={numberOfLines}
        style={[styles.Black, style]}
        {...rest}>
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
  Title: {
    fontFamily: 'Tenada',
    includeFontPadding: false,
  },
});

export default CustomText;
