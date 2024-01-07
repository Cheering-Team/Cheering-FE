import React from 'react';
import {Button, Text, View} from 'react-native';
import {AuthContext} from '../navigators/AuthSwitch';

const HomeScreen = () => {
  const authContext = React.useContext(AuthContext);

  return (
    <View>
      <Text>Home</Text>
      <Button title="Sign out" onPress={() => authContext?.signOut()} />
    </View>
  );
};

export default HomeScreen;
