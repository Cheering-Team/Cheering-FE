import Toast from 'react-native-toast-message';

export const showBottomToast = (
  offset: number,
  message: string,
  autoHide: boolean = true,
) => {
  Toast.show({
    type: 'default',
    position: 'bottom',
    visibilityTime: 2000,
    autoHide: autoHide,
    bottomOffset: offset,
    text1: message,
  });
};

export const hideToast = () => {
  Toast.hide();
};
