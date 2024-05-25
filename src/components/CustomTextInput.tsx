import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import CustomText from './CustomText';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  valid?: boolean;
  invalidMessage?: string;
  type?: 'Sheet' | 'Basic';
}

const CustomTextInput = forwardRef<any, CustomTextInputProps>((props, ref) => {
  const {valid = true, label, invalidMessage, type = 'Basic', ...rest} = props;
  const [focus, setFocus] = React.useState(false);

  return (
    <View style={styles.emailInput}>
      {label && (
        <CustomText fontWeight="400" style={styles.emailInputLabel}>
          {label}
        </CustomText>
      )}
      {type === 'Sheet' ? (
        <BottomSheetTextInput
          ref={ref}
          placeholderTextColor="#C6C6C6"
          style={
            !valid
              ? styles.invalidEmailInput
              : focus
              ? styles.emailInputFocus
              : styles.emailInputBlur
          }
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoCapitalize="none"
          {...rest}
        />
      ) : (
        <TextInput
          placeholderTextColor="#C6C6C6"
          style={
            !valid
              ? styles.invalidEmailInput
              : focus
              ? styles.emailInputFocus
              : styles.emailInputBlur
          }
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoCapitalize="none"
          {...rest}
        />
      )}

      <CustomText
        fontWeight="500"
        style={!valid ? styles.invalidEmail : styles.validEmail}>
        {invalidMessage}
      </CustomText>
    </View>
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
