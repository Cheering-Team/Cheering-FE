import React, {useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Pressable, View} from 'react-native';
import LogoSvg from '../../../assets/images/logo-text.svg';
import AlertSvg from 'assets/images/alert-black.svg';
import {useGetIsUnread} from 'apis/notification/useNotifications';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';

interface HomeHeaderProps {
  translateY: SharedValue<number>;
}

const HomeHeader = (props: HomeHeaderProps) => {
  const {translateY} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data, refetch} = useGetIsUnread();

  useFocusEffect(
    useCallback(() => {
      // 화면이 focus될 때마다 refetch를 호출합니다.
      refetch();
    }, [refetch]),
  );

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
        <Pressable
          className="w-[30] h-[30] items-center justify-center"
          onPress={() => navigation.navigate('Notification')}>
          <AlertSvg width={22} height={22} />
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              width: 11,
              height: 11,
              backgroundColor: 'red',
              borderRadius: 100,
              top: 2,
              right: 2,
            }}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default HomeHeader;
