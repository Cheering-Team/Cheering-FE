import {Community} from 'apis/player/types';
import React, {useState} from 'react';
import DailyList from '../DailyList';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, Pressable, RefreshControl} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusSvg from '../../../assets/images/plus-gray.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {useGetPosts} from 'apis/post/usePosts';
import {Post} from 'apis/post/types';
import FeedPost from '../FeedPost';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

interface StarFeedListProps {
  community: Community;
}

const StarFeedList = ({community}: StarFeedListProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: feedData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(community.id, 'PLAYER_POST', 'all', community.user !== null);

  const renderFeed: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  const loadFeed = () => {
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

  if (community.user === null) {
    return null;
  }
  return (
    <>
      <Tabs.FlatList
        data={
          feedData ? feedData?.pages.flatMap(page => page.result.posts) : []
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderFeed}
        ListHeaderComponent={<DailyList community={community} />}
        contentContainerStyle={{paddingBottom: 70}}
        onEndReached={community.user && loadFeed}
        onEndReachedThreshold={community.user && 1}
        ListFooterComponent={
          isFetchingNextPage && community.user ? (
            <FeedSkeleton type="Community" />
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <FeedSkeleton type="Community" />
          ) : (
            <ListEmpty type="feed" />
          )
        }
        refreshControl={
          community.user ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
      />
      {community.user?.type === 'MANAGER' && (
        <Pressable
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: insets.bottom + 67,
            right: 17,
            width: 42,
            height: 42,
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 100,
            shadowColor: '#000',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          onPress={() => {
            navigation.navigate('PostWrite', {playerId: community.id});
          }}>
          <PlusSvg width={20} height={20} />
        </Pressable>
      )}
    </>
  );
};

export default StarFeedList;
