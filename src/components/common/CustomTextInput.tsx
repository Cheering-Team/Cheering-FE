import React, {forwardRef, useRef, useState} from 'react';
import {View, TextInput, TextInputProps, Pressable} from 'react-native';
import CustomText from './CustomText';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  containerStyle?: any;
  isValid?: boolean;
  inValidMessage?: string;
  curLength?: number;
  length?: boolean;
}

const CustomTextInput = forwardRef<any, CustomTextInputProps>((props, ref) => {
  const {
    label,
    isValid = true,
    inValidMessage,
    containerStyle,
    curLength,
    maxLength,
    length = false,
    value = '',
    ...rest
  } = props;
  const [focus, setFocus] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  return (
    <Pressable
      style={{width: '100%'}}
      onPress={() => textInputRef.current?.focus()}>
      <View
        style={[
          {
            width: '100%',
            borderColor: focus ? '#303030' : '#898989',
            borderWidth: focus ? 1.5 : 1,
            borderRadius: 5,
            paddingTop: 27,
            paddingBottom: 12,
            paddingHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: isValid ? 'white' : '#fcf2f2',
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
            color: isValid ? '#898989' : '#c64e4e',
          }}>
          {label}
        </CustomText>
        <TextInput
          ref={textInputRef}
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
          height: 25,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {!isValid && (
          <CustomText style={{color: '#c64e4e', marginLeft: 3}}>
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
});

export default CustomTextInput;
