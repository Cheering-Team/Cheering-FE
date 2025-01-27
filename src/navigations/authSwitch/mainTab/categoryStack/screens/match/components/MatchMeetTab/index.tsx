import {Community} from 'apis/community/types';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {useGetAllMeetsByCommunityAndMatch} from 'apis/meet/useMeets';
import {MeetInfo} from 'apis/meet/types';
import MeetCard from 'screens/communityStack/community/meetTab/components/MeetCard';
import {MatchDetail} from 'apis/match/types';
import PlusSvg from 'assets/images/plus-white.svg';

interface MatchMeetTabProps {
  match: MatchDetail;
  community: Community;
}

const MatchMeetTab = ({match, community}: MatchMeetTabProps) => {
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
  } = useGetAllMeetsByCommunityAndMatch(community.id, match.id);

  const loadMeets = () => {
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
        onEndReached={loadMeets}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 10,
        }}
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
        ListHeaderComponent={<View className="h-2" />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
      <Pressable
        onPress={() => navigation.navigate('CreateMeet', {community})}
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
        <PlusSvg width={23} height={23} />
      </Pressable>
    </>
  );
};

export default MatchMeetTab;
