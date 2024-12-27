import React, {useRef, useState} from 'react';
import {ImageBackground, Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import ChevronRightSvg from '../../assets/images/chevron-right-gray.svg';
import CameraSvg from '../../assets/images/camera-01.svg';
import OptionModal from '../../components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import StackHeader from 'components/common/StackHeader';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import {Image} from 'react-native-compressor';
import LoadingOverlay from 'components/common/LoadingOverlay';
import {useGetFanInfo, useUpdateFanImage} from 'apis/fan/useFans';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

const ProfileEditScreen = ({route}) => {
  useDarkStatusBar();
  const {fanId} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [imageLoding, setImageLoding] = useState(false);

  const {data: profile, isLoading} = useGetFanInfo(fanId);

  const {mutate} = useUpdateFanImage();

  const imageUpload = async () => {
    try {
      setImageLoding(true);
      const response = await openPicker({
        usedCameraButton: true,
        mediaType: 'image',
        singleSelectedMode: true,
        isCrop: true,
        isCropCircle: true,
        doneTitle: '추가',
        cancelTitle: '취소',
        emptyMessage: '사진이 하나도 없네요',
        tapHereToChange: '앨범',
        selectedColor: '#0988ff',
      });

      const result = await Image.compress(response.crop.path, {
        compressionMethod: 'manual',
        maxWidth: 1600,
        quality: 0.7,
      });

      mutate({
        fanId: fanId,
        image: {
          uri: result,
          name: response.fileName || '',
          type: response.mime,
        },
      });
    } catch (e) {
      //
    } finally {
      setImageLoding(false);
    }
  };

  const imageDelete = async () => {
    mutate({
      fanId: fanId,
      image: null,
    });
  };

  if (isLoading) {
    return null;
  }

  if (profile) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <LoadingOverlay isLoading={imageLoding} type="LOADING" />
        <StackHeader title="내 정보 수정" type="back" />
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
                uri: profile.fan.image,
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
              navigation.navigate('EditName', {
                name: profile.fan.name,
                fanId: profile.fan.id,
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
                {profile.fan.name}
              </CustomText>
              <ChevronRightSvg width={13} height={13} />
            </View>
          </Pressable>
        </View>
        {profile.fan.image ===
        'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/profile-image.jpg' ? (
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
  }
};

export default ProfileEditScreen;
