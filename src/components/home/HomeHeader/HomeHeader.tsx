import React from 'react';
import {View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HomeHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: insets.top + 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        zIndex: 10,
        paddingTop: insets.top,
      }}>
      <CustomText
        fontWeight="600"
        style={{
          fontSize: 28,
        }}>
        Cheering
      </CustomText>
    </View>
  );
};

export default HomeHeader;
