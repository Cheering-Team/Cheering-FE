import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated} from 'react-native';

type HeaderTitleProps = {
  title?: string | React.ReactNode;
  triggerPoint: number;
};

const useAnimatedHeader = ({title, triggerPoint}: HeaderTitleProps) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({
        title,
      });
    }
  }, [navigation, title]);

  React.useEffect(() => {
    navigation.setOptions({
      headerStyleInterpolator: () => {
        const opacity = scrollY.interpolate({
          inputRange: [triggerPoint, triggerPoint + 20],
          outputRange: [0, 1],
        });

        return {
          titleStyle: {opacity},
        };
      },
    });
  }, [navigation, scrollY]);

  return {scrollY};
};

export default useAnimatedHeader;
