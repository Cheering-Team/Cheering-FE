import React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from './CustomText';

function CustomTabBar({state, descriptors, navigation}) {
  // 탭 애니메이션 상태
  const [modeValue, setModeValue] = React.useState(false);
  const mode = React.useRef(new Animated.Value(0)).current;

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
        style={[
          routeName === 'PostWrite' ||
          routeName === 'Post' ||
          routeName === 'Search' ||
          routeName === 'EditNickname'
            ? {display: 'none'}
            : styles.TabContainer,
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

          if (index === 2) {
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
                      <CategorBlackSvg width={20} height={20} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        카테고리
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <CategoryGraySvg width={20} height={20} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        카테고리
                      </CustomText>
                    </>
                  )
                ) : index === 1 ? (
                  isFocused ? (
                    <>
                      <StarBlackSvg width={20} height={20} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        내 선수
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <StarGraySvg width={20} height={20} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        내 선수
                      </CustomText>
                    </>
                  )
                ) : index === 3 ? (
                  isFocused ? (
                    <>
                      <ChatBlackSvg width={20} height={20} />
                      <CustomText
                        fontWeight="600"
                        style={styles.TabLabelFocused}>
                        채팅
                      </CustomText>
                    </>
                  ) : (
                    <>
                      <ChatGraySvg width={20} height={20} />
                      <CustomText fontWeight="600" style={styles.TabLabel}>
                        채팅
                      </CustomText>
                    </>
                  )
                ) : isFocused ? (
                  <>
                    <MoreBlackSvg width={20} height={20} />
                    <CustomText fontWeight="600" style={styles.TabLabelFocused}>
                      더보기
                    </CustomText>
                  </>
                ) : (
                  <>
                    <MoreGraySvg width={20} height={20} />
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
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    position: 'absolute',
    top: -20,
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
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    position: 'absolute',
    top: -20,
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
