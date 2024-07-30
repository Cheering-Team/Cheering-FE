import React, {Dispatch, SetStateAction} from 'react';
import {ImageBackground, Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../../../common/CustomText';
import Avatar from '../../../../common/Avatar';
import CustomTextInput from '../../../../common/CustomTextInput';
import CustomButton from '../../../../common/CustomButton';
import {GetPlayersInfoResponse} from '../../../../../types/player';
import {Api} from '../../../../../types/api';

import CameraSvg from '../../../../../../assets/images/camera-01.svg';
import {ImageType} from '../JoinModal';
import {useJoinProfile} from './useJoinProfile';

interface JoinProfileProps {
  playerData: Api<GetPlayersInfoResponse>;
  setJoinState: Dispatch<SetStateAction<'profile' | 'term'>>;
  imageData: ImageType;
  setImageData: Dispatch<SetStateAction<ImageType>>;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
}

const JoinProfile = (props: JoinProfileProps) => {
  const {
    playerData,
    setJoinState,
    imageData,
    setImageData,
    nickname,
    setNickname,
  } = props;

  const {
    isNicknameValid,
    nicknameInvalidMessage,
    imageUpload,
    checkNickname,
    setIsNicknameValid,
  } = useJoinProfile(
    playerData.result.id,
    nickname,
    setImageData,
    setJoinState,
  );

  return (
    <>
      <View style={styles.profileContainer}>
        <View style={styles.titleContainer}>
          <CustomText fontWeight="600" style={styles.profileTitle}>
            {`${playerData.result.koreanName} `}
          </CustomText>
          <CustomText fontWeight="600" style={styles.profileTitle}>
            커뮤니티
          </CustomText>
        </View>
        <CustomText fontWeight="400" style={styles.profileInfo}>
          {`${playerData.result.koreanName} 선수의 팬이 되신 걸 환영합니다!`}
        </CustomText>
      </View>
      <View style={styles.imageContainer}>
        <Avatar
          uri={playerData.result.image}
          size={85}
          style={styles.playerImage}
        />
        <Pressable onPress={imageUpload} style={styles.profileImageContainer}>
          <ImageBackground
            source={{
              uri:
                imageData.uri ||
                'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/transparentImage.png',
            }}
            style={styles.profileImage}
            imageStyle={styles.profileImageRadius}>
            <CameraSvg width={27} height={27} />
          </ImageBackground>
        </Pressable>
      </View>
      <View style={styles.nicknameContainer}>
        <CustomTextInput
          label="커뮤니티 닉네임"
          value={nickname}
          isValid={isNicknameValid}
          inValidMessage={nicknameInvalidMessage}
          maxLength={20}
          length
          curLength={nickname.length}
          onChangeText={e => {
            setNickname(e);
            setIsNicknameValid(true);
          }}
        />
      </View>

      <CustomButton
        text="시작하기"
        type="normal"
        disabled={nickname.length < 2}
        onPress={() => {
          checkNickname();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
  },
  titleContainer: {flexDirection: 'row', marginTop: 18},
  profileTitle: {fontSize: 22, color: '#000000'},
  profileInfo: {fontSize: 15, color: '#515151', marginTop: 7},
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
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
  nicknameContainer: {width: '100%', marginBottom: 20, marginTop: 30},
});

export default JoinProfile;
