import React, {createContext, ReactNode, useContext} from 'react';
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type MainTabScrollContextType = {
  scrollY: SharedValue<number>;
  previousScrollY: SharedValue<number>;
  tabAnimationStyle: {
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
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const previousScrollY = useSharedValue(0);

  const tabAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 50],
            [0, 45 + insets.bottom],
          ),
        },
      ],
    };
  });

  return (
    <MainTabScrollContext.Provider
      value={{scrollY, previousScrollY, tabAnimationStyle}}>
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
