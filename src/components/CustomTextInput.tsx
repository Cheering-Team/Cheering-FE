import React from 'react';
import {Text, View, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  valid?: boolean;
  invalidMessage?: string;
}

const CustomTextInput = (props: CustomTextInputProps) => {
  const {valid = true, label, invalidMessage, ...rest} = props;
  const [focus, setFocus] = React.useState(false);

  return (
    <View style={styles.emailInput}>
      <Text style={styles.emailInputLabel}>{label}</Text>
      <TextInput
        placeholder="example@email.com"
        style={
          !valid
            ? styles.invalidEmailInput
            : focus
            ? styles.emailInputFocus
            : styles.emailInputBlur
        }
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoCapitalize={'none'}
        {...rest}
      />
      <Text style={!valid ? styles.invalidEmail : styles.validEmail}>
        {invalidMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emailInput: {
    width: '89%',
    marginTop: 30,
    paddingBottom: 6,
  },
  emailInputBlur: {
    paddingBottom: 6,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  emailInputFocus: {
    paddingBottom: 7,
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
  emailInputLabel: {
    fontSize: 14,
    marginBottom: 10,
    color: '#717478',
  },
  validEmail: {
    opacity: 0,
    fontSize: 12,
    marginTop: 5,
    fontWeight: '400',
  },
  invalidEmail: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '400',
  },
  invalidEmailInput: {
    paddingBottom: 7,
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
});

export default CustomTextInput;
