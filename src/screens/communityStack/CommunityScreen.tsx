// import {
//   createMaterialTopTabNavigator,
//   MaterialTopTabBarProps,
// } from '@react-navigation/material-top-tabs';
// import React, {
//   memo,
//   RefObject,
//   useCallback,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   FlatList,
//   StyleProp,
//   StyleSheet,
//   useWindowDimensions,
//   View,
//   ViewProps,
//   ViewStyle,
// } from 'react-native';
// import CommunityFeedList from '../../components/community/CommunityFeedList/CommunityFeedList';
// import CommunityChatList from '../../components/community/CommunityChatList/CommunityChatList';
// import CommunityProfile from '../../components/community/CommunityProfile';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {CommunityStackParamList} from '../../navigations/CommunityStackNavigator';
// import {RouteProp} from '@react-navigation/native';
// import {useQuery} from '@tanstack/react-query';
// import {getPlayersInfo} from '../../apis/player';
// import Animated, {
//   FlatListPropsWithLayout,
//   interpolate,
//   SharedValue,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
// } from 'react-native-reanimated';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import TabBar from '../../components/community/TabBar';
// import HeaderOverlay from '../../components/community/HeaderOverlay';
// import useScrollSync from '../../components/community/useScrollSync';

// const TAB_BAR_HEIGHT = 48;
// const HEADER_HEIGHT = 48;
// const OVERLAY_VISIBILITY_OFFSET = 32;

// const FEED = [
//   {content: 'hello1'},
//   {content: 'hello2'},
//   {content: 'hello3'},
//   {content: 'hello4'},
//   {content: 'hello5'},
// ];

// const CHAT = [
//   {content: 'chat1'},
//   {content: 'chat2'},
//   {content: 'chat3'},
//   {content: 'chat4'},
//   {content: 'chat5'},
// ];

// export type HeaderConfig = {
//   heightExpanded: number;
//   heightCollapsed: number;
// };

// enum Visibility {
//   Hidden = 0,
//   Visible = 1,
// }

// export type ScrollPair = {
//   list: RefObject<FlatList>;
//   position: SharedValue<number>;
// };

// const Tab = createMaterialTopTabNavigator();

// export type CommunityScreenNavigationProp = NativeStackNavigationProp<
//   CommunityStackParamList,
//   'Community'
// >;

// type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

// const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
//   const {playerId} = route.params;
//   const [refreshKey, setRefreshKey] = useState(0);

//   const {data: playerData, isLoading: playerIsLoading} = useQuery({
//     queryKey: ['player', playerId, refreshKey],
//     queryFn: getPlayersInfo,
//   });

//   const {top, bottom} = useSafeAreaInsets();
//   const {height: screenHeight} = useWindowDimensions();

//   const feedsRef = useRef<FlatList>(null);
//   const chatsRef = useRef<FlatList>(null);

//   const [tabIndex, setTabIndex] = useState(0);
//   const [headerHeight, setHeaderHeight] = useState(0);

//   // 상단 헤더 높이
//   const defaultHeaderHeight = top + HEADER_HEIGHT;

//   const headerConfig = useMemo<HeaderConfig>(
//     () => ({
//       heightCollapsed: defaultHeaderHeight,
//       heightExpanded: headerHeight,
//     }),
//     [defaultHeaderHeight, headerHeight],
//   );

//   // 상단 헤더 높이, 열려있을 때 프로필 높이
//   const {heightCollapsed, heightExpanded} = headerConfig;

//   // 프로필 - 헤더 = 스크롤을 얼마나 해야할지
//   const headerDiff = heightExpanded - heightCollapsed;

//   const rendered = headerHeight > 0;

//   const handleHeaderLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
//     event => setHeaderHeight(event.nativeEvent.layout.height),
//     [],
//   );

//   // 피드 리스트 스크롤 크기
//   const feedsScrollValue = useSharedValue(0);
//   const feedsScrollHandler = useAnimatedScrollHandler(
//     event => (feedsScrollValue.value = event.contentOffset.y),
//   );

//   // 채팅 리스트 스크롤 크기
//   const chatsScrollValue = useSharedValue(0);
//   const chatsScrollHandler = useAnimatedScrollHandler(
//     event => (chatsScrollValue.value = event.contentOffset.y),
//   );

//   // 두 탭
//   const scrollPairs = useMemo<ScrollPair[]>(
//     () => [
//       {list: feedsRef, position: feedsScrollValue},
//       {list: chatsRef, position: chatsScrollValue},
//     ],
//     [feedsRef, chatsRef, chatsScrollValue, feedsScrollValue],
//   );

//   // 탭 스크롤 싱크
//   const {sync} = useScrollSync(scrollPairs, headerConfig, tabIndex);

//   // 현재 탭의 스크롤 값
//   const currentScrollValue = useDerivedValue(
//     () => (tabIndex === 0 ? feedsScrollValue.value : chatsScrollValue.value),
//     [tabIndex, feedsScrollValue, chatsScrollValue],
//   );

//   // 이동 값 : 현재 스크롤 값과 그 이상 넘어갈경우 프로필 높이로 고정
//   const translateY = useDerivedValue(
//     () => -Math.min(currentScrollValue.value, headerDiff),
//   );

//   const tabBarAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{translateY: translateY.value}],
//   }));

//   const headerAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{translateY: translateY.value}],
//   }));

