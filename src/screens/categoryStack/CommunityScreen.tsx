import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Pressable, SafeAreaView, View, Keyboard} from 'react-native';
import {FlatList as FlatListType} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getPlayersInfo} from '../../apis/player';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';
import PencilSvg from '../../../assets/images/pencil.svg';
import JoinModal from '../../components/category/community/JoinModal';
import CommunityFlatList from '../../components/category/community/CommunityFlatList/CommunityFlatList';
CommunityFlatList;

const CommunityScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playerId = route.params.playerId;

  const translateY = useRef(new Animated.Value(500)).current;

  const {data: playerData, isLoading: playerIsLoading} = useQuery({
    queryKey: ['player', playerId, refreshKey],
    queryFn: getPlayersInfo,
  });

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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardDidShow, keyboardDidHide, translateY]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollTimeout = useRef(null);
  const flatListRef = useRef<FlatListType<any>>(null);

  const handleScrollBeginDrag = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollEndDrag = () => {
    scrollTimeout.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 1700);
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (playerIsLoading) {
    return <></>;
  }

  return (
    <>
      <View key={refreshKey} style={{flex: 1, paddingBottom: insets.bottom}}>
        <CommunityFlatList
          ref={flatListRef}
          playerData={playerData}
          playerId={playerId}
          translateY={translateY}
          setIsModalOpen={setIsModalOpen}
          handleScrollBeginDrag={handleScrollBeginDrag}
          handleScrollEndDrag={handleScrollEndDrag}
        />
        <JoinModal
          playerId={playerId}
          playerData={playerData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          translateY={translateY}
          setRefreshKey={setRefreshKey}
        />
      </View>
      {playerData.result.user && (
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: insets.bottom + 67,
            right: 17,
          }}>
          <AnimatedPressable
            style={[
              {
                borderRadius: 100,
                width: 48,
                height: 48,
                marginBottom: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                shadowColor: '#bdbdbd',
                shadowOffset: {width: 1, height: 2},
                shadowOpacity: 0.7,
                shadowRadius: 3,
                elevation: 5,
              },
              {opacity: fadeAnim},
            ]}
            onPress={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToOffset({offset: 0, animated: true});
              }
            }}>
            <ChevronTopSvg width={25} height={25} />
          </AnimatedPressable>

          <View
            style={{
              borderRadius: 100,
              backgroundColor: 'white',
              shadowColor: '#999999',
              shadowOffset: {width: 1, height: 2},
              shadowOpacity: 0.9,
              shadowRadius: 3,
              elevation: 5,
            }}>
            <Pressable
              style={{
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#282828',
                borderRadius: 100,
              }}
              onPress={() => {
                navigation.navigate('PostWrite', {playerId});
              }}>
              <PencilSvg width={25} height={25} />
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default CommunityScreen;
