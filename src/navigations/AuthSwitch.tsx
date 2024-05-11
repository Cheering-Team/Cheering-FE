import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import SignInScreen from '../screens/SignInScreen';
import EncryptedStorage from 'react-native-encrypted-storage';
import IntroScreen from '../screens/IntroScreen';
import SetPassword from '../screens/SetPassword';
import SetNickname from '../screens/SetNickname';
import SignUpComplete from '../screens/SignUpComplete';
import SplashScreen from '../screens/SplashScreen';
import CustomText from '../components/CustomText';
import Toast from 'react-native-toast-message';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';

import CustomTabBar from '../components/CustomHomeTab';
import ChatScreen from '../screens/ChatScreen';
import MyPlayerScreen from '../screens/MyPlayerScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Intro: undefined;
  SignIn: undefined;
  SetPassword: {email: string};
  SetNickname: {email: string; pw: string; pwConfirm: string};
  SignUpComplete: {access: string; refresh: string};
};

interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

type AuthAction =
  | {type: 'RESTORE_TOKEN'; access: string | null; refresh: string | null}
  | {type: 'SIGN_IN'; access: string | null; refresh: string | null}
  | {type: 'SIGN_OUT'};

interface AuthContextType {
  signIn: (access: string, refresh: string) => void;
  signOut: () => void;
  signUp: (access: string, refresh: string) => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthSwitch = () => {
  const [state, dispatch] = React.useReducer(
    (prevState: AuthState, action: AuthAction): AuthState => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            accessToken: action.access,
            refreshToken: action.refresh,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            accessToken: action.access,
            refreshToken: action.refresh,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isSignout: true,
          };
        default:
          return prevState;
      }
    },
    {isLoading: true, isSignout: false, accessToken: null, refreshToken: null},
  );

  React.useEffect(() => {
    const restoreTokenAsync = async () => {
      let accessToken = null;
      let refreshToken = null;

      try {
        accessToken = await EncryptedStorage.getItem('accessToken');
        refreshToken = await EncryptedStorage.getItem('refreshToken');
      } catch (e) {
        dispatch({type: 'SIGN_OUT'});
      }
      if (accessToken && refreshToken) {
        dispatch({
          type: 'RESTORE_TOKEN',
          access: accessToken,
          refresh: refreshToken,
        });
      } else {
        dispatch({type: 'SIGN_OUT'});
      }
    };

    restoreTokenAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (access: string, refresh: string) => {
        try {
          await EncryptedStorage.setItem('accessToken', access);
          await EncryptedStorage.setItem('refreshToken', refresh);
        } catch (e) {
          // 에러 처리
        }
        dispatch({type: 'SIGN_IN', access, refresh});
      },
      signOut: async () => {
        try {
          await EncryptedStorage.removeItem('accessToken');
          await EncryptedStorage.removeItem('refreshToken');
        } catch (e) {
          // 에러 처리
        }
        dispatch({type: 'SIGN_OUT'});
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          bottomOffset: 30,
          text1: '로그아웃 되었습니다.',
        });
      },

      signUp: async (access: string, refresh: string) => {
        try {
          await EncryptedStorage.setItem('accessToken', access);
          await EncryptedStorage.setItem('refreshToken', refresh);
        } catch (e) {
          // 에러 처리
        }
        dispatch({type: 'SIGN_IN', access, refresh});
      },
    }),
    [],
  );

  const Stack = createNativeStackNavigator<AuthStackParamList>();

  const Tab = createBottomTabNavigator();

  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : state.accessToken == null ? (
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
            name="SetNickname"
            component={SetNickname}
            options={{
              headerTitle: () => (
                <CustomText fontWeight="500" style={{fontSize: 21}}>
                  닉네임 입력
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
      ) : (
        <Tab.Navigator
          initialRouteName="HomeStack"
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
            tabBarShowLabel: false,
          }}>
          <Tab.Screen
            name="MyPlayer"
            component={MyPlayerScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="HomeStack"
            component={HomeStackNavigator}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      )}
    </AuthContext.Provider>
  );
};

export default AuthSwitch;
