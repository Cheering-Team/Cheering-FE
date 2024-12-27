import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';

export const useDarkStatusBar = () => {
  useFocusEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });
};
