import React from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useState} from 'react';
import ChevronTopSvg from '../../../assets/images/chevron-top-black.svg';
import ChevronDownSvg from '../../../assets/images/chevron-down-black.svg';
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
    borderWidth: 1,
    borderColor: '#dcdcdc',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginRight: 6,
  },
  openedFilterItem: {marginBottom: 10},
  selectedFilterItem: {backgroundColor: '#3a3a3a', borderColor: '#3a3a3a'},
  filterName: {fontSize: 14},
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
