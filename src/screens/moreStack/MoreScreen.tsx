import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import SettingSvg from '../../../assets/images/setting-svg.svg';
import CustomText from '../../components/common/CustomText';
import {useGetUserInfo} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MoreStackParamList} from 'navigations/MoreStackNavigator';

type MoreScreenNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  'More'
>;

const MoreScreen = ({navigation}: {navigation: MoreScreenNavigationProp}) => {
  const {data, isLoading} = useGetUserInfo();

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center">
          <Pressable
            className="flex-row items-center"
            onPress={() => navigation.navigate('MyProfile')}>
            <CustomText fontWeight="600" className="text-xl mr-1 pb-[1]">
              {data?.result.nickname}
            </CustomText>
            <ChevronRightSvg width={14} height={14} />
          </Pressable>
          <SettingSvg width={23} height={23} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreScreen;
