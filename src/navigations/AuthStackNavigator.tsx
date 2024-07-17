import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import IntroScreen from '../screens/auth/IntroScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import PhoneCodeScreen from '../screens/auth/PhoneCodeScreen';
import {User} from '../apis/user';
import SetNickNameScreen from '../screens/auth/SetNicknameScreen';
import CustomText from '../components/common/CustomText';

export type AuthStackParamList = {
  Splash: undefined;
  Intro: undefined;
  SignIn: undefined;
  PhoneCode: {user: User | null; phone: string};
  SetNickname: {phone: string};
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
    </Stack.Navigator>
  );
};

export default AuthStack;
