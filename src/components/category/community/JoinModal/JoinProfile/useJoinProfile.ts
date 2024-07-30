import {useQuery} from '@tanstack/react-query';
import {getCheckNickname} from '../../../../../apis/player';
import ImagePicker from 'react-native-image-crop-picker';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {NICKNAME_REGEX} from '../../../../../constants/regex';
import {ImageType} from '../JoinModal';
import {Keyboard} from 'react-native';

export const useJoinProfile = (
  playerId: number,
  nickname: string,
  setImageData: Dispatch<SetStateAction<ImageType>>,
  setJoinState: Dispatch<SetStateAction<'profile' | 'term'>>,
) => {
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');

  const {
    data: nicknameCheckData,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['nickname'],
    queryFn: () => getCheckNickname({playerId, nickname}),
    enabled: false,
    gcTime: 0,
  });

  const imageUpload = async () => {
    try {
      Keyboard.dismiss();
      const image = await ImagePicker.openPicker({
        cropperCircleOverlay: true,
        cropping: true,
        cropperChooseText: '확인',
        cropperCancelText: '취소',
        cropperToolbarTitle: '사진 선택',
      });

      setImageData({
        uri: image.path,
        name: image.filename || '',
        type: image.mime,
      });
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const checkNickname = async () => {
    if (!NICKNAME_REGEX.test(nickname)) {
      setIsNicknameValid(false);
      setNicknameInvalidMessage('2자~20자, 한글과 영어만 사용 가능합니다.');
      return;
    }
    refetch();
  };

  useEffect(() => {
    if (nicknameCheckData?.message === '이미 존재하는 닉네임입니다.') {
      setIsNicknameValid(false);
      setNicknameInvalidMessage('이미 존재하는 닉네임입니다.');

      return;
    }
    if (nicknameCheckData?.message === '사용 가능한 닉네임 입니다.') {
      setJoinState('term');
      return;
    }
  }, [isRefetching, nicknameCheckData?.message, setJoinState]);

  return {
    isNicknameValid,
    nicknameInvalidMessage,
    imageUpload,
    checkNickname,
    setIsNicknameValid,
  };
};
