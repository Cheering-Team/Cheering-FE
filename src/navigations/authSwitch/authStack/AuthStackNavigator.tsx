import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignInScreen from './screens/SignInScreen';
import {User} from 'apis/user/types';
import LogoSvg from 'assets/images/logo-text.svg';
import PrivacyPolicyScreen from 'screens/moreStack/PrivacyPolicyScreen';
import IntroScreen from './screens/IntroScreen';
import SetNickNameScreen from './screens/SetNicknameScreen';
import PhoneVerifyScreen from './screens/PhoneVerifyScreen';
import SocialConnectScreen from './screens/SocialConnectScreen';
import AgreeTermScreen from './screens/AgreeTermScreen';

export type AuthStackParamList = {
  Intro: undefined;
  SignIn: undefined;
  SetNickname: {phone: string};
  AgreeTerm: {
    phone?: string;
    accessToken?: string;
    type?: 'kakao' | 'naver' | 'apple';
  };
  PhoneVerify: {
    accessToken: string;
    type: 'kakao' | 'naver' | 'apple';
  };
  SocialConnect: {
    accessToken: string;
    user: User;
    type: 'kakao' | 'naver' | 'apple';
  };
  PrivacyPolicy: undefined;
};

const AuthStackNavigator = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator screenOptions={{animation: 'ios_from_right'}}>
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerTitle: () => <LogoSvg width={200} height={50} />,
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="SetNickname"
        component={SetNickNameScreen}
        options={{
          headerTitle: () => <LogoSvg width={200} height={50} />,
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="PhoneVerify"
        component={PhoneVerifyScreen}
        options={{
          headerTitle: () => <LogoSvg width={200} height={50} />,
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="AgreeTerm"
        component={AgreeTermScreen}
        options={{
          headerTitle: () => <LogoSvg width={200} height={50} />,
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="SocialConnect"
        component={SocialConnectScreen}
        options={{
          headerTitle: () => <LogoSvg width={200} height={50} />,
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
