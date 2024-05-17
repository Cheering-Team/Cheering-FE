import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from '../screens/SplashScreen';
import Toast from 'react-native-toast-message';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import CustomTabBar from '../components/CustomHomeTab';
import ChatScreen from '../screens/ChatScreen';
import MyPlayerScreen from '../screens/MyPlayerScreen';
import AuthStack from './AuthStack';

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

  const Stack = createNativeStackNavigator<{Splash: undefined}>();

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
        <AuthStack />
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
