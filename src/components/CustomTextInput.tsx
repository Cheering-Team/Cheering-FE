import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import React, {forwardRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
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

  return (
    <View style={{width: '100%'}}>
      <View
        style={[
          {
            width: '100%',
            borderColor: focus ? '#303030' : '#898989',
            borderWidth: focus ? 1.5 : 1,
            borderRadius: 5,
            paddingTop: 26,
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
            top: focus || value.length > 0 ? 6 : undefined,
            fontSize: focus || value.length > 0 ? 12 : 16,
            color: isValid ? '#898989' : '#c64e4e',
          }}>
          {label}
        </CustomText>
        <TextInput
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
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {!isValid && (
          <CustomText style={{color: '#c64e4e', marginTop: 3, marginLeft: 3}}>
            {inValidMessage}
          </CustomText>
        )}
        {length && (
          <CustomText
            style={{
              position: 'absolute',
              right: 6,
              top: 2,
              color: '#6d6d6d',
              fontSize: 13,
            }}>
            {`${curLength} / ${maxLength}`}
          </CustomText>
        )}
      </View>
    </View>
    // <View style={[styles.emailInput, style]}>
    //   {label && (
    //     <CustomText fontWeight="400" style={styles.emailInputLabel}>
    //       {label}
    //     </CustomText>
    //   )}
    //   <TextInput
    //     placeholderTextColor="#C6C6C6"
    //     style={
    //       !valid
    //         ? styles.invalidEmailInput
    //         : focus
    //         ? styles.emailInputFocus
    //         : styles.emailInputBlur
    //     }
    //     onFocus={() => setFocus(true)}
    //     onBlur={() => setFocus(false)}
    //     autoCapitalize="none"
    //     {...rest}
    //   />
    //   <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    //     <CustomText
    //       fontWeight="500"
    //       style={!valid ? styles.invalidEmail : styles.validEmail}>
    //       {invalidMessage}
    //     </CustomText>
    //     {maxLength !== 0 && (
    //       <CustomText
    //         fontWeight="400"
    //         style={{
    //           color: '#a3a3a3',
    //           fontSize: 13,
    //           marginTop: 4,
    //         }}>{`${curLength} / ${maxLength}`}</CustomText>
    //     )}
    //   </View>
    // </View>
  );
});

const styles = StyleSheet.create({
  emailInput: {
    marginTop: 20,
  },
  emailInputLabel: {
    fontSize: 15,
    marginBottom: 5,
    color: '#717478',
  },
  emailInputBlur: {
    fontSize: 19,
    padding: 0,
    paddingBottom: 8,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
  },
  emailInputFocus: {
    fontSize: 19,
    padding: 0,
    paddingBottom: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
  invalidEmailInput: {
    fontSize: 19,
    padding: 0,
    paddingBottom: 8,
    borderBottomColor: '#ff5252',
    borderBottomWidth: 2,
  },
  validEmail: {
    opacity: 0,
    fontSize: 14,
    marginTop: 5,
  },
  invalidEmail: {
    color: '#ff5252',
    fontSize: 14,
    marginTop: 4,
  },
});

export default CustomTextInput;
