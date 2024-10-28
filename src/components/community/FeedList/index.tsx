import React, {useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import FeedFilter from '../FeedFilter';
import {useFeedList} from './useFeedList';
import {ListRenderItem, Pressable, RefreshControl} from 'react-native';
import FeedPost from '../FeedPost';
import ListEmpty from '../../common/ListEmpty/ListEmpty';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusSvg from '../../../assets/images/plus-gray.svg';
import {useNavigation} from '@react-navigation/native';
import {Post} from 'apis/post/types';
import {Player} from 'apis/player/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';

interface Props {
  community: Player;
}

const FeedList = (props: Props) => {
  const {community} = props;

  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    selectedFilter,
    setSelectedFilter,
    posts,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadPosts,
  } = useFeedList(community);

  const renderFeed: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (community.curFan == null) {
    return null;
  }

  return (
    <>
      <Tabs.FlatList
        data={isLoading ? [] : posts?.pages.flatMap(page => page.posts)}
        renderItem={renderFeed}
        ListHeaderComponent={
          community.curFan ? (
            <FeedFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 70}}
        onEndReached={community.curFan && loadPosts}
        onEndReachedThreshold={community.curFan && 1}
        ListFooterComponent={
          isFetchingNextPage && community.curFan ? (
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
          community.curFan ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
      />
      {community.curFan && (
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
            navigation.navigate('PostWrite', {communityId: community.id});
          }}>
          <PlusSvg width={20} height={20} />
        </Pressable>
      )}
    </>
  );
};

export default FeedList;
