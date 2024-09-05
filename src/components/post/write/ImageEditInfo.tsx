import React from 'react';
import {Animated, View} from 'react-native';
import CustomText from '../../common/CustomText';

interface ImageEditInfoProps {
  fadeAnim: Animated.Value;
}

const ImageEditInfo = (props: ImageEditInfoProps) => {
  const {fadeAnim} = props;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: 'black',
          alignSelf: 'flex-start',
          marginLeft: 10,
          padding: 5,
          borderRadius: 5,
          marginBottom: 10,
          alignItems: 'center',
        },
        {opacity: fadeAnim},
      ]}>
      <CustomText style={{color: 'white'}}>
        사진을 길게 눌러 순서를 조정할 수 있어요
      </CustomText>
      <View
        style={{
          position: 'absolute',
          bottom: -4,
          borderRadius: 2,
          width: 10,
          height: 10,
          backgroundColor: 'black',
          transform: [{rotate: '45deg'}],
        }}
      />
    </Animated.View>
  );
};

export default ImageEditInfo;
