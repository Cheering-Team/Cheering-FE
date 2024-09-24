import React, {useEffect, useState} from 'react';
import {Animated, Easing, Pressable} from 'react-native';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const Switch = (props: SwitchProps) => {
  const {isOn, onToggle} = props;
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 23],
  });

  const color = isOn ? 'bg-[#000000]' : 'bg-[#eeeeee]';

  return (
    <Pressable
      className={`w-12 h-7 rounded-[15px] justify-center ${color}`}
      onPress={onToggle}>
      <Animated.View
        className="w-5 h-5 bg-white rounded-full"
        style={{transform: [{translateX}]}}
      />
    </Pressable>
  );
};

export default Switch;
