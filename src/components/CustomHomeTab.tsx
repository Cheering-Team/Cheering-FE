import React from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CategoryGraySvg from '../../assets/images/category-gray.svg';
import CategorBlackSvg from '../../assets/images/category-black.svg';
import HomeSvg from '../../assets/images/home_white.svg';
import HomeBackGraySvg from '../../assets/images/home-back-gray.svg';
import StarGraySvg from '../../assets/images/star-gray.svg';
import StarBlackSvg from '../../assets/images/star-black.svg';
import ChatGraySvg from '../../assets/images/chat-gray.svg';
import ChatBlackSvg from '../../assets/images/chat-black.svg';
import MoreGraySvg from '../../assets/images/more-gray.svg';
import MoreBlackSvg from '../../assets/images/more-black.svg';
import PlusSvg from '../../assets/images/plus_white.svg';
import PencilSvg from '../../assets/images/pencil.svg';
import LetterSvg from '../../assets/images/letter.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getCommunitiesMain} from '../apis/community';
import CustomText from './CustomText';

function CustomTabBar({state, descriptors, navigation}) {
  // 탭 애니메이션 상태
  const [modeValue, setModeValue] = React.useState(false);
  const mode = React.useRef(new Animated.Value(0)).current;
  const buttonSize = React.useRef(new Animated.Value(1)).current;

  // 최근에 접속한 커뮤니티 (이미지 받아오기 위함)
  // const [curCommunity, setCurCommunity] = React.useState<string | null>(null);

  // 현재 화면 이름
  let routeName = '';

  if (state.routes[state.index].state) {
    routeName = state.routes[state.index].state.routes.at(-1).name;
  }

  // React.useEffect(() => {
  //   const getCommunityMain = async () => {
  //     const response = await getCommunitiesMain({
  //       id: state.routes[1].state.routes.at(-1)?.params?.communityId,
  //     });

  //     if (response.message === 'get community success') {
  //       setCurCommunity(response.data.backgroundImage);
  //     }
  //   };
  //   if (state.routes[1]?.state?.routes.at(-1)?.name === 'Community') {
  //     getCommunityMain();
  //   } else {
  //     setCurCommunity(null);
  //   }
  // }, [state.routes]);

  return (
    <>
      {modeValue && (
        <Pressable
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          onPress={() => {
            Animated.timing(mode, {
              toValue: 0,
              duration: 350,
              useNativeDriver: true,
            }).start(() => {
              setModeValue(!modeValue);
            });
          }}
        />
      )}

      <View
        // style={[
        //   routeName === 'Search' ||
        //   routeName === 'Write' ||
        //   routeName === 'Post'
        //     ? {display: 'none'}
        //     : styles.TabContainer,
        //   {paddingBottom: useSafeAreaInsets().bottom},
        // ]}
        style={[
          styles.TabContainer,
          {paddingBottom: useSafeAreaInsets().bottom},
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const handlePlusPress = () => {
            const toValue = modeValue ? 0 : 1;

            Animated.sequence([
              Animated.timing(buttonSize, {
                toValue: 0.95,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(buttonSize, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(mode, {
                toValue: toValue,
                duration: 350,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setModeValue(!modeValue);
            });
          };

          const sizeStyle = {
            transform: [{scale: buttonSize}],
          };

          const rotation = mode.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg'],
          });

          const writeX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-25, -90],
          });

          const writeY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-55, -90],
          });

          const homeX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-25, -25],
          });

          const homeY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-55, -135],
          });

          const letterX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-25, 40],
          });

          const letterY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-55, -90],
          });

          if (index === 2 && routeName === 'Community') {
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={handlePlusPress}
                onLongPress={onLongPress}
                style={styles.Tab}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    transform: [{translateX: writeX}, {translateY: writeY}],
                  }}>
                  <Pressable style={styles.secondaryButton}>
                    <LetterSvg width={23} height={23} />
                  </Pressable>
                </Animated.View>
                <Animated.View
                  style={{
                    position: 'absolute',
                    transform: [{translateX: homeX}, {translateY: homeY}],
                  }}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {
                      mode.setValue(0);
                      setModeValue(false);
                      navigation.navigate('Write', {
                        communityId:
                          state.routes[state.index].state.routes.at(-1).params
                            .communityId,
                      });
                    }}>
                    <PencilSvg width={23} height={23} />
                  </Pressable>
                </Animated.View>
                <Animated.View
                  style={{
                    position: 'absolute',
                    transform: [{translateX: letterX}, {translateY: letterY}],
                  }}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {
                      mode.setValue(0);
                      setModeValue(false);
                      navigation.navigate('Home');
                    }}>
                    <HomeSvg width={25} height={25} />
                  </Pressable>
                </Animated.View>
                <Animated.View style={[styles.HomeTab, sizeStyle]}>
                  <Animated.View style={{transform: [{rotate: rotation}]}}>
                    <PlusSvg width={25} height={25} />
                  </Animated.View>
                </Animated.View>
              </Pressable>
            );
          } else if (index === 2 && routeName !== 'Community') {
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.Tab}>
                {/* {curCommunity && routeName !== 'Home' ? (
                  <ImageBackground
                    source={{uri: curCommunity}}
                    imageStyle={{
                      borderRadius: 37,
                      borderWidth: 3,
                      borderColor: 'white',
                    }}
                    resizeMode="cover"
                    style={styles.ImageHomeTab}>
                    <HomeSvg width={30} height={30} />
                  </ImageBackground>
                ) : (
                  <View style={styles.HomeTab}>
                    <HomeSvg width={30} height={30} />
                  </View>
                )} */}
                {isFocused ? (
                  <View style={styles.HomeTabFocused}>
                    <HomeSvg width={30} height={30} />
                  </View>
                ) : (
                  <View style={styles.HomeTab}>
                    <HomeBackGraySvg width={30} height={30} />
                  </View>
                )}
              </Pressable>
            );
          } else {
            return (
              // gray: B7B7B7
              // black: 323232
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.Tab}>
                {index === 0 ? (
                  isFocused ? (
                    <>
                      <CategorBlackSvg width={21} height={21} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        카테고리
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <CategoryGraySvg width={21} height={21} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        카테고리
                      </CustomText>
                    </>
                  )
                ) : index === 1 ? (
                  isFocused ? (
                    <>
                      <StarBlackSvg width={21} height={21} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        내 선수
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <StarGraySvg width={21} height={21} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        내 선수
                      </CustomText>
                    </>
                  )
                ) : index === 3 ? (
                  isFocused ? (
                    <>
                      <ChatBlackSvg width={21} height={21} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        채팅
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <ChatGraySvg width={21} height={21} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        채팅
                      </CustomText>
                    </>
                  )
                ) : isFocused ? (
                  <>
                    <MoreBlackSvg width={21} height={21} />
                    <CustomText fontWeight="600" style={styles.TabLabelFocused}>
                      더보기
                    </CustomText>
                  </>
                ) : (
                  <>
                    <MoreGraySvg width={21} height={21} />
                    <CustomText fontWeight="600" style={styles.TabLabel}>
                      더보기
                    </CustomText>
                  </>
                )}
              </Pressable>
            );
          }
        })}
      </View>
    </>
  );
}
export default CustomTabBar;

const styles = StyleSheet.create({
  TabContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: 'white',
  },
  Tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  TabLabel: {fontSize: 10, color: '#B7B7B7', marginTop: 3},
  TabLabelFocused: {fontSize: 10, color: '#323232', marginTop: 3},
  HomeTab: {
    backgroundColor: '#B7B7B7',
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    position: 'absolute',
    top: -27,
    shadowColor: '#B7B7B7',
    shadowRadius: 5,
    shadowOffset: {height: 10, width: 0},
    shadowOpacity: 0.3,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  HomeTabFocused: {
    backgroundColor: '#58a04b',
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    position: 'absolute',
    top: -27,
    shadowColor: '#58a04b',
    shadowRadius: 5,
    shadowOffset: {height: 10, width: 0},
    shadowOpacity: 0.3,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  ImageHomeTab: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    position: 'absolute',
    top: -34,
    shadowColor: '#58a04b',
    shadowRadius: 5,
    shadowOffset: {height: 10, width: 0},
    shadowOpacity: 0.3,
    elevation: 20,
  },
  secondaryButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#58a04b',
  },
});
