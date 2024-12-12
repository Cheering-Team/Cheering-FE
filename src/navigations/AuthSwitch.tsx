import * as React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import {deleteFCMToken, getVersionInfo} from 'apis/user';
import {queryClient} from '../../App';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'screens/auth/SplashScreen';
import {Alert, Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import NativeSplash from 'react-native-splash-screen';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import FastImage from 'react-native-fast-image';

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
  const [isLoading, setIsLoading] = React.useState(true);
  const {data: communities, refetch} = useGetMyCommunities(false);

  React.useEffect(() => {
    NativeSplash.hide();
    const checkVersion = async () => {
      try {
        const data = await getVersionInfo();
        const currentVersion = VersionCheck.getCurrentVersion();
        const accessToken = await EncryptedStorage.getItem('accessToken');

        VersionCheck.needUpdate({
          currentVersion,
          latestVersion: data.minSupportedVersion,
        }).then(res => {
          if (res.isNeeded) {
            Alert.alert(
              '필수 업데이트',
              '새로운 기능들이 생겼어요\n5초만에 업데이트 해보세요',
              [
                {
                  text: '스토어로 이동',
                  onPress: () =>
                    Linking.openURL(
                      Platform.OS === 'ios' ? data.iosUrl : data.aosUrl,
                    ),
                },
              ],
              {cancelable: false}, // 앱 종료 방지
            );
          } else {
            if (accessToken) {
              refetch();
            } else {
              setTimeout(() => {
                setIsLoading(false);
              }, 1500);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    checkVersion();
  });

  React.useEffect(() => {
    if (communities) {
      if (communities.length) {
        FastImage.preload([
          {uri: communities[0].backgroundImage},
          {uri: communities[0].image},
        ]);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [communities]);

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
          const deviceId = await DeviceInfo.getUniqueId();
          await deleteFCMToken({deviceId});
          queryClient.removeQueries();
          await EncryptedStorage.removeItem('accessToken');
          await EncryptedStorage.removeItem('refreshToken');
        } catch (e) {
          // 에러 처리
        }
        dispatch({type: 'SIGN_OUT'});
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

  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading || isLoading ? (
        <SplashScreen />
      ) : state.accessToken == null ? (
        <AuthStackNavigator />
      ) : (
        <MainTabNavigator />
      )}
    </AuthContext.Provider>
  );
};

export default AuthSwitch;
