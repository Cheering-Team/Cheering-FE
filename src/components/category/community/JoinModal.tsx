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
import CustomText from '../../CustomText';
import Avatar from '../../Avatar';
import CustomTextInput from '../../CustomTextInput';
import CustomButton from '../../CustomButton';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import {toastConfig} from '../../../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CameraSvg from '../../../../assets/images/camera-01.svg';
import ArrowLeftGraySvg from '../../../../assets/images/arrow-left-gray.svg';
import CheckGraySvg from '../../../../assets/images/check-gray.svg';
import CheckGreenSvg from '../../../../assets/images/check-green.svg';
import {getCheckNickname, postCommunityJoin} from '../../../apis/player';
import {useMutation, useQuery} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';

interface JoinModalProps {
  playerId: number;
  playerData: any;
  isModalOpen: boolean;
  setIsModalOpen: any;
  translateY: any;
  setRefreshKey: any;
}

const JoinModal = (props: JoinModalProps) => {
  const {
    playerId,
    playerData,
    isModalOpen,
    setIsModalOpen,
    translateY,
    setRefreshKey,
  } = props;

  const insets = useSafeAreaInsets();

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

  const {
    data: nicknameCheckData,
    refetch,
    error,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ['nickname', playerId, nickname],
    queryFn: getCheckNickname,
    enabled: false,
    retry: 0,
  });
  const mutation = useMutation({mutationFn: postCommunityJoin});

  useEffect(() => {
    if (!isRefetching) {
      if (isError && error?.message === '이미 존재하는 닉네임입니다.') {
        Toast.show({
          type: 'default',
          position: 'bottom',
          visibilityTime: 3000,
          bottomOffset: 30,
          text1: '이미 존재하는 닉네임입니다.',
        });
        return;
      }
      if (nicknameCheckData?.message === '사용 가능한 닉네임 입니다.') {
        setJoinState('term');
      }
    }
  }, [nicknameCheckData, isRefetching, error, isError]);

  const closeModal = () => {
    setImageData({uri: '', name: '', type: ''});
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpen(false);
      setJoinState('profile');
      setAgreements({one: false, two: false, three: false});
      setNickname('');
    });
  };

  const imageUpload = async () => {
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
  };

  const checkNickname = async () => {
    if (nickname.length === 0) {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '닉네임을 입력해주세요.',
      });
      return;
    }
    refetch();
  };

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
        bottomOffset: 30,
        text1: '가입이 완료되었습니다.',
      });
    }
  };

  return (
    <Modal
      animationType="none"
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
        style={[styles.modalContainer, {transform: [{translateY}]}]}>
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
                  placeholder="닉네임을 입력해주세요."
                  value={nickname}
                  maxLength={20}
                  curLength={nickname.length}
                  onChangeText={e => setNickname(e)}
                />
              </View>

              <CustomButton
                text="시작하기"
                type="normal"
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
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Pressable
                    onPress={() => toggleAgreement('one')}
                    style={{padding: 3}}>
                    {agreements.one ? (
                      <CheckGreenSvg width={17} height={17} />
                    ) : (
                      <CheckGraySvg width={17} height={17} />
                    )}
                  </Pressable>

                  <CustomText
                    fontWeight="500"
                    style={{marginLeft: 3, fontSize: 16, color: '#353535'}}>
                    해당 커뮤니티는 선수와 팬들을 위한 공간입니다.
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}>
                  <Pressable
                    onPress={() => toggleAgreement('two')}
                    style={{padding: 3}}>
                    {agreements.two ? (
                      <CheckGreenSvg
                        width={17}
                        height={17}
                        style={{marginTop: 3}}
                      />
                    ) : (
                      <CheckGraySvg
                        width={17}
                        height={17}
                        style={{marginTop: 3}}
                      />
                    )}
                  </Pressable>
                  <View>
                    <CustomText
                      fontWeight="500"
                      style={{
                        marginLeft: 3,
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
                  <Pressable
                    onPress={() => toggleAgreement('three')}
                    style={{padding: 3}}>
                    {agreements.three ? (
                      <CheckGreenSvg
                        width={17}
                        height={17}
                        style={{marginTop: 3}}
                      />
                    ) : (
                      <CheckGraySvg
                        width={17}
                        height={17}
                        style={{marginTop: 3}}
                      />
                    )}
                  </Pressable>
                  <View>
                    <CustomText
                      fontWeight="500"
                      style={{
                        marginLeft: 3,
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
  nicknameContainer: {width: '100%', marginBottom: 25, marginTop: 10},
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
