import {useGetPopularPlayers} from 'apis/community/useCommunities';
import {Post} from 'apis/post/types';
import {useGetMyHotPosts} from 'apis/post/usePosts';
import {useGetPopularTeams} from 'apis/team/useTeams';
import CustomText from 'components/common/CustomText';
import FeedPost from 'components/community/FeedPost';
import React, {useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ToolTipSvg from 'assets/images/tooltip.svg';
import Tooltip from 'components/common/Tooltip';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';

const HomeHotScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [isTooltipVisibe, setIsTooltipVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const opacity = useSharedValue(0);

  const {data: popularTeams, refetch: refetchTeams} = useGetPopularTeams();
  const {data: popularPlayers, refetch: refetchPlayers} =
    useGetPopularPlayers();
  const {data: hotPosts, refetch} = useGetMyHotPosts();

  const handleLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setDimensions({width, height});
  };

  const showTooltip = () => {
    setIsTooltipVisible(true);
    opacity.value = withTiming(1, {duration: 100}, () => {
      runOnJS(startHideTooltipTimer)();
    });
  };

  const startHideTooltipTimer = () => {
    setTimeout(() => {
      opacity.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setIsTooltipVisible)(false);
      });
    }, 3000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
    refetchPlayers();
    refetchTeams();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderItem: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="home" />
  );

  return (
    <View className="flex-1">
      <FlatList
        data={hotPosts?.pages.flatMap(page => page.posts) || []}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        ListHeaderComponent={
          <View>
            <View>
              <CustomText type="title" className="text-xl px-3 py-2">
                현재 인기있는 팀
              </CustomText>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={popularTeams || []}
                renderItem={({item, index}) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('CommunityStack', {
                        screen: 'Community',
                        params: {communityId: item.id},
                      })
                    }
                    className="items-center border border-slate-100 p-2 rounded-[4px]"
                    style={{
                      width: 130,
                      marginLeft: index === 0 ? 12 : 0,
                      marginRight: 6,
                    }}>
                    <FastImage
                      source={{uri: item.image}}
                      className="w-[80] h-[80] border border-slate-200 rounded-full"
                      resizeMode="contain"
                    />
                    <CustomText fontWeight="700" className="mt-4">
                      {item.koreanName}
                    </CustomText>
                    <CustomText
                      className="text-[11px] text-gray-600 mt-[3]"
                      fontWeight="400">{`${item.sportName}/${item.leagueName}`}</CustomText>
                    <View className="bg-black mt-5 rounded-lg w-[93%] items-center">
                      <CustomText fontWeight="500" className="text-white py-2">
                        바로가기
                      </CustomText>
                    </View>
                  </Pressable>
                )}
              />
            </View>
            <View>
              <CustomText type="title" className="text-xl px-3 py-2 mt-4">
                현재 인기있는 선수
              </CustomText>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={popularPlayers || []}
                renderItem={({item, index}) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('CommunityStack', {
                        screen: 'Community',
                        params: {communityId: item.id},
                      })
                    }
                    className="items-center border border-slate-100 p-2 rounded-[4px]"
                    style={{
                      width: 130,
                      marginLeft: index === 0 ? 12 : 0,
                      marginRight: 6,
                    }}>
                    <FastImage
                      source={{uri: item.image}}
                      className="w-[80] h-[80] border border-slate-200 rounded-full"
                      resizeMode="cover"
                    />
                    <CustomText fontWeight="700" className="mt-4">
                      {item.koreanName}
                    </CustomText>
                    <CustomText
                      className="text-[11px] text-gray-600 mt-[3]"
                      fontWeight="400">
                      {item.firstTeamName}
                    </CustomText>
                    <View className="bg-black mt-5 rounded-lg w-[93%] items-center">
                      <CustomText fontWeight="500" className="text-white py-2">
                        바로가기
                      </CustomText>
                    </View>
                  </Pressable>
                )}
              />
            </View>
            <View className="flex-row px-3 py-1 mt-4 items-center">
              <CustomText
                type="titleCenter"
                className="text-xl mr-[6]"
                onLayout={handleLayout}>
                현재 인기 게시글
              </CustomText>
              <Pressable onPress={showTooltip}>
                <ToolTipSvg width={14} height={14} />
              </Pressable>
            </View>
            {isTooltipVisibe && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: dimensions.width,
                    bottom: dimensions.height + 6,
                    zIndex: 100,
                  },
                  animatedStyle,
                ]}>
                <Tooltip
                  message={
                    '내가 가입한 커뮤니티에서 좋아요를 \n일정 수 이상 받은 게시글입니다'
                  }
                />
              </Animated.View>
            )}
          </View>
        }
        ListEmptyComponent={<ListEmpty type="hot" />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#787878']}
          />
        }
      />
    </View>
  );
};

export default HomeHotScreen;
