import {Player} from 'apis/player/types';
import {useGetDailys} from 'apis/post/usePosts';
import DailyCard from 'components/post/DailyCard';
import React from 'react';
import {FlatList} from 'react-native';

interface DailyListProps {
  player: Player;
}

const DailyList = ({player}: DailyListProps) => {
  const {
    data: dailyData,
    hasNextPage,
    fetchNextPage,
  } = useGetDailys(player.id, '');

  const loadDaily = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      style={{height: 185}}
      showsHorizontalScrollIndicator={false}
      horizontal
      onEndReached={loadDaily}
      onEndReachedThreshold={1}
      data={dailyData?.pages.flatMap(page => page.result.dailys)}
      renderItem={({item}) => <DailyCard daily={item} />}
      contentContainerStyle={{
        paddingTop: 40,
        paddingLeft: 10,
        paddingBottom: 20,
      }}
    />
  );
};

export default DailyList;
