import React from 'react';
import {Pressable} from 'react-native';
import CloseButtonSvg from '../../assets/images/x.svg';
import BackBtnSvg from '../../assets/images/chevron-left.svg';

const BackClose = navigation => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <BackBtnSvg />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={() => navigation.popToTop()}>
          <CloseButtonSvg />
        </Pressable>
      ),
    });
  });
};

export default BackClose;
