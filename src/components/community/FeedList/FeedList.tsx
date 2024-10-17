import React, {useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import FeedFilter from '../FeedFilter';
import {useFeedList} from './useFeedList';
import {ListRenderItem, Pressable, RefreshControl} from 'react-native';
import FeedPost from '../FeedPost';
import ListLoading from '../../common/ListLoading/ListLoading';
import ListEmpty from '../../common/ListEmpty/ListEmpty';
import NotJoin from '../NotJoin';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusSvg from '../../../assets/images/plus-gray.svg';
import {useNavigation} from '@react-navigation/native';
import {Post} from 'apis/post/types';

interface Props {
  playerData: any;
  handlePresentModalPress: any;
}

const FeedList = (props: Props) => {
  const {playerData, handlePresentModalPress} = props;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    selectedFilter,
    setSelectedFilter,
    feedData,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadFeed,
  } = useFeedList(playerData);

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

  return (
    <>
      <Tabs.FlatList
        data={
          isLoading ? [] : feedData?.pages.flatMap(page => page.result.posts)
        }
        renderItem={renderFeed}
        ListHeaderComponent={
          playerData.user ? (
            <FeedFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          ) : null
        }
        contentContainerStyle={{paddingBottom: 70}}
        onEndReached={playerData.user && loadFeed}
        onEndReachedThreshold={playerData.user && 1}
        ListFooterComponent={
          isFetchingNextPage && playerData.user ? <ListLoading /> : null
        }
        ListEmptyComponent={
          !playerData.user ? (
            <NotJoin
              playerData={playerData}
              setIsModalOpen={handlePresentModalPress}
            />
          ) : isLoading ? (
            <ListLoading />
          ) : (
            <ListEmpty type="feed" />
          )
        }
        refreshControl={
          playerData.user ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
      />
      {playerData.user && (
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
            navigation.navigate('PostWrite', {playerId: playerData.id});
          }}>
          <PlusSvg width={20} height={20} />
        </Pressable>
      )}
    </>
  );
};

export default FeedList;
