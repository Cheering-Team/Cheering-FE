import React from 'react';
import {Pressable, SafeAreaView} from 'react-native';
import CustomText from '../components/CustomText';
import {AuthContext} from '../navigations/AuthSwitch';

const SettingScreen = () => {
  const signOut = React.useContext(AuthContext)?.signOut;

  return (
    <SafeAreaView>
      <Pressable style={{padding: 20}} onPress={signOut}>
        <CustomText style={{color: '#ec5050', fontSize: 16}} fontWeight="500">
          로그아웃
        </CustomText>
      </Pressable>
    </SafeAreaView>
  );
};

export default SettingScreen;
