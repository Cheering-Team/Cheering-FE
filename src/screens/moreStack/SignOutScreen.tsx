import React from 'react';
import {ActivityIndicator} from 'react-native';
import {AuthContext} from '../../navigations/AuthSwitch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showTopToast} from 'utils/toast';

const SignOutScreen = () => {
  const signOut = React.useContext(AuthContext)?.signOut;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    signOut?.();

    showTopToast(insets.top + 10, '로그아웃 완료');
  }, [insets.top, signOut]);

  return <ActivityIndicator></ActivityIndicator>;
};

export default SignOutScreen;
