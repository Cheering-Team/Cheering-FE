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
import {useGetAllMeetsByCommunity} from 'apis/meet/useMeets';
import {MeetInfo} from 'apis/meet/types';
import MeetCard from 'screens/communityStack/community/meetTab/components/MeetCard';

interface MatchMeetTabProps {
  matchId: number;
  community: Community;
}

const MatchMeetTab = ({matchId, community}: MatchMeetTabProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: meets,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllMeetsByCommunity({
    communityId: community.id,
    type: 'LIVE',
    gender: 'ANY',
    minAge: 13,
    maxAge: 45,
    ticketOption: 'ALL',
    matchId,
    keyword: '',
  });

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

  const renderItem: ListRenderItem<MeetInfo> = ({item}) => (
    <MeetCard
      meet={item}
      onPress={() => {
        navigation.navigate('MeetRecruit', {
          meetId: item.id,
          communityId: community.id,
        });
      }}
    />
  );

  return (
    <>
      <Tabs.FlatList
        data={meets?.pages.flatMap(page => page.meets) || []}
        renderItem={renderItem}
        onEndReached={loadPosts}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <FeedSkeleton type="Community" />
          ) : (
            <ListEmpty type="booking" />
          )
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </>
  );
};

export default MatchMeetTab;
