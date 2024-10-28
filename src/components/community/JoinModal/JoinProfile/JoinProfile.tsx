import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {ImageBackground, Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../../common/CustomText';
import Avatar from '../../../common/Avatar';
import CustomButton from '../../../common/CustomButton';
import CameraSvg from '../../../../assets/images/camera-01.svg';
import {NAME_REGEX} from '../../../../constants/regex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBottomSheetTextInput from '../../../common/CustomBottomSheetTextInput';
import {showTopToast} from 'utils/toast';
import {Player} from 'apis/player/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import LoadingOverlay from 'components/common/LoadingOverlay';
import {Image} from 'react-native-compressor';
import {ImagePayload} from 'apis/post/types';
import {Community} from 'apis/community/types';
import {useJoinCommunity} from 'apis/community/useCommunities';

interface Props {
  community: Community;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
}

const JoinProfile = (props: Props) => {
  const {community, bottomSheetModalRef} = props;

  const insets = useSafeAreaInsets();

  const [imageData, setImageData] = useState<ImagePayload>({
    uri: '',
    name: '',
    type: '',
  });

  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');
  const [imageLoding, setImageLoding] = useState(false);

  const {mutateAsync: joinCommunity, isPending} = useJoinCommunity();

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
      setImageData({
        uri: response.path,
        name: response.fileName || '',
        type: response.mime,
      });
    } catch (e) {
      //
    } finally {
      setImageLoding(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!NAME_REGEX.test(nickname)) {
      setIsValid(false);
      setNicknameInvalidMessage(
        '2자~20자, 한글 영어 숫자 . _ 만 사용 가능합니다.',
      );
      return;
    }
    try {
      let result = '';
      if (imageData.uri) {
        result = await Image.compress(imageData.uri, {
          compressionMethod: 'manual',
          maxWidth: 1600,
          quality: 0.7,
        });
      }

      await joinCommunity({
        communityId: community.id,
        name: nickname,
        image: {uri: result, name: imageData.name, type: imageData.type},
      });
      bottomSheetModalRef.current?.dismiss();
      showTopToast(insets.top + 20, '가입 완료');
    } catch (error: any) {
      if (error.code === 2004) {
        setIsValid(false);
        setNicknameInvalidMessage('부적절한 닉네임입니다.');
      }
      if (error.code === 2007) {
        setIsValid(false);
        setNicknameInvalidMessage('이미 사용중인 이름입니다.');
      }
    }
  };

  return (
    <View className="flex-1 w-[90%] items-center mt-1">
      <LoadingOverlay isLoading={imageLoding} type="LOADING" />
      <LoadingOverlay isLoading={isPending} type="OVERLAY" />
      <View className="w-full items-center">
        <CustomText fontWeight="600" style={styles.profileTitle}>
          커뮤니티 가입
        </CustomText>
        <CustomText fontWeight="400" style={styles.profileInfo}>
          {`${community.koreanName}의 팬이 되신 걸 환영합니다!`}
        </CustomText>
        <View style={styles.imageContainer}>
          <Avatar uri={community.image} size={85} style={styles.playerImage} />
          <Pressable onPress={imageUpload} style={styles.profileImageContainer}>
            <ImageBackground
              source={{
                uri:
                  imageData.uri ||
                  'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/gray_background.png',
              }}
              style={styles.profileImage}
              imageStyle={styles.profileImageRadius}>
              <CameraSvg width={27} height={27} />
            </ImageBackground>
          </Pressable>
        </View>
        <CustomBottomSheetTextInput
          label="닉네임"
          value={nickname}
          isValid={isValid}
          inValidMessage={nicknameInvalidMessage}
          maxLength={20}
          length
          curLength={nickname.length}
          onChangeText={e => {
            setNickname(e);
            setIsValid(true);
          }}
        />
      </View>
      <CustomButton
        text="시작하기"
        type="normal"
        disabled={nickname.length < 2}
        onPress={handleJoinCommunity}
        isLoading={isPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileTitle: {fontSize: 21, color: '#000000'},
  profileInfo: {fontSize: 15, color: '#515151', marginTop: 5},
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },
  playerImage: {left: 8},
  profileImageContainer: {
    right: 8,
    borderRadius: 85,
    backgroundColor: '#7fb677',
  },
  profileImage: {
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageRadius: {borderRadius: 85},
});

export default JoinProfile;
