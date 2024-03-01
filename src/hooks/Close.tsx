import React from 'react';
import {Pressable} from 'react-native';
import CloseButtonSvg from '../../assets/images/x.svg';

const Close = navigation => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <CloseButtonSvg />
        </Pressable>
      ),
    });
  });
};

export default Close;
