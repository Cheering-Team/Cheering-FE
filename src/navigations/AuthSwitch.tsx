import * as React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import {deleteFCMToken, getVersionInfo} from 'apis/user';
import {queryClient} from '../../App';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'screens/auth/SplashScreen';
import {Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import NativeSplash from 'react-native-splash-screen';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import FastImage from 'react-native-fast-image';
import OneButtonModal from 'components/common/OneButtonModal';
import {VersionInfo} from 'apis/user/types';

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
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [versionInfo, setVersionInfo] = React.useState<VersionInfo | null>(
    null,
  );
  const {data: communities, refetch} = useGetMyCommunities(false);

  React.useEffect(() => {
    NativeSplash.hide();
    const checkVersion = async () => {
      try {
        const data = await getVersionInfo();
        setVersionInfo(data);
        const currentVersion = VersionCheck.getCurrentVersion();
        const accessToken = await EncryptedStorage.getItem('accessToken');

        VersionCheck.needUpdate({
          currentVersion,
          latestVersion: data.minSupportedVersion,
        }).then(res => {
          if (res.isNeeded) {
            setIsUpdate(true);
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
  }, [refetch]);

  React.useEffect(() => {
    if (communities) {
      if (communities.length) {
        if (communities[0].backgroundImage) {
          FastImage.preload([{uri: communities[0].backgroundImage}]);
        }
        if (communities[0].image) {
          FastImage.preload([{uri: communities[0].image}]);
        }
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
      {isUpdate && versionInfo && (
        <OneButtonModal
          title="업데이트"
          content="새 기능들이 출시됐어요. 지금 바로 업데이트 해보세요."
          buttonTitle="업데이트"
          onButtonPress={() =>
            Linking.openURL(
              Platform.OS === 'ios' ? versionInfo.iosUrl : versionInfo.aosUrl,
            )
          }
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthSwitch;
