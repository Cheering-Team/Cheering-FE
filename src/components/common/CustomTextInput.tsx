import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, TextInput, TextInputProps, Pressable} from 'react-native';
import CustomText from './CustomText';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  containerStyle?: any;
  isValid?: boolean;
  inValidMessage?: string;
  curLength?: number;
  length?: boolean;
  style?: any;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (props, ref) => {
    const {
      label,
      isValid = true,
      inValidMessage,
      containerStyle,
      curLength,
      maxLength,
      length = false,
      value = '',
      style,
      ...rest
    } = props;
    const [focus, setFocus] = useState(false);
    const internalRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => internalRef.current as TextInput);

    return (
      <Pressable
        style={[{width: '100%'}, style]}
        onPress={() => internalRef.current?.focus()}>
        <View
          style={[
            {
              width: '100%',
              borderColor: !isValid ? '#f84242' : focus ? '#303030' : '#898989',
              borderWidth: focus ? 1.5 : 0.8,
              borderRadius: 5,
              paddingTop: 26,
              paddingBottom: 10,
              paddingHorizontal: 10,
              justifyContent: 'center',
              backgroundColor: 'white',
            },
            containerStyle,
          ]}>
          <CustomText
            fontWeight={isValid ? '400' : '500'}
            style={{
              position: 'absolute',
              left: 10,
              top: focus || value.length > 0 ? 5 : undefined,
              fontSize: focus || value.length > 0 ? 12 : 16,
              color: isValid ? '#898989' : '#e75959',
            }}>
            {label}
          </CustomText>
          <TextInput
            ref={internalRef}
            value={value}
            style={{fontSize: 16}}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            maxLength={maxLength}
            autoCapitalize="none"
            {...rest}
          />
        </View>
        <View
          style={{
            height: 27,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {!isValid && (
            <CustomText style={{color: '#f84242', marginLeft: 3}}>
              {inValidMessage}
            </CustomText>
          )}
          {length && (
            <CustomText
              style={{
                position: 'absolute',
                right: 6,
                color: '#6d6d6d',
                fontSize: 13,
              }}>
              {`${curLength} / ${maxLength}`}
            </CustomText>
          )}
        </View>
      </Pressable>
    );
  },
);

export default CustomTextInput;
