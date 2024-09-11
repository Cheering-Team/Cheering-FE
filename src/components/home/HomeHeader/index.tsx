import React from 'react';
import CustomText from '../../common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {View} from 'react-native';

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
    <View style={{position: 'absolute', top: 0, zIndex: 1000, width: '100%'}}>
      <View
        style={{height: insets.top, backgroundColor: 'white', zIndex: 1000}}
      />
      <Animated.View
        style={[
          {
            height: 53,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backgroundColor: 'white',
            width: '100%',
          },
          animatedHeaderStyle,
        ]}>
        <CustomText
          fontWeight="600"
          style={{
            fontSize: 28,
          }}>
          Cheering
        </CustomText>
      </Animated.View>
    </View>
  );
};

export default HomeHeader;
