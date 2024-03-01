import React from 'react';
import {ActivityIndicator} from 'react-native';
import {AuthContext} from '../navigations/AuthSwitch';

const SignOutScreen = () => {
  const signOut = React.useContext(AuthContext)?.signOut;

  React.useEffect(() => {
    signOut?.();
  }, [signOut]);

  return <ActivityIndicator></ActivityIndicator>;
};

export default SignOutScreen;
