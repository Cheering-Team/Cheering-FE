import React, {useRef, useState} from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import ChevronRightSvg from '../../assets/images/chevron-right-gray.svg';
import CameraSvg from '../../assets/images/camera-01.svg';
import OptionModal from '../../components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import {Image} from 'react-native-compressor';
import LoadingOverlay from 'components/common/LoadingOverlay';
import {useGetFanInfo, useUpdateFanImage} from 'apis/fan/useFans';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ProfileEditScreen = () => {
  useDarkStatusBar();
  const {fanId, type} =
    useRoute<RouteProp<CommunityStackParamList, 'ProfileEdit'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

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
        type,
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
      type,
      image: null,
    });
  };

  if (isLoading || !profile) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <LoadingOverlay isLoading={imageLoding} type="LOADING" />
      <CCHeader
        title={
          type === 'COMMUNITY' ? '커뮤니티 프로필 수정' : '모임 프로필 수정'
        }
        scrollY={scrollY}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingHorizontal: 20,
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            bottomSheetModalRef.current?.present();
          }}
          style={{
            borderRadius: 95,
            backgroundColor: 'white',
          }}
          className="border border-gray-200">
          <ImageBackground
            source={{
              uri: type === 'COMMUNITY' ? profile.image : profile.meetImage,
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
              name: type === 'COMMUNITY' ? profile.name : profile.meetName,
              type,
              fanId: profile.id,
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
              {type === 'COMMUNITY' ? profile.name : profile.meetName}
            </CustomText>
            <ChevronRightSvg width={13} height={13} />
          </View>
        </Pressable>
      </Animated.ScrollView>
      {(type === 'COMMUNITY' &&
        profile.image ===
          'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/profile-image.jpg') ||
      (type === 'MEET' &&
        profile.meetImage ===
          'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/profile-image.jpg') ? (
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
    </View>
  );
};

export default ProfileEditScreen;
