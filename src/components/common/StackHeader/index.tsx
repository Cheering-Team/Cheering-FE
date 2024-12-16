import React from 'react';
import {Platform, Pressable, View} from 'react-native';
import CustomText from '../CustomText';
import {useNavigation} from '@react-navigation/native';
import BackSvg from '../../../assets/images/chevron-left.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CloseSvg from '../../../assets/images/close-black.svg';

interface StackHeaderProps {
  title?: string;
  type?: 'back' | 'close' | 'none';
}

const StackHeader = (props: StackHeaderProps) => {
  const {title, type = 'back'} = props;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-slate-50"
      style={Platform.OS === 'android' && {marginTop: insets.top}}>
      {type === 'back' && (
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>
      )}
      {type === 'close' && (
        <Pressable onPress={() => navigation.goBack()}>
          <CloseSvg width={32} height={32} />
        </Pressable>
      )}
      {type === 'none' && <View className="w-8 h-8" />}

      <CustomText fontWeight="600" className="text-[17px] pb-0">
        {title}
      </CustomText>
      <View className="w-8 h-8" />
    </View>
  );
};

export default StackHeader;
