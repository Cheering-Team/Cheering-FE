import Toast from 'react-native-toast-message';

interface ShowToastProps {
  type?: 'success' | 'fail';
  message: string;
  autoHide?: boolean;
}

export const showBottomToast = ({
  type = 'success',
  message,
  autoHide = true,
}: ShowToastProps) => {
  Toast.show({
    type,
    position: 'bottom',
    visibilityTime: 2500,
    autoHide: autoHide,
    text1: message,
  });
};

export const showTopToast = ({
  type = 'success',
  message,
  autoHide = true,
}: ShowToastProps) => {
  Toast.show({
    type,
    position: 'top',
    visibilityTime: 2500,
    autoHide: autoHide,
    text1: message,
  });
};

export const hideToast = () => {
  Toast.hide();
};
