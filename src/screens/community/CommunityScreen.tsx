import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
  ScrollView,
} from 'react-native';
import CustomText from '../../components/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheveronLeft from '../../../assets/images/chevron-left-white.svg';
import LinearGradient from 'react-native-linear-gradient';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getCheckNickname,
  getPlayersInfo,
  postCommunityJoin,
} from '../../apis/player';
import {formatComma} from '../../utils/format';
import StarWhite from '../../../assets/images/star-white.svg';
import Avatar from '../../components/Avatar';
import CameraSvg from '../../../assets/images/camera-01.svg';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ImagePicker from 'react-native-image-crop-picker';
import ArrowLeftGraySvg from '../../../assets/images/arrow-left-gray.svg';
import CheckGraySvg from '../../../assets/images/check-gray.svg';
import CheckGreenSvg from '../../../assets/images/check-green.svg';
import ChevronDownSvg from '../../../assets/images/chevron-down-black.svg';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../App';

const feedData = [
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
  {content: '피드입니다'},
];

const CommunityScreen = ({navigation, route}) => {
  const scrollY = new Animated.Value(0);
  const insets = useSafeAreaInsets();

  const [refreshKey, setRefreshKey] = useState(0);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['rgba(0, 0, 0, 0)', '#000000'],
    extrapolate: 'clamp',
  });

  const headerTitleColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });

  const [curTab, setCurTab] = useState('피드');

  const playerId = route.params.playerId;

  const {data, isLoading} = useQuery({
    queryKey: ['player', playerId, refreshKey],
    queryFn: getPlayersInfo,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(500)).current;

  const keyboardDidShow = useCallback(
    e => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [translateY],
  );

  const keyboardDidHide = useCallback(
    e => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [translateY],
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardDidShow, keyboardDidHide, translateY]);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setImageData({uri: '', name: '', type: ''});
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setJoinState('profile');
      setAgreements({one: false, two: false, three: false});
      setNickname('');
    });
  };

  const [imageData, setImageData] = useState({
    uri: '',
    name: '',
    type: '',
  });

  const [nickname, setNickname] = useState('');

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

  const [joinState, setJoinState] = useState<'profile' | 'term'>('profile');
  const [agreements, setAgreements] = useState({
    one: false,
    two: false,
    three: false,
  });

  const toggleAgreement = (agreement: 'one' | 'two' | 'three') => {
    setAgreements(prev => ({
      ...prev,
      [agreement]: !prev[agreement],
    }));
  };

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

  const mutation = useMutation({mutationFn: postCommunityJoin});

  const joinCommunity = async () => {
    const joinData = await mutation.mutateAsync({
      playerId,
      nickname,
      image: imageData,
    });

    if (joinData.message === '가입이 완료되었습니다.') {
      closeModal();
      setRefreshKey(prev => prev + 1);
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '가입이 완료되었습니다.',
      });
    }
  };

  const [isWrap, setIsWrap] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    all: true,
    hot: false,
    photo: false,
    view: false,
    info: false,
  });

  const selectAll = () => {
    setSelectedFilter({
      all: true,
      hot: false,
      photo: false,
      view: false,
      info: false,
    });
  };

  const selectFilter = filter => {
    setSelectedFilter(prev => ({
      ...prev,
      all: false,
      [filter]: !prev[filter],
    }));
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView key={refreshKey}>
      <Animated.View
        style={[
          {
            marginTop: insets.top,
            height: 52,
            width: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
          },
          {backgroundColor: headerBackgroundColor},
        ]}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <CheveronLeft width={25} height={25} />
        </Pressable>
        <View style={{flexDirection: 'row'}}>
          <Animated.Text
            style={[
              {
                fontSize: 18,
                fontFamily: 'NotoSansKR-Medium',
                includeFontPadding: false,
              },
              {color: headerTitleColor},
            ]}>
            {`${data.result.koreanName} / `}
          </Animated.Text>
          <Animated.Text
            style={[
              {
                fontSize: 18,
                fontFamily: 'NotoSansKR-Medium',
                includeFontPadding: false,
              },
              {color: headerTitleColor},
            ]}>
            {data.result.englishName}
          </Animated.Text>
        </View>
        {data.result.user && (
          <Avatar
            uri={data.result.user.image}
            size={30}
            style={{borderWidth: 1.5, borderColor: 'white', marginRight: 3}}
          />
        )}
      </Animated.View>
      <Animated.ScrollView
        scrollEnabled={!!data.result.user}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={16}>
        <View
          style={{
            height: Dimensions.get('window').height / 2.6,
            width: '100%',
          }}>
          <View style={{position: 'absolute', top: 56, left: 15, zIndex: 2}}>
            <CustomText
              fontWeight="500"
              style={{
                color: 'white',
                fontSize: 17,
                marginLeft: 2,
              }}>
              {data.result.englishName}
            </CustomText>
            <CustomText
              fontWeight="600"
              style={{
                color: 'white',
                fontSize: 40,
                lineHeight: 50,
              }}>
              {data.result.koreanName}
            </CustomText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 5,
              }}>
              <StarOrangeSvg width={14} height={14} />
              <CustomText
                style={{
                  color: '#F99E35',
                  marginLeft: 4,
                  fontSize: 16,
                  paddingBottom: 2,
                }}>
                {formatComma(data.result.fanCount)}
              </CustomText>
            </View>
          </View>

          <Image
            source={{
              uri: data.result.backgroundImage,
            }}
            style={{height: '100%', width: '100%'}}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.15)', '#000000']}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />
        </View>
        <View style={{position: 'relative', bottom: 50, marginBottom: -40}}>
          <View
            style={{
              height: 50,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 17,
            }}>
            <CustomText
              fontWeight="500"
              style={{color: '#d2d2d2', fontSize: 16, paddingBottom: 4}}>
              소속팀
            </CustomText>

            <FlatList
              horizontal={true}
              data={data.result.teams}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#373737',
                    borderRadius: 20,
                    paddingHorizontal: 11,
                    paddingVertical: 2,
                    marginLeft: 15,
                  }}>
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    width={20}
                    height={20}
                  />
                  <CustomText
                    fontWeight="500"
                    style={{
                      color: 'white',
                      paddingBottom: 1,
                      marginLeft: 4,
                      fontSize: 14,
                    }}>
                    {item.name}
                  </CustomText>
                </Pressable>
              )}
            />
          </View>
          <FlatList
            style={{
              paddingHorizontal: 10,
              paddingBottom: 10,
              backgroundColor: 'black',
            }}
            horizontal={true}
            data={[{name: '피드'}, {name: '채팅'}]}
            renderItem={({item}) => (
              <Pressable
                style={[
                  {
                    paddingTop: 5,
                    paddingBottom: 2,
                    marginBottom: 2,
                    marginHorizontal: 15,
                    paddingHorizontal: 2,
                  },
                  curTab === item.name
                    ? {borderBottomWidth: 2, borderBottomColor: 'white'}
                    : {},
                ]}
                key={item.name}
                onPress={() => {
                  setCurTab(item.name);
                }}>
                <CustomText
                  fontWeight={curTab === item.name ? '700' : '700'}
                  style={[
                    {fontSize: 17},
                    curTab === item.name
                      ? {color: 'white'}
                      : {color: '#9f9f9f'},
                  ]}>
                  {item.name}
                </CustomText>
              </Pressable>
            )}
          />
        </View>
        {data.result.user ? (
          <>
            <View
              style={[
                {
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  backgroundColor: 'white',
                },
                isWrap && {},
              ]}>
              <ScrollView
                horizontal={!isWrap}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  {paddingRight: 30},
                  isWrap && {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  },
                ]}>
                {[
                  {name: '전체', filter: 'all'},
                  {name: '🔥 HOT', filter: 'hot'},
                  {name: '📸 직찍사', filter: 'photo'},
                  {name: '👀 직관인증', filter: 'view'},
                  {name: '🔎 정보', filter: 'info'},
                ].map(item => (
                  <Pressable
                    key={item.filter}
                    onPress={() => {
                      item.filter === 'all'
                        ? selectAll()
                        : selectFilter(item.filter);
                    }}
                    style={[
                      {
                        borderWidth: 1,
                        borderColor: '#dcdcdc',
                        paddingVertical: 6,
                        paddingHorizontal: 15,
                        borderRadius: 20,
                        marginRight: 6,
                      },
                      isWrap && {marginBottom: 10},
                      selectedFilter[item.filter] && {
                        backgroundColor: '#3a3a3a',
                        borderColor: '#3a3a3a',
                      },
                    ]}>
                    <CustomText
                      fontWeight="500"
                      style={[
                        {fontSize: 14},
                        selectedFilter[item.filter] && {
                          color: 'white',
                        },
                      ]}>
                      {item.name}
                    </CustomText>
                  </Pressable>
                ))}
              </ScrollView>
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.1)',
                  'rgba(255,255,255,1)',
                  'rgba(255,255,255,1)',
                  'rgba(255,255,255,1)',
                  'rgba(255,255,255,1)',
                ]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                style={[
                  {
                    right: 10,
                    width: 50,
                    height: 40,
                    top: -3,
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  },
                  isWrap && {},
                ]}>
                <Pressable
                  onPress={() => {
                    setIsWrap(prev => !prev);
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#e1e1e1',
                    borderRadius: 20,
                    padding: 5,
                  }}>
                  {isWrap ? (
                    <ChevronTopSvg width={20} height={20} />
                  ) : (
                    <ChevronDownSvg width={20} height={20} />
                  )}
                </Pressable>
              </LinearGradient>
            </View>

            {feedData.map((f, idx) => (
              <View key={idx} style={{padding: 20, backgroundColor: 'white'}}>
                <CustomText>{f.content}</CustomText>
              </View>
            ))}
          </>
        ) : (
          <View
            style={{
              paddingTop: 30,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Avatar
                uri={data.result.image}
                size={85}
                style={{left: 8, zIndex: 1}}
              />
              <View
                style={{
                  right: 8,
                  width: 85,
                  height: 85,
                  borderRadius: 50,
                  backgroundColor: '#fba94b',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <StarWhite width={45} height={45} />
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <CustomText
                fontWeight="500"
                style={{fontSize: 19, color: '#000000', marginTop: 15}}>
                {`${data.result.koreanName} `}
              </CustomText>
              <CustomText
                fontWeight="500"
                style={{fontSize: 19, color: '#000000', marginTop: 15}}>
                커뮤니티
              </CustomText>
            </View>

            <CustomText style={{fontSize: 14, color: '#4a4a4a', marginTop: 5}}>
              프로필을 설정한 후, 바로 이용해보세요
            </CustomText>

            <CustomText
              onPress={openModal}
              fontWeight="600"
              style={{fontSize: 15, color: '#fba94b', marginTop: 10}}>
              프로필 등록
            </CustomText>
          </View>
        )}
      </Animated.ScrollView>

      <Modal
        animationType="none"
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          activeOpacity={1}
          onPressOut={closeModal}
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            {transform: [{translateY}]},
          ]}>
          <View
            style={{
              flexGrow: 1,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              paddingBottom: insets.bottom + 20,
            }}>
            <View
              style={{
                alignSelf: 'center',
                width: 50,
                height: 4,
                backgroundColor: '#eaeaea',
                marginTop: 8,
                borderRadius: 20,
              }}
            />
            {joinState === 'profile' ? (
              <>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', marginTop: 18}}>
                    <CustomText
                      fontWeight="600"
                      style={{fontSize: 22, color: '#000000'}}>
                      {`${data.result.koreanName} `}
                    </CustomText>
                    <CustomText
                      fontWeight="600"
                      style={{fontSize: 22, color: '#000000'}}>
                      커뮤니티
                    </CustomText>
                  </View>
                  <CustomText
                    fontWeight="400"
                    style={{fontSize: 15, color: '#515151', marginTop: 7}}>
                    {`${data.result.koreanName} 선수의 팬이 되신 걸 환영합니다!`}
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 25,
                  }}>
                  <Avatar uri={data.result.image} size={85} style={{left: 8}} />
                  <Pressable
                    onPress={imageUpload}
                    style={{
                      right: 8,
                      borderRadius: 85,
                      backgroundColor: '#7fb677',
                    }}>
                    <ImageBackground
                      source={{
                        uri:
                          imageData.uri ||
                          'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/transparentImage.png',
                      }}
                      style={{
                        width: 85,
                        height: 85,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      imageStyle={{borderRadius: 85}}>
                      <CameraSvg width={27} height={27} />
                    </ImageBackground>
                  </Pressable>
                </View>
                <View style={{width: '100%', marginBottom: 25, marginTop: 10}}>
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
                  style={{position: 'absolute', top: 20, left: 13}}
                  onPress={() => {
                    setJoinState('profile');
                    setAgreements({one: false, two: false, three: false});
                  }}>
                  <ArrowLeftGraySvg width={32} height={32} />
                </Pressable>

                <CustomText
                  fontWeight="600"
                  style={{
                    fontSize: 22,
                    color: '#000000',
                    alignSelf: 'center',
                    marginTop: 18,
                  }}>
                  커뮤니티 이용수칙
                </CustomText>

                <CustomText
                  style={{
                    fontSize: 15,
                    color: '#515151',
                    marginTop: 5,
                    alignSelf: 'center',
                  }}>
                  커뮤니티 이용 전, 아래의 사항들에 동의해주세요
                </CustomText>
                <View style={{paddingLeft: 2, marginTop: 25, marginBottom: 30}}>
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
                        style={{marginLeft: 3, fontSize: 16, color: '#353535'}}>
                        선수를 비하하는 등의 글, 댓글, 채팅 작성 시
                      </CustomText>
                      <CustomText
                        fontWeight="500"
                        style={{marginLeft: 3, fontSize: 16, color: '#353535'}}>
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
                        style={{marginLeft: 3, fontSize: 16, color: '#353535'}}>
                        깨끗한 커뮤니티 유지를 위하여 커뮤니티 가입
                      </CustomText>
                      <CustomText
                        fontWeight="500"
                        style={{marginLeft: 3, fontSize: 16, color: '#353535'}}>
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
    </SafeAreaView>
  );
};

export default CommunityScreen;
