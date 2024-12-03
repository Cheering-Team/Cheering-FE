import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useGetCommunityById} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import CommunityHeader from 'components/community/CommunityInfo/CommunityHeader';
import CommunityProfile from 'components/community/CommunityInfo/CommunityProfile';
import FeedList from 'components/community/FeedList';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useCallback, useEffect, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
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
import ChatList from 'components/community/ChatList/ChatList';

const CommunityScreen = () => {
  const {communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'Community'>>().params;
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

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
                onPress={() => {
                  onTabPress(idx);
                  if (idx === tabIndex) {
                    listArrRef.current.forEach(item => {
                      if (item.key === route.key) {
                        item.value?.scrollToOffset({
                          offset: WINDOW_HEIGHT / 2 - 45 - insets.top,
                          animated: true,
                        });
                      }
                    });
                  }
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <CustomText
                    fontWeight="600"
                    style={{color: 'white', fontSize: 16.5}}>
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
    [community, tabIndex],
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
              <ChatList
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
    [tabIndex, community],
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
        style={[{position: 'absolute', width: '100%'}, headerTranslateY]}
        pointerEvents="box-none">
        <CommunityProfile community={community} />
      </Animated.View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        onDismiss={() => {
          if (!community.curFan) {
            navigation.goBack();
          }
        }}
        enableDynamicSizing={true}
        keyboardBlurBehavior="restore"
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize">
        <BottomSheetView
          style={[{paddingBottom: insets.bottom + 20, alignItems: 'center'}]}>
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
