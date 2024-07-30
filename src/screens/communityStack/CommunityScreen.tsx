import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Dimensions} from 'react-native';
import {FlatList as FlatListType} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getPlayersInfo} from '../../apis/player';
import JoinModal from '../../components/category/community/JoinModal/JoinModal';
import CommunityFlatList from '../../components/category/community/CommunityFlatList/CommunityFlatList';
import CommunityHeader from '../../components/category/community/CommunityHeader';
import CommunityTopTab from '../../components/category/community/CommunityTopTab';

import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from '../../navigations/CommunityStackNavigator';
import FloatButton from '../../components/category/community/FloatButton/FloatButton';
CommunityFlatList;

export type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'Community'
>;

type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
  const {playerId} = route.params;
  const insets = useSafeAreaInsets();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToTop, setIsToTop] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollTimeout = useRef(setTimeout(() => {}));
  const flatListRef = useRef<FlatListType<any>>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {data: playerData, isLoading: playerIsLoading} = useQuery({
    queryKey: ['player', playerId, refreshKey],
    queryFn: getPlayersInfo,
  });

  const handleScrollBeginDrag = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    setIsToTop(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollEndDrag = () => {
    scrollTimeout.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsToTop(false));
    }, 1000);
  };

  useEffect(() => {
    const listenerId = scrollY.addListener(({value}) => {
      if (
        value >= Dimensions.get('window').height / 2.25 - insets.top - 50 &&
        !isTabVisible
      ) {
        setIsTabVisible(true);
      } else if (
        value < Dimensions.get('window').height / 2.25 - insets.top - 50 &&
        isTabVisible
      ) {
        setIsTabVisible(false);
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, isTabVisible, insets.top]);

  if (playerIsLoading) {
    return null;
  }
  return (
    <>
      <View key={refreshKey} style={{flex: 1, paddingBottom: insets.bottom}}>
        <CommunityHeader playerData={playerData} scrollY={scrollY} />
        {isTabVisible && <CommunityTopTab type="absolute" scrollY={scrollY} />}
        <CommunityFlatList
          ref={flatListRef}
          playerData={playerData}
          handleScrollBeginDrag={handleScrollBeginDrag}
          handleScrollEndDrag={handleScrollEndDrag}
          setIsModalOpen={setIsModalOpen}
          scrollY={scrollY}
        />
        <JoinModal
          playerData={playerData}
          isModalOpen={isModalOpen}
          setRefreshKey={setRefreshKey}
          setIsModalOpen={setIsModalOpen}
        />
      </View>
      {playerData.result.user && (
        <FloatButton
          playerId={playerData.result.id}
          fadeAnim={fadeAnim}
          flatListRef={flatListRef}
          isToTop={isToTop}
        />
      )}
    </>
  );
};

export default CommunityScreen;
