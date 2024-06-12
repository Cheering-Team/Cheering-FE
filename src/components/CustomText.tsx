import {StyleSheet, TextProps} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

interface CustomTextProps extends TextProps {
  fontWeight?: '300' | '400' | '500' | '600' | '700';
}

const CustomText = (props: CustomTextProps) => {
  const {fontWeight = '400', style, children, ...rest} = props;

  if (fontWeight === '300') {
    return (
      <Animated.Text style={[styles.LightFont, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '400') {
    return (
      <Animated.Text style={[styles.RegularFont, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '500') {
    return (
      <Animated.Text style={[styles.MediumFont, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else if (fontWeight === '600') {
    return (
      <Animated.Text style={[styles.SemiBoldFont, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  } else {
    return (
      <Animated.Text style={[styles.BoldFont, style]} {...rest}>
        {children}
      </Animated.Text>
    );
  }
};

const styles = StyleSheet.create({
  LightFont: {
    fontFamily: 'NotoSansKR-Light',
    includeFontPadding: false,
  },
  RegularFont: {
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },
  MediumFont: {
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },
  SemiBoldFont: {
    fontFamily: 'NotoSansKR-SemiBold',
    includeFontPadding: false,
  },
  BoldFont: {
    fontFamily: 'NotoSansKR-Bold',
    includeFontPadding: false,
  },
});

export default CustomText;
