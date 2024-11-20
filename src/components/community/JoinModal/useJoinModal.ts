import {Animated, Keyboard, PanResponder} from 'react-native';
import {SCREEN_HEIGHT} from '../../../constants/dimension';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ImageType} from './JoinModal';
import {postCommunityJoin} from '../../../apis/player';
import Toast from 'react-native-toast-message';

export const useJoinModal = (
  playerId,
  isModalOpen,
  setIsModalOpen,
  setRefreshKey,
) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [resetTarget, setResetTaget] = useState(0);
  const [joinState, setJoinState] = useState<'profile' | 'term'>('profile');
  const [imageData, setImageData] = useState<ImageType>({
    uri: '',
    name: '',
    type: '',
  });
  const [nickname, setNickname] = useState('');

  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-1, 0, 1],
  });

  const mutation = useMutation({
    mutationFn: postCommunityJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my', 'players'],
      });
    },
  });

  const joinCommunity = async () => {
    const joinData = await mutation.mutateAsync({
      playerId: playerId,
      nickname,
      image: imageData,
    });

    if (joinData.message === '커뮤니티 가입 완료') {
      closeModal();
      setRefreshKey((prev: number) => prev + 1);
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '커뮤니티 가입 완료',
      });
    }
  };

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setIsModalOpen(false);
    });
  };

  const resetBottomSheet = Animated.timing(panY, {
    toValue: resetTarget,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: SCREEN_HEIGHT,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
          if (gestureState.dy > 0) {
            panY.setValue(gestureState.dy + resetTarget);
          }
        },
        onPanResponderRelease: (event, gestureState) => {
          if (gestureState.dy > 0 && gestureState.vy > 1.3) {
            closeModal();
          } else {
            resetBottomSheet.start();
          }
        },
      }),
    [resetTarget],
  );

  const keyboardDidShow = useCallback(
    e => {
      Animated.timing(panY, {
        toValue: -e.endCoordinates.height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setResetTaget(-e.endCoordinates.height);
      });
    },
    [panY],
  );

  const keyboardDidHide = useCallback(e => {
    setResetTaget(0);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setImageData({uri: '', name: '', type: ''});
      setJoinState('profile');
      setNickname('');
    }
  }, [isModalOpen, setImageData, setJoinState, setNickname]);

  useEffect(() => {
    if (isModalOpen) {
      resetBottomSheet.start();
    }
  }, [isModalOpen, resetBottomSheet]);

  useEffect(() => {
    if (isModalOpen && resetTarget === 0) {
      resetBottomSheet.start();
    }
  }, [isModalOpen, resetBottomSheet, resetTarget]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardDidShow, keyboardDidHide]);

  return {
    joinState,
    setJoinState,
    imageData,
    setImageData,
    nickname,
    setNickname,
    joinCommunity,
    translateY,
    panResponders,
    closeModal,
  };
};
