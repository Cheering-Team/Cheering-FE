import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import SignInScreen from '../screens/SingInScreen';
import HomeScreen from '../screens/HomeScreen';
import EncryptedStorage from 'react-native-encrypted-storage';
import IntroScreen from '../screens/IntroScreen';

interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
}

type AuthAction =
  | {type: 'RESTORE_TOKEN'; token: string | null}
  | {type: 'SIGN_IN'; token: string | null}
  | {type: 'SIGN_OUT'};

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  signUp: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const Stack = createNativeStackNavigator();

const AuthSwitch = () => {
  const [state, dispatch] = React.useReducer(
    (prevState: AuthState, action: AuthAction): AuthState => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
            isSignout: true,
          };
        default:
          return prevState;
      }
    },
    {isLoading: true, isSignout: false, userToken: null},
  );

  React.useEffect(() => {
    const restoreTokenAsync = async () => {
      let userToken;

      try {
        userToken = await EncryptedStorage.getItem('token');
      } catch (e) {
        dispatch({type: 'SIGN_OUT'});
      }
      if (userToken) {
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      } else {
        dispatch({type: 'SIGN_OUT'});
      }
    };

    restoreTokenAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.userToken == null ? (
          <>
            <Stack.Screen
              name="Intro"
              component={IntroScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default AuthSwitch;
