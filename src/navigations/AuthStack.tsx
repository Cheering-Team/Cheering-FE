import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import IntroScreen from '../screens/IntroScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import CustomText from '../components/CustomText';
import PhoneCodeScreen from '../screens/auth/PhoneCodeScreen';
import SetPassword from '../screens/SetPassword';
import SignUpComplete from '../screens/SignUpComplete';
import {User} from '../apis/user';
import SetNickNameScreen from '../screens/auth/SetNicknameScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Intro: undefined;
  SignIn: undefined;
  PhoneCode: {user: User | null; phone: string};
  SetNickname: {phone: string; code: string};
  SetPassword: {email: string};
  SignUpComplete: {access: string; refresh: string};
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
        name="PhoneCode"
        component={PhoneCodeScreen}
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
        name="SetPassword"
        component={SetPassword}
        options={{
          headerTitle: () => (
            <CustomText fontWeight="500" style={{fontSize: 21}}>
              회원가입
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="SignUpComplete"
        component={SignUpComplete}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
