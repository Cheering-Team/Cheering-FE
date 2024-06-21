import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';
import CustomText from '../../CustomText';

const CommunityTopTab = () => {
  const [curTab, setCurTab] = useState('피드');

  return (
    <FlatList
      style={styles.container}
      horizontal={true}
      data={[{name: '피드'}, {name: '채팅'}]}
      renderItem={({item}) => (
        <Pressable
          style={[
            styles.tabItem,
            curTab === item.name && styles.selectedTabItem,
          ]}
          key={item.name}
          onPress={() => {
            setCurTab(item.name);
          }}>
          <CustomText
            fontWeight={curTab === item.name ? '700' : '700'}
            style={[
              styles.tabName,
              curTab === item.name && styles.selectedTabName,
            ]}>
            {item.name}
          </CustomText>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'black',
  },
  tabItem: {
    paddingTop: 5,
    paddingBottom: 2,
    marginBottom: 2,
    marginHorizontal: 15,
    paddingHorizontal: 2,
  },
  selectedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabName: {fontSize: 17, color: '#9f9f9f'},
  selectedTabName: {color: 'white'},
});

export default CommunityTopTab;
