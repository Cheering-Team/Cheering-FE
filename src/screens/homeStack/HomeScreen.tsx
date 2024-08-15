import React, {useEffect, useRef, useState} from 'react';
import {Animated, FlatList, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMyPlayers} from '../../apis/player';
import {useQuery} from '@tanstack/react-query';
import HomeHeader from '../../components/home/HomeHeader/HomeHeader';
import HomeTopTab from '../../components/home/HomeTopTab/HomeTopTab';
import HomeFlatList from '../../components/home/HomeFlatList/HomeFlatList';
import FloatButton from '../../components/community/FloatButton/FloatButton';
import messaging from '@react-native-firebase/messaging';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [hotTab, setHotTab] = useState<number>(0);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [isToTop, setIsToTop] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollTimeout = useRef(setTimeout(() => {}));
  const scrollY = useRef(new Animated.Value(0)).current;

  const {data: playerData, isLoading} = useQuery({
    queryKey: ['my', 'players'],
    queryFn: getMyPlayers,
  });

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log(authStatus);
  //   }
  // };

  // useEffect(() => {
  //   requestUserPermission();
  // }, []);

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
      if (value >= 205 && !isTabVisible) {
        setIsTabVisible(true);
      } else if (value < 205 && isTabVisible) {
        setIsTabVisible(false);
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, isTabVisible, insets.top]);

  if (isLoading) {
    return null;
  }

  return (
    <View style={{flex: 1, paddingBottom: insets.bottom}}>
      <HomeHeader />
      {isTabVisible && (
        <HomeTopTab
          type="absolute"
          scrollY={scrollY}
          playerData={playerData}
          hotTab={hotTab}
          setHotTab={setHotTab}
        />
      )}
      <HomeFlatList
        ref={flatListRef}
        playerData={playerData}
        handleScrollBeginDrag={handleScrollBeginDrag}
        handleScrollEndDrag={handleScrollEndDrag}
        hotTab={hotTab}
        setHotTab={setHotTab}
        scrollY={scrollY}
      />
      <FloatButton
        fadeAnim={fadeAnim}
        flatListRef={flatListRef}
        isToTop={isToTop}
        offset={205}
      />
    </View>
  );
};

export default HomeScreen;
