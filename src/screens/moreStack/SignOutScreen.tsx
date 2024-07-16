import React from 'react';
import {ActivityIndicator} from 'react-native';
import {AuthContext} from '../../navigations/AuthSwitch';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SignOutScreen = () => {
  const signOut = React.useContext(AuthContext)?.signOut;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    signOut?.();

    Toast.show({
      type: 'default',
      position: 'top',
      visibilityTime: 3000,
      topOffset: insets.top + 20,
      text1: '로그아웃되었습니다.',
    });
  }, [insets.top, signOut]);

  return <ActivityIndicator></ActivityIndicator>;
};

export default SignOutScreen;
