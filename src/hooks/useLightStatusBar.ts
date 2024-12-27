import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';

export const useLightStatusBar = () => {
  useFocusEffect(() => {
    StatusBar.setBarStyle('light-content');
  });
};
