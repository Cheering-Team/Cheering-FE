import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../CustomText';
import {useNavigation} from '@react-navigation/native';
import BackSvg from '../../../../assets/images/chevron-left.svg';

interface StackHeaderProps {
  title: string;
}

const StackHeader = (props: StackHeaderProps) => {
  const {title} = props;
  const navigation = useNavigation();

  return (
    <View className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]">
      <Pressable onPress={() => navigation.goBack()}>
        <BackSvg width={32} height={32} />
      </Pressable>

      <CustomText fontWeight="500" className="text-lg pb-0">
        {title}
      </CustomText>
      <View className="w-8 h-8" />
    </View>
  );
};

export default StackHeader;
