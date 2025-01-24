import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CategoryGraySvg from '../../assets/images/category-gray.svg';
import CategoryBlackSvg from '../../assets/images/category-black.svg';
import HomeGraySvg from '../../assets/images/home-gray.svg';
import HomeBlackSvg from '../../assets/images/home-black.svg';
import ChatGraySvg from '../../assets/images/chat-gray.svg';
import ChatBlackSvg from '../../assets/images/chat-black.svg';
import MoreGraySvg from '../../assets/images/more-gray.svg';
import MoreBlackSvg from '../../assets/images/more-black.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from './CustomText';
import {getActiveRouteName} from '../../utils/getActiveRouteName';
import {useGetUnreadChats} from 'apis/chat/useChats';
import messaging from '@react-native-firebase/messaging';
import {WINDOW_WIDTH} from 'constants/dimension';
import {useMainTabScroll} from 'context/useMainTabScroll';
import Animated from 'react-native-reanimated';

function CustomTabBar({state, descriptors, navigation}) {
  const [chatCount, setChatCount] = useState(0);
  const {tabAnimationStyle} = useMainTabScroll();

  // 현재 화면 이름
  const routeName = getActiveRouteName(state);

  const {data: unreadChats} = useGetUnreadChats();

  useEffect(() => {
    if (unreadChats !== undefined) {
      setChatCount(unreadChats);
    }
  }, [unreadChats]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async payload => {
      if (payload.data.type === 'CHAT') {
        setChatCount(JSON.parse(Number(payload.data.count)));
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Animated.View
        style={[
          routeName === 'Splash' ||
          routeName === 'PostWrite' ||
          routeName === 'Post' ||
          routeName === 'Search' ||
          routeName === 'EditName' ||
          routeName === 'LeaveCommunity' ||
          routeName === 'Profile' ||
          routeName === 'ProfileEdit' ||
          routeName === 'DeleteUser' ||
          routeName === 'ChatRoom' ||
          routeName === 'CreateChatRoom' ||
          routeName === 'ChatRoomEnter' ||
          routeName === 'Daily' ||
          routeName === 'Schedule' ||
          routeName === 'Match' ||
          routeName === 'MatchEdit' ||
          routeName === 'CreateMeet' ||
          routeName === 'MeetRecruit' ||
          routeName === 'EditMeet'
            ? {display: 'none'}
            : styles.TabContainer,
          {paddingBottom: useSafeAreaInsets().bottom},
          tabAnimationStyle,
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
              {index === 1 ? (
                isFocused ? (
                  <>
                    <CategoryBlackSvg width={22} height={22} />
                  </>
                ) : (
                  <>
                    <CategoryGraySvg width={22} height={22} />
                  </>
                )
              ) : // index === 1 ? (
              //   isFocused ? (
              //     <>
              //       <AlertBlackSvg width={22} height={22} />
              //     </>
              //   ) : (
              //     <>
              //       <AlertGraySvg width={22} height={22} />
              //     </>
              //   )
              // ) :
              index === 0 ? (
                isFocused ? (
                  <>
                    <HomeBlackSvg width={22} height={22} />
                  </>
                ) : (
                  <>
                    <HomeGraySvg width={22} height={22} />
                  </>
                )
              ) : index === 2 ? (
                isFocused ? (
                  <>
                    <ChatBlackSvg width={22} height={22} />

                    {chatCount > 0 && (
                      <View
                        className="absolute bg-[#fc3b3b] rounded-full min-w-[15] h-[15] px-1 justify-center items-center top-[8]"
                        style={{left: WINDOW_WIDTH / 8}}>
                        <CustomText
                          fontWeight="600"
                          className="text-white text-center text-[12px]">
                          {chatCount}
                        </CustomText>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <ChatGraySvg width={22} height={22} />

                    {chatCount > 0 && (
                      <View
                        className="absolute bg-[#fc3b3b] rounded-full min-w-[15] h-[15] px-1 justify-center items-center top-[8]"
                        style={{left: WINDOW_WIDTH / 8}}>
                        <CustomText
                          fontWeight="600"
                          className="text-white text-center text-[12px]">
                          {chatCount}
                        </CustomText>
                      </View>
                    )}
                  </>
                )
              ) : isFocused ? (
                <>
                  <MoreBlackSvg width={22} height={22} />
                </>
              ) : (
                <>
                  <MoreGraySvg width={22} height={22} />
                </>
              )}
            </Pressable>
          );
          // }
        })}
      </Animated.View>
    </>
  );
}
export default CustomTabBar;

const styles = StyleSheet.create({
  TabContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  Tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
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
    top: -15,
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
    top: -15,
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
