import {Player} from 'apis/player/types';
import React from 'react';
import DailyList from '../DailyList';
import {Tabs} from 'react-native-collapsible-tab-view';
import {View} from 'react-native';
import CustomText from 'components/common/CustomText';

interface StarFeedListProps {
  player: Player;
}

const StarFeedList = ({player}: StarFeedListProps) => {
  return (
    <>
      <Tabs.FlatList
        data={[]}
        renderItem={({item}) => (
          <View className="h-10">
            <CustomText>{item}</CustomText>
          </View>
        )}
        ListHeaderComponent={<DailyList player={player} />}
      />
    </>
  );
};

export default StarFeedList;
