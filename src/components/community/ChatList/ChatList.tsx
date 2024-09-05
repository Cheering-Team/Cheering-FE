import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';

interface Props {
  playerData: any;
}

const ChatList = (props: Props) => {
  const {playerData} = props;

  return (
    <Tabs.FlatList
      data={[]}
      renderItem={() => <></>}
      scrollEnabled={!!playerData.user}
    />
  );
};

export default ChatList;
