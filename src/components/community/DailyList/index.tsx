import {Player} from 'apis/player/types';
import {useGetDailys} from 'apis/post/usePosts';
import DailyCard from 'components/post/DailyCard';
import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';

interface DailyListProps {
  player: Player;
}

const DailyList = ({player}: DailyListProps) => {
  const {data: dailyData} = useGetDailys(player.id, '');
  return (
    <Tabs.FlashList
      data={dailyData?.pages.flatMap(page => page.result.dailys)}
      renderItem={({item}) => <DailyCard daily={item} />}
      estimatedItemSize={100}
    />
  );
};

export default DailyList;
