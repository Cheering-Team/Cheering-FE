import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {View} from 'react-native';
import LogoSvg from '../../../assets/images/logo-text.svg';
import CustomText from 'components/common/CustomText';

interface HomeHeaderProps {
  translateY: SharedValue<number>;
}

const HomeHeader = (props: HomeHeaderProps) => {
  const {translateY} = props;
  const insets = useSafeAreaInsets();

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 100,
            easing: Easing.linear,
          }),
        },
      ],
    };
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        width: '100%',
      }}>
      <View
        style={{height: insets.top, backgroundColor: 'white', zIndex: 1000}}
      />
      <Animated.View
        style={[
          {
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
            backgroundColor: 'white',
            width: '100%',
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eeeeee',
          },
          animatedHeaderStyle,
        ]}>
        <View style={{width: 30, height: 30}} />
        <LogoSvg width={200} height={50} />
        <View style={{width: 30, height: 30}} />
      </Animated.View>
    </View>
  );
};

export default HomeHeader;