//   const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
//     () => ({
//       paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
//       paddingBottom: bottom,
//       minHeight: screenHeight + headerDiff,
//     }),
//     [rendered, headerHeight, bottom, screenHeight, headerDiff],
//   );

//   const sharedProps = useMemo<
//     Partial<FlatListPropsWithLayout<{content: string}>>
//   >(
//     () => ({
//       contentContainerStyle,
//       onMomentumScrollEnd: sync,
//       onScrollEndDrag: sync,
//       scrollEventThrottle: 16,
//       scrollIndicatorInsets: {top: heightExpanded},
//     }),
//     [contentContainerStyle, heightExpanded, sync],
//   );

//   const renderFeeds = useCallback(
//     () => (
//       <CommunityFeedList
//         ref={feedsRef}
//         data={FEED}
//         onScroll={feedsScrollHandler}
//         {...sharedProps}
//       />
//     ),
//     [feedsScrollHandler, sharedProps],
//   );
//   const renderChats = useCallback(
//     () => (
//       <CommunityChatList
//         ref={chatsRef}
//         data={CHAT}
//         onScroll={chatsScrollHandler}
//         {...sharedProps}
//       />
//     ),
//     [chatsScrollHandler, sharedProps],
//   );

//   const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
//     () => [
//       rendered ? styles.tabBarContainer : undefined,
//       {top: rendered ? headerHeight : undefined},
//       tabBarAnimatedStyle,
//     ],
//     [headerHeight, rendered, tabBarAnimatedStyle],
//   );

//   const renderTabBar = useCallback<
//     (props: MaterialTopTabBarProps) => React.ReactElement
//   >(
//     props => (
//       <Animated.View style={tabBarStyle}>
//         <TabBar onIndexChange={setTabIndex} {...props} />
//       </Animated.View>
//     ),
//     [tabBarStyle],
//   );

//   const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
//     () => [rendered ? styles.headerContainer : undefined, headerAnimatedStyle],
//     [headerAnimatedStyle, rendered],
//   );

//   // 어느정도까지 안보이다가 뒤에 보이게
//   const collapsedOverlayAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(
//       translateY.value,
//       [-headerDiff, OVERLAY_VISIBILITY_OFFSET - headerDiff, 0],
//       [Visibility.Visible, Visibility.Hidden, Visibility.Hidden],
//     ),
//   }));

//   const collapsedOverlayStyle = useMemo<StyleProp<ViewStyle>>(
//     () => [
//       styles.collapsedOvarlay,
//       collapsedOverlayAnimatedStyle,
//       {height: heightCollapsed, paddingTop: top},
//     ],
//     [collapsedOverlayAnimatedStyle, heightCollapsed, top],
//   );

//   if (playerIsLoading) {
//     return null;
//   }

//   return (
//     <View style={{flex: 1}}>
//       <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
//         <CommunityProfile playerData={playerData} />
//       </Animated.View>
//       <Animated.View style={collapsedOverlayStyle}>
//         <HeaderOverlay name="Emily Davis" />
//       </Animated.View>
//       <Tab.Navigator tabBar={renderTabBar}>
//         <Tab.Screen name="피드">{renderFeeds}</Tab.Screen>
//         <Tab.Screen name="채팅">{renderChats}</Tab.Screen>
//       </Tab.Navigator>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   tabBarContainer: {
//     top: 0,
//     left: 0,
//     right: 0,
//     position: 'absolute',
//     zIndex: 1,
//   },
//   overlayName: {
//     fontSize: 24,
//   },
//   collapsedOvarlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     zIndex: 2,
//   },
//   headerContainer: {
//     top: 0,
//     left: 0,
//     right: 0,
//     position: 'absolute',
//     zIndex: 1,
//   },
// });

// export default memo(CommunityScreen);

import React, {useState} from 'react';
import {View, StyleSheet, ListRenderItem} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import CommunityHeader from '../../components/community/CommunityInfo/CommunityHeader';
import {useQuery} from '@tanstack/react-query';
import {getPlayersInfo} from '../../apis/player';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommunityProfile from '../../components/community/CommunityInfo/CommunityProfile';
import {CommunityTabBar} from '../../components/community/CommunityTabBar/CommunityTabBar';

const HEADER_HEIGHT = 375;

const DATA = [0, 1, 2, 3, 4];
const identity = (v: unknown): string => v + '';

const CommunityScreen: React.FC = ({route}) => {
  const {playerId} = route.params;
  const [refreshKey, setRefreshKey] = useState(0);
  const insets = useSafeAreaInsets();

  const {data: playerData, isLoading: playerIsLoading} = useQuery({
    queryKey: ['player', playerId, refreshKey],
    queryFn: getPlayersInfo,
  });

  const renderItem: ListRenderItem<number> = React.useCallback(({index}) => {
    return (
      <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
    );
  }, []);

  if (playerIsLoading) {
    return null;
  }

  return (
    <>
      <CommunityHeader playerData={playerData} />
      <Tabs.Container
        renderHeader={() => <CommunityProfile playerData={playerData} />}
        headerHeight={HEADER_HEIGHT} // optional
        minHeaderHeight={45 + insets.top}
        renderTabBar={props => <CommunityTabBar {...props} />}>
        <Tabs.Tab name="피드">
          <Tabs.FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={identity}
          />
        </Tabs.Tab>
        <Tabs.Tab name="채팅">
          <Tabs.ScrollView>
            <View style={[styles.box, styles.boxA]} />
            <View style={[styles.box, styles.boxB]} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: '#2196f3',
  },
});

export default CommunityScreen;
