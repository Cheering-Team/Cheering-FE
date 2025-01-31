import React, {useContext, useRef, useState} from 'react';
import BackClose from 'hooks/BackClose';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomText from 'components/common/CustomText';
import {View} from 'react-native';
import {AuthContext} from 'navigations/authSwitch/AuthSwitch';
import PhoneVerify from 'components/auth/phoneVerify';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from 'navigations/authStack/AuthStackNavigator';
import {RouteProp} from '@react-navigation/native';

type PhoneVerifyScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneVerify'
>;

type PhoneVerifyScreenRouteProp = RouteProp<AuthStackParamList, 'PhoneVerify'>;

const PhoneVerifyScreen = ({
  navigation,
  route,
}: {
  navigation: PhoneVerifyScreenNavigationProp;
  route: PhoneVerifyScreenRouteProp;
}) => {
  BackClose(navigation);
  const {accessToken, type} = route.params;

  const signIn = useContext(AuthContext)?.signIn;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'phone' | 'code'>('phone');

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={-200}
      keyboardShouldPersistTaps="handled"
      className="flex-1 p-5">
      <View className="mt-[5]">
        <CustomText fontWeight="500" className="text-xl ml-1">
          서비스 이용을 위해 최초 1회
        </CustomText>
        <CustomText fontWeight="500" className="text-xl ml-1 mb-3">
          휴대폰 인증이 필요합니다
        </CustomText>
      </View>

      <PhoneVerify
        status={status}
        setStatus={setStatus}
        phone={phone}
        setPhone={setPhone}
        timerRef={timerRef}
        signIn={signIn}
        type={type}
        accessToken={accessToken}
      />
    </KeyboardAwareScrollView>
  );
};

export default PhoneVerifyScreen;
