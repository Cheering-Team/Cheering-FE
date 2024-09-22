import React, {useContext} from 'react';
import Close from '../../hooks/Close';
import {SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthContext} from '../../navigations/AuthSwitch';
import {useConnectSocial, useSaveFCMToken} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from 'navigations/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

type SocialConnectScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SocialConnect'
>;

type SocialConnectScreenRouteProp = RouteProp<
  AuthStackParamList,
  'SocialConnect'
>;

const SocialConnectScreen = ({
  navigation,
  route,
}: {
  navigation: SocialConnectScreenNavigationProp;
  route: SocialConnectScreenRouteProp;
}) => {
  Close(navigation);
  const {accessToken, user, type} = route.params;

  const insets = useSafeAreaInsets();
  const signIn = useContext(AuthContext)?.signIn;

  const {mutateAsync: connectSocial} = useConnectSocial();

  const handleConnectSocial = async () => {
    const data = await connectSocial({
      accessToken,
      type,
      userId: user.id,
    });
    if (data.message === '계정이 연결되었습니다.') {
      const {accessToken: sessionToken, refreshToken} = data.result;
      showTopToast(insets.top + 20, data.message);
      signIn?.(sessionToken, refreshToken);
      return;
    }
  };

  const formatDate = (date: string) => {
    date = date.substring(0, 10);
    const [year, month, day] = date.split('-');

    return `${year}년 ${month}월 ${day}일 가입`;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-5">
        <CustomText fontWeight="500" className="text-[22px] mb-[5]">
          이미 아이디가 있어요
        </CustomText>
        <CustomText className="text-gray-500 text-base mt-[1]">
          해당 휴대폰 번호로 가입된 아이디가 있어요
        </CustomText>
        <CustomText className="text-gray-500 text-base mt-[1]">
          아이디와 SNS계정을 연결해드릴게요
        </CustomText>
        <View className="mt-[50] border border-gray-300 rounded p-4">
          <CustomText fontWeight="500" className="text-lg">
            {user.nickname}
          </CustomText>
          <CustomText className="text-base">{user.phone}</CustomText>
          <CustomText fontWeight="500" className="text-zinc-400">
            {user.createdAt && formatDate(user.createdAt)}
          </CustomText>
        </View>
      </View>
      <View className="p-4">
        <CustomButton
          type="normal"
          text="연결하기"
          onPress={handleConnectSocial}
        />
      </View>
    </SafeAreaView>
  );
};

export default SocialConnectScreen;
