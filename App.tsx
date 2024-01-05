/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import styled from 'styled-components/native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <StyledText>Hello</StyledText>
    </SafeAreaView>
  );
}

const StyledText = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: blue;
`;

export default App;
