import CustomText from 'components/common/CustomText';
import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CloseSvg from 'assets/images/close-black.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {useNavigation} from '@react-navigation/native';

const ChatRoomEnterLoading = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <SafeAreaView className="flex-1">
      <Pressable className="p-2" onPress={() => navigation.goBack()}>
        <CloseSvg width={35} height={35} />
      </Pressable>
      <View className="flex-1 justify-center items-center mb-[100]">
        <CustomText fontWeight="600" className="text-2xl mb-5">
          입장중입니다..
        </CustomText>
        <ActivityIndicator size={'small'} />
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomEnterLoading;
