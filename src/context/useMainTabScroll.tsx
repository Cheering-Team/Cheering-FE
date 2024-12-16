import React, {createContext, ReactNode, useContext} from 'react';
import {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type MainTabScrollContextType = {
  scrollY: SharedValue<number>;
  animatedTabBarStyle: {
    transform: {
      translateY: number;
    }[];
  };
} | null;

type MainTabScrollProviderProps = {
  children: ReactNode;
};

const MainTabScrollContext = createContext<MainTabScrollContextType>(null);

export const MainTabScrollProvider = ({
  children,
}: MainTabScrollProviderProps) => {
  const scrollY = useSharedValue(0);
  const previousScrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  useDerivedValue(() => {
    const deltaY = scrollY.value - previousScrollY.value;

    if (deltaY > 0) {
      translateY.value = withTiming(45, {duration: 200});
    } else if (deltaY < 0) {
      translateY.value = withTiming(0, {duration: 200});
    }

    previousScrollY.value = scrollY.value; // 현재 스크롤 값을 이전 값으로 업데이트
  }, [scrollY.value]);

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <MainTabScrollContext.Provider value={{scrollY, animatedTabBarStyle}}>
      {children}
    </MainTabScrollContext.Provider>
  );
};

export const useMainTabScroll = () => {
  const context = useContext(MainTabScrollContext);

  if (!context) {
    throw new Error(
      'useMainTabScroll must be used within a MainTabScrollProvider',
    );
  }

  return context;
};
