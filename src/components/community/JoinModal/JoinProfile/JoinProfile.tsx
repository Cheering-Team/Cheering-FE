import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CustomText from '../../../common/CustomText';
import Avatar from '../../../common/Avatar';
import CustomButton from '../../../common/CustomButton';
import CameraSvg from '../../../../assets/images/camera-01.svg';
import {ImageType} from '../JoinModal';
import {NAME_REGEX} from '../../../../constants/regex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBottomSheetTextInput from '../../../common/CustomBottomSheetTextInput';
import {useJoinCommunity} from 'apis/player/usePlayers';
import {showTopToast} from 'utils/toast';
import {Community} from 'apis/player/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {openPicker} from '@baronha/react-native-multiple-image-picker';

interface Props {
  playerData: Community;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
}

const JoinProfile = (props: Props) => {
  const {playerData, setRefreshKey, bottomSheetModalRef} = props;

  const insets = useSafeAreaInsets();

  const [imageData, setImageData] = useState<ImageType>({
    uri: '',
    name: '',
    type: '',
  });

  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');

  const {mutateAsync: joinCommunity} = useJoinCommunity();

  const imageUpload = async () => {
    try {
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
        uri: response.crop.path,
        name: response.fileName || '',
        type: response.mime,
      });
    } catch (e) {
      //
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

    const joinData = await joinCommunity({
      communityId: playerData.id,
      name: nickname,
      image: imageData,
    });

    if (joinData?.message === '부적절한 단어가 포함되어 있습니다.') {
      setIsValid(false);
      setNicknameInvalidMessage('부적절한 닉네임입니다.');
      return;
    }

    if (joinData?.message === '중복된 이름') {
      setIsValid(false);
      setNicknameInvalidMessage('이미 사용중인 이름입니다.');
      return;
    }

    if (joinData.message === '커뮤니티 가입 완료') {
      bottomSheetModalRef.current?.dismiss();
      setRefreshKey((prev: number) => prev + 1);
      showTopToast(insets.top + 20, joinData.message);
    }
  };

  return (
    <View className="flex-1 w-[90%] items-center justify-between mt-1">
      <View className="w-full items-center">
        <CustomText fontWeight="600" style={styles.profileTitle}>
          커뮤니티 가입
        </CustomText>
        <CustomText fontWeight="400" style={styles.profileInfo}>
          {`${playerData.koreanName}의 팬이 되신 걸 환영합니다!`}
        </CustomText>
        <View style={styles.imageContainer}>
          <Avatar uri={playerData.image} size={85} style={styles.playerImage} />
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
