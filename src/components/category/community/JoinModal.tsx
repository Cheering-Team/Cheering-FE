import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import {toastConfig} from '../../../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CameraSvg from '../../../../assets/images/camera-01.svg';
import ArrowLeftGraySvg from '../../../../assets/images/arrow-left-gray.svg';
import {getCheckNickname, postCommunityJoin} from '../../../apis/player';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {NICKNAME_REGEX} from '../../../constants/regex';
import CustomText from '../../common/CustomText';
import Avatar from '../../common/Avatar';
import CustomTextInput from '../../common/CustomTextInput';
import CustomButton from '../../common/CustomButton';
import CheckBox from '../../common/CheckBox';

interface JoinModalProps {
  playerId: number;
  playerData: any;
  isModalOpen: boolean;
  translateY: any;
  setRefreshKey: any;
  closeModal: any;
  panResponders: any;
}

const JoinModal = (props: JoinModalProps) => {
  const {
    playerId,
    playerData,
    isModalOpen,
    translateY,
    setRefreshKey,
    closeModal,
    panResponders,
  } = props;

  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [joinState, setJoinState] = useState<'profile' | 'term'>('profile');
  const [agreements, setAgreements] = useState({
    one: false,
    two: false,
    three: false,
  });
  const [imageData, setImageData] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [nickname, setNickname] = useState('');
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

  const mutation = useMutation({
    mutationFn: postCommunityJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my', 'players'],
      });
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      setImageData({uri: '', name: '', type: ''});
      setJoinState('profile');
      setAgreements({one: false, two: false, three: false});
      setNickname('');
    }
  }, [isModalOpen]);

  const imageUpload = async () => {
    try {
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
  }, [isRefetching, nicknameCheckData?.message, isRefetching]);

  const toggleAgreement = (agreement: 'one' | 'two' | 'three') => {
    setAgreements(prev => ({
      ...prev,
      [agreement]: !prev[agreement],
    }));
  };

  const joinCommunity = async () => {
    const joinData = await mutation.mutateAsync({
      playerId,
      nickname,
      image: imageData,
    });

    if (joinData.message === '가입이 완료되었습니다.') {
      closeModal();
      setRefreshKey((prev: number) => prev + 1);
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '가입이 완료되었습니다.',
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={isModalOpen}
      transparent={true}
      onRequestClose={closeModal}>
      <TouchableOpacity
        style={[
          styles.blur,
          {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
        activeOpacity={1}
        onPressOut={closeModal}
      />

      <Animated.View
        style={[styles.modalContainer, {transform: [{translateY}]}]}
        {...panResponders.panHandlers}>
        <View
          style={[
            styles.container,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}>
          <View style={styles.topMark} />
          {joinState === 'profile' ? (
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
                <Pressable
                  onPress={imageUpload}
                  style={styles.profileImageContainer}>
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
          ) : (
            <>
              <Pressable
                style={styles.backButton}
                onPress={() => {
                  setJoinState('profile');
                  setAgreements({one: false, two: false, three: false});
                }}>
                <ArrowLeftGraySvg width={32} height={32} />
              </Pressable>

              <CustomText fontWeight="600" style={styles.termTitle}>
                커뮤니티 이용수칙
              </CustomText>

              <CustomText style={styles.termInfo}>
                커뮤니티 이용 전, 아래의 사항들에 동의해주세요
              </CustomText>
              <View style={styles.termContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}>
                  <CheckBox
                    isCheck={agreements.one}
                    onPress={() => toggleAgreement('one')}
                    style={{marginTop: 2}}
                  />

                  <CustomText
                    fontWeight="500"
                    style={{fontSize: 16, color: '#353535'}}>
                    해당 커뮤니티는 선수와 팬들을 위한 공간입니다.
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}>
                  <CheckBox
                    isCheck={agreements.two}
                    onPress={() => toggleAgreement('two')}
                    style={{marginTop: 2}}
                  />
                  <View>
                    <CustomText
                      fontWeight="500"
                      style={{
                        fontSize: 16,
                        color: '#353535',
                      }}>
                      선수를 비하하는 등의 글, 댓글, 채팅 작성 시
                    </CustomText>
                    <CustomText
                      fontWeight="500"
                      style={{
                        marginLeft: 3,
                        fontSize: 16,
                        color: '#353535',
                      }}>
                      커뮤니티 이용이 정지될 수 있습니다.
                    </CustomText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 5,
                  }}>
                  <CheckBox
                    isCheck={agreements.three}
                    onPress={() => toggleAgreement('three')}
                    style={{marginTop: 2}}
                  />
                  <View>
                    <CustomText
                      fontWeight="500"
                      style={{
                        fontSize: 16,
                        color: '#353535',
                      }}>
                      깨끗한 커뮤니티 유지를 위하여 커뮤니티 가입
                    </CustomText>
                    <CustomText
                      fontWeight="500"
                      style={{
                        marginLeft: 3,
                        fontSize: 16,
                        color: '#353535',
                      }}>
                      24시간 이후에 글을 작성할 수 있습니다.
                    </CustomText>
                  </View>
                </View>
              </View>
              <CustomButton
                text="시작하기"
                type="normal"
                disabled={!Object.values(agreements).every(Boolean)}
                onPress={() => {
                  joinCommunity();
                }}
              />
            </>
          )}
        </View>
      </Animated.View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  blur: {backgroundColor: 'rgba(0,0,0,0.5)'},
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topMark: {
    alignSelf: 'center',
    width: 50,
    height: 4,
    backgroundColor: '#eaeaea',
    marginTop: 8,
    borderRadius: 20,
  },
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
  backButton: {position: 'absolute', top: 20, left: 13},
  termTitle: {
    fontSize: 22,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 18,
  },
  termInfo: {
    fontSize: 15,
    color: '#515151',
    marginTop: 5,
    alignSelf: 'center',
  },
  termContainer: {paddingLeft: 2, marginTop: 25, marginBottom: 30},
});

export default JoinModal;
