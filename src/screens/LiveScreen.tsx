import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import CustomText from '../components/CustomText';

const LiveScreen = () => {
  return (
    <Tabs.FlatList
      data={[
        {content: 'hello'},
        {content: 'hello'},
        {content: 'hello'},
        {content: 'hello'},
      ]}
      renderItem={({item}) => (
        <CustomText style={{paddingVertical: 150}}>{item.content}</CustomText>
      )}
    />
  );
};

export default LiveScreen;
