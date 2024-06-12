// import {
//   FlatList,
//   ImageBackground,
//   Pressable,
//   StyleSheet,
//   View,
// } from 'react-native';
// import Back from '../hooks/Back';
// import LinearGradient from 'react-native-linear-gradient';
// import React from 'react';

// import CustomText from '../components/CustomText';
// import {getCommunitiesToPosts} from '../apis/community';
// import ToPost, {Post} from '../components/ToPost';
// import {HomeStackParamList} from '../navigations/HomeStackNavigator';
// import {RouteProp} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// type CommunityScreenNavigationProp = NativeStackNavigationProp<
//   HomeStackParamList,
//   'Community'
// >;

// type CommunityScreenRouteProp = RouteProp<HomeStackParamList, 'Community'>;

// const CommunityScreen = ({
//   navigation,
//   route,
// }: {
//   navigation: CommunityScreenNavigationProp;
//   route: CommunityScreenRouteProp;
// }) => {
//   const communityId = route.params.communityId;

//   const [toData, setToData] = React.useState<Post[]>([]);

//   const [curMenu, setCurMenu] = React.useState<'to' | 'from' | 'live' | 'chat'>(
//     'to',
//   );
//   Back(navigation);

//   React.useEffect(() => {
//     const getToPosts = async () => {
//       const response = await getCommunitiesToPosts({id: communityId});
//       setToData(response.data);
//     };

//     if (curMenu === 'to') {
//       getToPosts();
//     }
//   }, [curMenu, communityId]);

//   return (
//     <FlatList
//       data={toData}
//       renderItem={({item}) => <ToPost item={item} />}
//       ListHeaderComponent={() => (
//         <>
//
//           <View style={styles.MenuContainer}>
//             <Pressable
//               style={[styles.Menu, curMenu === 'to' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('to')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'to' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 To
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'from' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('from')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'from' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 From
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'live' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('live')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'live' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 Live
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'chat' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('chat')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'chat' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 Chat
//               </CustomText>
//             </Pressable>
//           </View>
//         </>
//       )}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   // 헤더
//   CommunityHeader: {
//     flex: 1,
//     alignItems: 'center',
//     height: 350,
//   },
//   CommunityHeaderBlur: {
//     width: '100%',
//     height: 350,
//   },
//   CommunityTitle: {
//     position: 'absolute',
//     bottom: -2,
//     flex: 1,
//     alignItems: 'center',
//   },
//   CommunityName: {
//     fontSize: 60,
//     letterSpacing: 2,
//     color: 'white',
//   },
//   CommunityInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 15,
//     bottom: -10,
//   },
//   TeamLogo: {
//     width: 35,
//     height: 35,
//   },

//   // 메뉴
//   MenuContainer: {
//     height: 42,
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#242424',
//     marginBottom: 10,
//   },
//   Menu: {
//     flex: 1,
//     padding: 5,
//   },
//   MenuText: {
//     textAlign: 'center',
//     fontSize: 19,
//     color: 'white',
//   },
//   SelectedMenu: {
//     backgroundColor: 'white',
//   },
//   SelectedText: {
//     color: 'black',
//   },
// });

// export default CommunityScreen;

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
} from 'react-native';
import CustomText from '../../components/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheveronLeft from '../../../assets/images/chevron-left-white.svg';
import LinearGradient from 'react-native-linear-gradient';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import {useQuery} from '@tanstack/react-query';
import {getPlayersInfo} from '../../apis/player';
import {formatComma} from '../../utils/format';
import StarWhite from '../../../assets/images/star-white.svg';
import Avatar from '../../components/Avatar';
import CameraSvg from '../../../assets/images/camera-01.svg';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

// type CommunityScreenNavigationProp = NativeStackNavigationProp<
//   HomeStackParamList,
//   'Community'
// >;

// type CommunityScreenRouteProp = RouteProp<HomeStackParamList, 'Community'>;

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

const teamData = [
  {
    name: '롯데 자이언츠',
    image: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/lotte.png',
  },
  {
    name: '한화 이글스',
    image: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/lotte.png',
  },
  {
    name: 'KBO 올스타',
    image: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/lotte.png',
  },
];

const CommunityScreen = ({navigation, route}) => {
  const scrollY = new Animated.Value(0);
  const insets = useSafeAreaInsets();

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
    queryKey: ['player', playerId],
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

    const translateYListener = translateY.addListener(({value}) => {
      console.log('translateY : ', value);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      translateY.removeListener(translateYListener);
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
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView>
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
        <View style={{width: 25, height: 25}}></View>
      </Animated.View>
      <Animated.ScrollView
        scrollEnabled={data.result.isJoin}
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
        <View style={{position: 'relative', bottom: 50, marginBottom: -30}}>
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
        {data.result.isJoin ? (
          feedData.map((f, idx) => (
            <View key={idx} style={{padding: 20, backgroundColor: 'white'}}>
              <CustomText>{f.content}</CustomText>
            </View>
          ))
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
              height: '55%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            {transform: [{translateY}]},
          ]}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              paddingBottom: insets.bottom + 20,
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 50,
                  height: 4,
                  backgroundColor: '#eaeaea',
                  marginTop: 8,
                  borderRadius: 20,
                }}
              />
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
            <View style={{flexDirection: 'row'}}>
              <Avatar uri={data.result.image} size={85} style={{left: 8}} />
              <View
                style={{
                  right: 8,
                  width: 85,
                  height: 85,
                  borderRadius: 50,
                  backgroundColor: '#7fb677',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CameraSvg width={27} height={27} />
              </View>
            </View>
            <View style={{width: '100%'}}>
              <CustomTextInput
                label="커뮤니티 닉네임"
                placeholder="닉네임을 입력해주세요."
              />
            </View>

            <CustomButton text="시작하기" type="normal" />
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityScreen;
