import React from 'react';
import {ActivityIndicator} from 'react-native';
import {AuthContext} from '../../navigations/authSwitch/AuthSwitch';
import {showTopToast} from 'utils/toast';

const SignOutScreen = () => {
  const signOut = React.useContext(AuthContext)?.signOut;

  React.useEffect(() => {
    signOut?.();

    showTopToast({message: '로그아웃 완료'});
  }, [signOut]);

  return <ActivityIndicator />;
};

export default SignOutScreen;
