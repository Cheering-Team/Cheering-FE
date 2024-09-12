import React, {Dispatch, SetStateAction} from 'react';
import CustomText from '../../common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Pressable, View} from 'react-native';
import DrawerSvg from '../../../../assets/images/drawer-star.svg';

interface HomeHeaderProps {
  translateY: SharedValue<number>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HomeHeader = (props: HomeHeaderProps) => {
  const {translateY, setIsOpen} = props;
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
            justifyContent: 'space-between',
            zIndex: 100,
            backgroundColor: 'white',
            width: '100%',
            paddingHorizontal: 10,
          },
          animatedHeaderStyle,
        ]}>
        <Pressable
          onPress={() => {
            setIsOpen(true);
          }}>
          <DrawerSvg width={30} height={30} style={{marginTop: 5}} />
        </Pressable>

        <CustomText
          fontWeight="600"
          style={{
            fontSize: 28,
          }}>
          Cheering
        </CustomText>
        <View style={{width: 30, height: 30}} />
      </Animated.View>
    </View>
  );
};

export default HomeHeader;
