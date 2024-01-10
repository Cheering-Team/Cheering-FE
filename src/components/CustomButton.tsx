import {Pressable, PressableProps, StyleSheet, Text} from 'react-native';

interface CustomButtonProps extends PressableProps {
  text: string;
}

const CustomButton = (props: CustomButtonProps) => {
  const {text, ...rest} = props;
  return (
    <Pressable style={styles.emailBtn} {...rest}>
      <Text style={styles.emailBtnText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  emailBtn: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#EF4365',
    width: '90%',
    padding: 14,
    borderRadius: 5,
  },
  emailBtnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
