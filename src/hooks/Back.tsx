import React from 'react';
import {Pressable} from 'react-native';
import BackBtnSvg from '../assets/images/chevron-left.svg';

const Back = navigation => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <BackBtnSvg />
        </Pressable>
      ),
    });
  });
};

export default Back;
