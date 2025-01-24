import {Community} from 'apis/community/types';
import {Post} from 'apis/post/types';
import {useGetVotes} from 'apis/post/usePosts';
import FeedPost from 'components/community/FeedPost';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import SortSvg from 'assets/images/sort.svg';
import CustomText from 'components/common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import PenSvg from 'assets/images/pencil-white.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';

interface VoteListProps {
  matchId: number;
  community: Community;
}

const VoteList = ({matchId, community}: VoteListProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [orderBy, setOrderBy] = useState<'latest' | 'votes'>('latest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: posts,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetVotes(matchId, community.id, orderBy);

  const loadPosts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderItem: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  return (
    <>
      <Tabs.FlatList
        data={posts?.pages.flatMap(page => page.posts) || []}
        renderItem={renderItem}
        onEndReached={loadPosts}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        onEndReachedThreshold={1}
        ListHeaderComponent={
          posts?.pages.flatMap(page => page.posts).length === 0 ? (
            <View className="h-[52]" />
          ) : (
            <View>
              <Pressable
                className="flex-row self-end items-center mr-4 mt-3"
                onPress={() =>
                  setOrderBy(prev => (prev === 'latest' ? 'votes' : 'latest'))
                }>
                <SortSvg width={12} height={12} />
                <CustomText
                  className="ml-1 text-base text-gray-600"
                  fontWeight="600">
                  {orderBy === 'votes' ? '투표순' : '최신순'}
                </CustomText>
              </Pressable>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <FeedSkeleton type="Community" />
          ) : (
            <ListEmpty type="vote" />
          )
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />

      <Pressable
        onPress={() => navigation.navigate('PostWrite', {community})}
        className="absolute p-[11] rounded-full z-50"
        style={{
          backgroundColor: community.color,
          bottom: insets.bottom + 15,
          right: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}>
        <PenSvg width={23} height={23} />
      </Pressable>
    </>
  );
};

export default VoteList;
