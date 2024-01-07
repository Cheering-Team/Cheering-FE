import {Button, TextInput, View} from 'react-native';
import * as React from 'react';
import {AuthContext} from '../navigators/AuthSwitch';

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const authContext = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => authContext?.signIn()} />
    </View>
  );
}
export default SignInScreen;
