import React, {useRef} from 'react';
import {ImageBackground, Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import BackSvg from '../../../assets/images/arrow-left.svg';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import CameraSvg from '../../../assets/images/camera-01.svg';
import ImagePicker from 'react-native-image-crop-picker';
import OptionModal from '../../components/common/OptionModal';
import {
  useGetPlayerUserInfo,
  useUpdatePlayerUserImage,
} from '../../apis/player/usePlayers';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const ProfileEditScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data} = useGetPlayerUserInfo(playerUserId);

  const {mutate} = useUpdatePlayerUserImage();

  const imageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropperCircleOverlay: true,
        cropping: true,
        cropperChooseText: '확인',
        cropperCancelText: '취소',
        cropperToolbarTitle: '사진 선택',
      });
      mutate({
        playerUserId: playerUserId,
        image: {uri: image.path, name: image.filename || '', type: image.mime},
      });
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const imageDelete = async () => {
    mutate({
      playerUserId: playerUserId,
      image: null,
    });
  };

  if (!data) {
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
            bottomSheetModalRef.current?.present();
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
          modalRef={bottomSheetModalRef}
          firstText="내 사진 선택"
          firstOnPress={imageUpload}
        />
      ) : (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="내 사진 선택"
          secondText="현재 사진 삭제"
          secondColor="#fe6363"
          firstOnPress={imageUpload}
          secondOnPress={imageDelete}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
