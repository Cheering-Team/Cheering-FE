import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';

export const showBottomToast = (
  offset: number,
  message: string,
  autoHide: boolean = true,
) => {
  Toast.show({
    type: Platform.OS === 'android' ? 'success' : 'successBlur',
    position: 'bottom',
    visibilityTime: 2500,
    autoHide: autoHide,
    bottomOffset: offset,
    text1: message,
  });
};

export const showTopToast = (
  offset: number,
  message: string,
  autoHide: boolean = true,
) => {
  Toast.show({
    type: Platform.OS === 'android' ? 'success' : 'successBlur',
    position: 'top',
    visibilityTime: 2500,
    autoHide: autoHide,
    topOffset: offset,
    text1: message,
  });
};

export const hideToast = () => {
  Toast.hide();
};
