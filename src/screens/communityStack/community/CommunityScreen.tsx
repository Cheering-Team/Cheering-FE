import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CustomText from 'components/common/CustomText';
import CommunityHeader from 'components/community/CommunityInfo/CommunityHeader';
import CommunityProfile from 'components/community/CommunityInfo/CommunityProfile';
import FeedTab from 'screens/communityStack/community/feedTab';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
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
import ChatTab from 'screens/communityStack/community/chatTab';
import {useMainTabScroll} from 'context/useMainTabScroll';
import MainTab from './mainTab';
import ScheduleTab from './ScheduleTab';
import {useLightStatusBar} from 'hooks/useLightStatusBar';
import MeetTab from './meetTab';
import CommunitySelector from '../components/CommunitySelector';

const CommunityScreen = () => {
  useLightStatusBar();
  const {communityId, initialIndex} =
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
    tabRoutes,
    tabIndex,
    scrollY,
    onMomentumScrollBegin,
    listArrRef,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onTabIndexChange,
    headerTranslateY,
    community,
  } = useCommunity(communityId, initialIndex);

  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderTabBar = useCallback(
    (props: SceneRendererProps & {navigationState: NavigationState<Route>}) => {
      const {navigationState} = props;
      return (
        <Animated.FlatList
          horizontal
          data={navigationState.routes}
          style={[
            {
              height: 38,
              flexGrow: 0,
              backgroundColor: community?.color,
              zIndex: 1,
            },
            tabBarTranslateY,
          ]}
          contentContainerStyle={{paddingHorizontal: 5}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              className="mx-2 px-[6]"
              key={index}
              style={{
                borderBottomWidth: 3,
                borderBlockColor:
                  index === tabIndex ? 'white' : community?.color,
              }}
              onPress={() => {
                onTabPress(index);
                if (index === tabIndex) {
                  listArrRef.current.forEach(ref => {
                    if (ref.key === item.key) {
                      if (item.key === 'main' || item.key === 'schedule') {
                        ref.value?.scrollTo({
                          y: 70,
                          animated: true,
                        });
                      } else {
                        ref.value?.scrollToOffset({
                          offset: 70,
                          animated: true,
                        });
                      }
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
                  fontWeight={index === tabIndex ? '700' : '400'}
                  className="text-[15px] text-gray-50"
                  style={{color: index === tabIndex ? 'white' : '#fbfbfb'}}>
                  {item.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          )}
        />
      );
    },
    [community?.color, listArrRef, onTabPress, tabBarTranslateY, tabIndex],
  );

  const renderScene = useCallback(
    ({route}) => {
      const isFocused = route.key === tabRoutes[tabIndex].key;

      if (community) {
        switch (route.key) {
          case 'main':
            return (
              <MainTab
                scrollY={scrollY}
                isTabFocused={isFocused}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                listArrRef={listArrRef}
                tabRoute={route}
                community={community}
                onTabPress={onTabPress}
              />
            );
          case 'feed':
            return (
              <FeedTab
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
              <ChatTab
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
          case 'schedule':
            return (
              <ScheduleTab
                scrollY={scrollY}
                isTabFocused={isFocused}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                listArrRef={listArrRef}
                tabRoute={route}
                community={community}
              />
            );
          case 'meet':
            return (
              <MeetTab
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
          default:
            return null;
        }
      }
    },
    [
      tabRoutes,
      tabIndex,
      community,
      scrollY,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
      onScrollEndDrag,
      listArrRef,
      onTabPress,
    ],
  );

  useEffect(() => {
    if (community && !community.curFan) {
      bottomSheetModalRef.current?.present();
    }
  }, [community]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        tabScrollY.value = 0;
        previousScrollY.value = 0;
      };
    }, [previousScrollY, tabScrollY]),
  );

  if (!community) {
    return null;
  }

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: tabIndex === 0 ? 'white' : 'white',
      }}>
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
      <CommunitySelector community={community} />
    </View>
  );
};

export default CommunityScreen;
