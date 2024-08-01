import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigations/HomeStackNavigator';
import {getMyPlayers} from '../../apis/player';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {useHomeFlatListHook} from '../../components/home/useHomeFlatListHook';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import {getMyPlayersPosts} from '../../apis/post';
import FeedPost from '../../components/category/community/FeedPost';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import CustomText from '../../components/common/CustomText';
import Avatar from '../../components/common/Avatar';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

const HomeScreen = ({navigation}: {navigation: HomeScreenNavigationProp}) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [hotTab, setHotTab] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollTimeout = useRef(null);

  const [scrollY, styles, onLayoutHeaderElement, onLayoutStickyElement] =
    useHomeFlatListHook();

  const {data: playerData, isLoading: playerIsLoadling} = useQuery({
    queryKey: ['my', 'players'],
    queryFn: getMyPlayers,
  });

  const {
    data: feedData,
    isLoading: feedIsLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['my', 'posts', hotTab],
    queryFn: getMyPlayersPosts,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: 55,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <CustomText
          fontWeight="600"
          style={{
            fontSize: 28,
          }}>
          Cheering
        </CustomText>
      </View>
      <Animated.View
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}>
        {!playerIsLoadling && (
          <FlatList
            style={{
              flexGrow: 0,
              paddingHorizontal: 8,
              backgroundColor: 'white',
            }}
            data={[{id: 0, koreanName: '전체'}, ...playerData?.result]}
            horizontal={true}
            renderItem={({item}) => (
              <Pressable
                onPress={() => setHotTab(item.id)}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 12,
                    marginBottom: 0,
                    paddingBottom: 12,
                  },
                ]}>
                {item.id !== 0 && (
                  <Avatar
                    uri={item.image}
                    size={23}
                    style={{borderWidth: 1, borderColor: '#e2e2e2'}}
                  />
                )}

                <CustomText
                  fontWeight="500"
                  style={{
                    marginLeft: item.id ? 7 : 0,
                    fontSize: 17,
                    color: item.id === hotTab ? '#58a04b' : 'black',
                  }}>
                  {item === '전체' ? '전체' : item.koreanName}
                </CustomText>
                {item.id === hotTab && (
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      left: 0,
                      backgroundColor: '#58a04b',
                      height: 3,
                    }}
                  />
                )}
              </Pressable>
            )}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 7,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderColor: '#e7e7e7',
          }}>
          {playerData?.result.length > 0 && (
            <CustomText
              fontWeight="500"
              style={{color: '#686868', fontSize: 15, paddingBottom: 2}}>
              🔥 실시간 인기 게시글
            </CustomText>
          )}

          {hotTab !== 0 && (
            <Pressable
              onPress={() => {
                navigation.navigate('CommunityStack', {
                  screen: 'Community',
                  params: {playerId: hotTab},
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderRadius: 15,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}>
              <CustomText
                fontWeight="500"
                style={{
                  color: '#686868',
                  fontSize: 14,
                  paddingBottom: 2,
                  marginRight: 3,
                }}>
                커뮤니티 바로가기
              </CustomText>
              <ChevronRightSvg width={10} height={10} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <Animated.FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}
        ListHeaderComponent={
          <Animated.View onLayout={onLayoutHeaderElement}>
            {/* header */}
            <View
              style={{
                height: 200,
                backgroundColor: '#eeeeee',
              }}></View>
          </Animated.View>
        }
        ListHeaderComponentStyle={styles.header}
        data={feedData?.pages.flatMap(page => page.result.posts)}
        renderItem={({item}) => (
          <FeedPost
            feed={item}
            playerId={hotTab}
            postId={item.id}
            hotTab={hotTab}
          />
        )}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={
          feedIsLoading || isFetchingNextPage ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => (
          <View
            style={{backgroundColor: '#F0F2F5', height: 6, width: '100%'}}
          />
        )}
        onEndReached={loadFeed}
        onEndReachedThreshold={1}
        ListEmptyComponent={
          !feedIsLoading ? (
            playerData?.result.length > 0 ? (
              <View
                style={{
                  height: Dimensions.get('window').height * 0.3 + 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomText
                  fontWeight="600"
                  style={{fontSize: 23, marginBottom: 5}}>
                  아직 인기 게시글이 없어요
                </CustomText>
                <CustomText style={{color: '#5b5b5b'}}>
                  게시글을 작성해보세요
                </CustomText>
              </View>
            ) : (
              <View
                style={{
                  height: Dimensions.get('window').height * 0.3 + 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomText
                  fontWeight="600"
                  style={{fontSize: 23, marginBottom: 5}}>
                  아직 가입한 커뮤니티가 없어요
                </CustomText>
                <CustomText style={{color: '#5b5b5b'}}>
                  좋아하는 선수를 찾아보세요
                </CustomText>
                <Pressable
                  style={{marginTop: 10}}
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'CategoryStack'}],
                      }),
                    )
                  }>
                  <CustomText
                    fontWeight="500"
                    style={{color: '#58a04b', fontSize: 15}}>
                    선수 찾기
                  </CustomText>
                </Pressable>
              </View>
            )
          ) : (
            <></>
          )
        }
      />
      <AnimatedPressable
        style={[
          {
            position: 'absolute',
            bottom: insets.bottom + 67,
            right: 17,
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
    </SafeAreaView>
  );
};

export default HomeScreen;
