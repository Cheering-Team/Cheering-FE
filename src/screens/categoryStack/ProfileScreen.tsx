import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import CloseSvg from '../../../assets/images/close-black.svg';
import MoreSvg from '../../../assets/images/three-dots-black.svg';
import {FlatList} from 'react-native-gesture-handler';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {getPlayerUserInfo, getPlayerUserPosts} from '../../apis/player';
import Avatar from '../../components/common/Avatar';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import FeedPost from '../../components/category/community/FeedPost';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';

const ProfileScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollTimeout = useRef(null);

  const {data, isLoading} = useQuery({
    queryKey: ['playerusers', playerUserId],
    queryFn: getPlayerUserInfo,
  });

  const {
    data: feedData,
    isLoading: feedIsLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['playerusers', playerUserId, 'posts'],
    queryFn: getPlayerUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
  });

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

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 11,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <CloseSvg width={30} height={30} />
        </Pressable>
        <Pressable>
          <MoreSvg width={18} height={18} />
        </Pressable>
      </View>
      <Animated.FlatList
        ref={flatListRef}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        ListHeaderComponent={
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#efefef',
              paddingBottom: 20,
            }}>
            <View style={{flexDirection: 'row', padding: 22}}>
              <Avatar uri={data.result.user.image} size={68} />
              <View style={{marginLeft: 15, marginTop: 3}}>
                <CustomText fontWeight="500" style={{fontSize: 22}}>
                  {data.result.user.nickname}
                </CustomText>
                <CustomText fontWeight="300" style={{marginTop: 2}}>
                  2 팔로워
                </CustomText>
              </View>
            </View>
            <View style={{paddingHorizontal: 20}}>
              {data.result.isUser ? (
                <CustomButton type="ghost" text="프로필 편집" />
              ) : (
                <CustomButton type="normal" text="팔로우" />
              )}
            </View>
          </View>
        }
        data={feedData?.pages.flatMap(page => page.result.posts)}
        renderItem={({item}) => (
          <Pressable
            key={item.id}
            onPress={() => {
              navigation.navigate('Post', {postId: item.id});
            }}>
            <FeedPost
              feed={item}
              postId={item.id}
              playerId={data.result.playerId}
            />
          </Pressable>
        )}
        onEndReached={loadFeed}
        onEndReachedThreshold={0}
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
        ListEmptyComponent={
          !feedIsLoading ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CustomText
                fontWeight="600"
                style={{fontSize: 23, marginBottom: 5}}>
                아직 게시글이 없어요
              </CustomText>
              <CustomText style={{color: '#5b5b5b'}}>
                가장 먼저 게시글을 작성해보세요
              </CustomText>
            </View>
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

export default ProfileScreen;
