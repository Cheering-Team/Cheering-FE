// import React, {useRef} from 'react';
// import {Tabs} from 'react-native-collapsible-tab-view';
// import CommunityHeader from '../../components/community/CommunityInfo/CommunityHeader';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import CommunityProfile from '../../components/community/CommunityInfo/CommunityProfile';
// import {CommunityTabBar} from '../../components/community/CommunityTabBar/CommunityTabBar';
// import FeedList from '../../components/community/FeedList';
// import ChatList from '../../components/community/ChatList/ChatList';
// import {WINDOW_HEIGHT} from '../../constants/dimension';
// import JoinModal from '../../components/community/JoinModal/JoinModal';
// import {BottomSheetModal} from '@gorhom/bottom-sheet';
// import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
// import {RouteProp} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import NotJoin from 'components/community/NotJoin';
// import {useGetCommunityById} from 'apis/community/useCommunities';

// const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

// export type CommunityScreenNavigationProp = NativeStackNavigationProp<
//   CommunityStackParamList,
//   'Community'
// >;

// type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

// const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
//   const {communityId} = route.params;

//   const insets = useSafeAreaInsets();

//   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

//   const {data: community} = useGetCommunityById(communityId);

//   if (!community) {
//     return null;
//   }

//   return (
//     <>
//       <CommunityHeader community={community} />
//       <Tabs.Container
//         renderHeader={() => <CommunityProfile community={community} />}
//         headerHeight={HEADER_HEIGHT}
//         minHeaderHeight={45 + insets.top}
//         renderTabBar={props => (
//           <CommunityTabBar
//             {...props}
//             labelStyle={{color: 'white'}}
//             tabStyle={{backgroundColor: 'black'}}
//             indicatorStyle={{backgroundColor: 'white'}}
//             activeColor={community.color}
//           />
//         )}>
//         <Tabs.Tab name="피드">
//           <FeedList community={community} />
//         </Tabs.Tab>
//         <Tabs.Tab name="채팅">
//           <ChatList community={community} />
//         </Tabs.Tab>
//       </Tabs.Container>
//       {community.curFan == null && (
//         <NotJoin
//           community={community}
//           bottomSheetModalRef={bottomSheetModalRef}
//         />
//       )}
//       <JoinModal
//         community={community}
//         bottomSheetModalRef={bottomSheetModalRef}
//       />
//     </>
//   );
// };

// export default CommunityScreen;

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetCommunityById} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import CommunityHeader from 'components/community/CommunityInfo/CommunityHeader';
import CommunityProfile from 'components/community/CommunityInfo/CommunityProfile';
import FeedList from 'components/community/FeedList';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import {useCommunity} from './useCommunity';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import JoinProfile from 'components/community/JoinModal/JoinProfile/JoinProfile';

const CommunityScreen = () => {
  const {communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'Community'>>().params;
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [260 + insets.bottom], [insets.bottom]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const {
    tabBarTranslateY,
    onTabPress,
    animatedIndicatorStyle,
    tabRoutes,
    tabIndex,
    scrollY,
    onMomentumScrollBegin,
    listArrRef,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onTabIndexChange,
    headerTranslateY,
  } = useCommunity();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: community} = useGetCommunityById(communityId);

  const renderTabBar = useCallback(
    (props: SceneRendererProps & {navigationState: NavigationState<Route>}) => {
      const {navigationState} = props;
      return (
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              backgroundColor: community?.color,
              zIndex: 1,
            },
            tabBarTranslateY,
          ]}>
          {navigationState.routes.map((route, idx) => {
            return (
              <TouchableOpacity
                style={{flex: 1}}
                key={idx}
                onPress={() => onTabPress(idx)}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <CustomText style={{color: 'white', fontSize: 16.5}}>
                    {route.title}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          })}
          <Animated.View
            className="absolute bottom-0 h-[3] bg-white"
            style={[{width: WINDOW_WIDTH / 2}, animatedIndicatorStyle]}
          />
        </Animated.View>
      );
    },
    [community],
  );

  const renderScene = useCallback(
    ({route}) => {
      const isFocused = route.key === tabRoutes[tabIndex].key;

      if (community) {
        switch (route.key) {
          case 'feed':
            return (
              <FeedList
                scrollY={scrollY}
                isTabFocused={isFocused}
                onMomentumScrollBegin={onMomentumScrollBegin}
                listArrRef={listArrRef}
                tabRoute={route}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                community={community}
              />
            );
          case 'chat':
            return (
              <FeedList
                scrollY={scrollY}
                isTabFocused={isFocused}
                onMomentumScrollBegin={onMomentumScrollBegin}
                listArrRef={listArrRef}
                tabRoute={route}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                community={community}
              />
            );
        }
      }
    },
    [tabIndex],
  );

  useEffect(() => {
    if (community && !community.curFan) {
      bottomSheetModalRef.current?.present();
    }
  }, [community]);

  if (!community) {
    return null;
  }

  return (
    <View className="flex-1">
      <CommunityHeader community={community} scrollY={scrollY} />
      <TabView
        navigationState={{index: tabIndex, routes: tabRoutes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={onTabIndexChange}
      />
      <Animated.View
        style={[{position: 'absolute', width: '100%'}, headerTranslateY]}>
        <CommunityProfile community={community} />
      </Animated.View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={index => {
          if (index === -1 && !community.curFan) {
            navigation.goBack();
          }
        }}
        keyboardBlurBehavior="restore"
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize">
        <BottomSheetView
          style={[
            {paddingBottom: insets.bottom + 20, flex: 1, alignItems: 'center'},
          ]}>
          <JoinProfile
            community={community}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default CommunityScreen;
