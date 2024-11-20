import React from 'react';
import {Platform, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import CustomText from '../common/CustomText';

interface FilterDataType {
  name: string;
  filter: 'all' | 'hot' | 'photo' | 'viewing' | 'information';
}

const FeedFilterData: FilterDataType[] = [
  {name: '전체', filter: 'all'},
  {name: '🔥 HOT', filter: 'hot'},
  {name: '📸 직찍사', filter: 'photo'},
  {name: '👀 직관인증', filter: 'viewing'},
  {name: '🔎 정보', filter: 'information'},
];

interface FeedFilterProps {
  selectedFilter: string;
  setSelectedFilter: any;
}

const FeedFilter = (props: FeedFilterProps) => {
  const {selectedFilter, setSelectedFilter} = props;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer]}>
        {FeedFilterData.map(item => (
          <Pressable
            key={item.filter}
            onPress={() => {
              if (item.filter !== selectedFilter) {
                setSelectedFilter(item.filter);
              }
            }}
            style={[
              styles.filterItem,
              item.filter === selectedFilter && styles.selectedFilterItem,
              item.filter === 'all' && {marginLeft: 15},
            ]}>
            <CustomText
              fontWeight="500"
              style={[
                styles.filterName,
                item.filter === selectedFilter && styles.selectedFilterNmae,
                Platform.OS === 'android' && {lineHeight: 22},
              ]}>
              {item.name}
            </CustomText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  scrollContainer: {paddingRight: 30},
  openedScrollContainer: {flexDirection: 'row', flexWrap: 'wrap'},
  filterItem: {
    height: 35,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openedFilterItem: {marginBottom: 10},
  selectedFilterItem: {backgroundColor: '#3a3a3a', borderColor: '#3a3a3a'},
  filterName: {fontSize: 15},
  selectedFilterNmae: {color: 'white'},
  blur: {
    right: 10,
    width: 50,
    height: 40,
    top: -3,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  openButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 20,
    padding: 5,
  },
});

export default FeedFilter;
