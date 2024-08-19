import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import IntroScreen from '../screens/auth/IntroScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SetNickNameScreen from '../screens/auth/SetNicknameScreen';
import CustomText from '../components/common/CustomText';
import PhoneVerifyScreen from '../screens/auth/PhoneVerifyScreen';
import SocialConnectScreen from '../screens/auth/SocialConnectScreen';
import {User} from '../types/user';

export type AuthStackParamList = {
  Intro: undefined;
  SignIn: undefined;
  SetNickname: {phone: string};
  PhoneVerify: {accessToken: string};
  SocialConnect: {accessToken: string; user: User; type: 'kakao' | 'naver'};
};

const AuthStack = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerTitle: () => (
            <CustomText
              fontWeight="700"
              style={{
                fontSize: 30,
                letterSpacing: 1.1,
              }}>
              cheering
            </CustomText>
          ),
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
          headerTitle: () => (
            <CustomText
              fontWeight="700"
              style={{
                fontSize: 30,
                letterSpacing: 1.1,
              }}>
              cheering
            </CustomText>
          ),
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
          headerTitle: () => (
            <CustomText
              fontWeight="700"
              style={{
                fontSize: 30,
                letterSpacing: 1.1,
              }}>
              cheering
            </CustomText>
          ),
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
          headerTitle: () => (
            <CustomText
              fontWeight="700"
              style={{
                fontSize: 30,
                letterSpacing: 1.1,
              }}>
              cheering
            </CustomText>
          ),
          contentStyle: {
            borderBottomWidth: 0,
          },
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
