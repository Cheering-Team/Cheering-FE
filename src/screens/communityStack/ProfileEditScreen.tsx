import React, {useRef, useState} from 'react';
import {ImageBackground, Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import BackSvg from '../../../assets/images/arrow-left.svg';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import CameraSvg from '../../../assets/images/camera-01.svg';
import ImagePicker from 'react-native-image-crop-picker';
import OptionModal, {
  closeModalHandle,
} from '../../components/common/OptionModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getPlayerUserInfo, updatePlayerUserImage} from '../../apis/player';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ProfileEditScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const closeModalRef = useRef<closeModalHandle>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data, isLoading} = useQuery({
    queryKey: ['playerusers', playerUserId],
    queryFn: getPlayerUserInfo,
  });

  const mutation = useMutation({
    mutationFn: updatePlayerUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playerusers', playerUserId],
      });
    },
  });

  const imageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropperCircleOverlay: true,
        cropping: true,
        cropperChooseText: '확인',
        cropperCancelText: '취소',
        cropperToolbarTitle: '사진 선택',
      });

      const updateData = await mutation.mutateAsync({
        playerUserId: playerUserId,
        image: {uri: image.path, name: image.filename || '', type: image.mime},
      });

      if (updateData.message === '프로필 이미지를 수정했습니다.') {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: insets.top + 20,
          text1: '수정이 완료되었습니다.',
        });

        closeModalRef?.current?.closeModal();
      }
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const imageDelete = async () => {
    const updateData = await mutation.mutateAsync({
      playerUserId: playerUserId,
      image: null,
    });

    if (updateData.message === '프로필 이미지를 수정했습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '삭제가 완료되었습니다.',
      });

      closeModalRef?.current?.closeModal();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" style={{fontSize: 20}}>
          내 정보 수정
        </CustomText>
        <View style={{width: 32, height: 32}} />
      </View>
      <View style={{padding: 20, alignItems: 'center'}}>
        <Pressable
          onPress={() => {
            setIsModalOpen(true);
          }}
          style={{
            borderRadius: 95,
            backgroundColor: '#7fb677',
          }}>
          <ImageBackground
            source={{
              uri: data.result.user.image,
            }}
            style={{
              width: 95,
              height: 95,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            imageStyle={{borderRadius: 95}}>
            <CameraSvg width={27} height={27} />
          </ImageBackground>
        </Pressable>
        <Pressable
          style={{
            width: '100%',
            marginTop: 35,
            borderWidth: 1,
            borderColor: '#e5e5e5',
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate('EditNickname', {
              nickname: data.result.user.nickname,
              playerUserId: data.result.user.id,
            })
          }>
          <CustomText fontWeight="600" style={{fontSize: 18}}>
            닉네임
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              fontWeight="500"
              style={{
                color: '#a0a0a0',
                fontSize: 17,
                marginRight: 3,
              }}>
              {data.result.user.nickname}
            </CustomText>
            <ChevronRightSvg width={13} height={13} />
          </View>
        </Pressable>
      </View>
      {data.result.user.image ===
      'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/default-profile.jpg' ? (
        <OptionModal
          ref={closeModalRef}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="내 사진 선택"
          option1Press={imageUpload}
        />
      ) : (
        <OptionModal
          ref={closeModalRef}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="내 사진 선택"
          option2Text="현재 사진 삭제"
          option2color="#fe6363"
          option1Press={imageUpload}
          option2Press={imageDelete}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
