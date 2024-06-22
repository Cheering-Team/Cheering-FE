import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Pressable, SafeAreaView, View, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getPlayersInfo} from '../../apis/player';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';
import PencilSvg from '../../../assets/images/pencil.svg';
import CommunityHeader from '../../components/category/community/CommunityHeader';
import CommunityProfile from '../../components/category/community/CommunityProfile';
import TeamList from '../../components/category/community/TeamList';
import CommunityTopTab from '../../components/category/community/CommunityTab';
import FeedFilter from '../../components/category/community/FeedFilter';
import FeedPost from '../../components/category/community/FeedPost';
import NotJoin from '../../components/category/community/NotJoin';
import JoinModal from '../../components/category/community/JoinModal';

const feedData = [
  {
    content: '피드입니다',
    createdAt: '06.13 09:04',
    writer: {id: 1, name: '전준우짱', image: ''},
  },
  {
    content: '피드입니다',
    createdAt: '06.13 09:04',
    writer: {id: 1, name: '전준우짱', image: ''},
  },
  {
    content: '피드입니다',
    createdAt: '06.13 09:04',
    writer: {id: 1, name: '전준우짱', image: ''},
  },
  {
    content: '피드입니다',
    createdAt: '06.13 09:04',
    writer: {id: 1, name: '전준우짱', image: ''},
  },
];

const CommunityScreen = ({navigation, route}) => {
  const scrollY = new Animated.Value(0);
  const insets = useSafeAreaInsets();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playerId = route.params.playerId;

  const translateY = useRef(new Animated.Value(500)).current;

  const {data, isLoading} = useQuery({
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
  const scrollViewRef = useRef(null);

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

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <SafeAreaView key={refreshKey}>
        <CommunityHeader scrollY={scrollY} playerData={data} />
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEnabled={!!data.result.user}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}>
          <CommunityProfile playerData={data} />
          <View style={{position: 'relative', bottom: 50, marginBottom: -40}}>
            <TeamList playerData={data} />
            <CommunityTopTab />
          </View>
          {data.result.user ? (
            <>
              <FeedFilter />
              {feedData.map((feed, idx) => (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Post', {postId: idx});
                  }}>
                  <FeedPost feed={feed} idx={idx} key={idx} />
                </Pressable>
              ))}
            </>
          ) : (
            <NotJoin
              playerData={data}
              setIsModalOpen={setIsModalOpen}
              translateY={translateY}
            />
          )}
        </Animated.ScrollView>
        <JoinModal
          playerId={playerId}
          playerData={data}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          translateY={translateY}
          setRefreshKey={setRefreshKey}
        />
      </SafeAreaView>
      {data.result.user && (
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
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({y: 0, animated: true});
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
