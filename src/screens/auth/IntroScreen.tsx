import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthStackParamList} from '../../navigations/AuthStackNavigator';
import CustomButton from '../../components/common/CustomButton';
import FastImage from 'react-native-fast-image';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';

const images = [
  {id: '1', source: require('../../assets/images/appstore_1.png')},
  {id: '2', source: require('../../assets/images/appstore_2.png')},
  {id: '3', source: require('../../assets/images/appstore_3.png')},
  {id: '4', source: require('../../assets/images/appstore_4.png')},
  {id: '5', source: require('../../assets/images/appstore_5.png')},
  {id: '6', source: require('../../assets/images/appstore_6.png')},
];

type IntroScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Intro'
>;

const IntroScreen = ({navigation}: {navigation: IntroScreenNavigationProp}) => {
  const insets = useSafeAreaInsets();

  const paginationProgress = useSharedValue<number>(0);

  return (
    <View
      style={[
        styles.main,
        {paddingTop: insets.top, paddingBottom: insets.bottom + 15},
      ]}>
      <Carousel
        data={images}
        loop={false}
        width={WINDOW_WIDTH}
        height={WINDOW_HEIGHT - insets.bottom - 145 - insets.top}
        onProgressChange={paginationProgress}
        renderItem={({item}) => (
          <FastImage
            source={item.source}
            className="h-full"
            resizeMode="contain"
          />
        )}
      />
      <Pagination.Custom
        progress={paginationProgress}
        data={images}
        size={20}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 100,
          backgroundColor: '#d7d7d7',
        }}
        activeDotStyle={{
          borderRadius: 100,
          width: 8,
          height: 8,
          overflow: 'hidden',
          backgroundColor: '#383838',
        }}
        containerStyle={{
          gap: 8,
          alignItems: 'center',
          height: 10,
          bottom: 30,
        }}
        horizontal
        customReanimatedStyle={(progress, index, length) => {
          let val = Math.abs(progress - index);
          if (index === 0 && progress > length - 1) {
            val = Math.abs(progress - length);
          }

          return {
            transform: [
              {
                translateY: interpolate(
                  val,
                  [0, 1],
                  [0, 0],
                  Extrapolation.CLAMP,
                ),
              },
            ],
          };
        }}
      />

      <CustomButton
        text="시작하기"
        type="normal"
        onPress={() => {
          navigation.navigate('SignIn');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 32,
  },
});

export default IntroScreen;
