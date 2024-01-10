import React from 'react';
import {Pressable} from 'react-native';
import CloseButtonSvg from '../../assets/images/x.svg';

const BackClose = navigation => {
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <CloseButtonSvg />
        </Pressable>
      ),
    });
  });
};

export default BackClose;
