import React from 'react';
import {Pressable, ScrollView} from 'react-native';
import CustomText from 'components/common/CustomText';

export interface FilterDataType {
  name: string;
  filter: 'all' | 'hot' | 'vote' | 'info';
}

const FeedFilterData: FilterDataType[] = [
  {name: '전체', filter: 'all'},
  {name: 'HOT', filter: 'hot'},
  {name: '투표', filter: 'vote'},
];

interface FeedFilterProps {
  selectedFilter: string;
  setSelectedFilter: any;
}

const FeedFilter = (props: FeedFilterProps) => {
  const {selectedFilter, setSelectedFilter} = props;

  return (
    <ScrollView
      className="py-[10]"
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}>
      {FeedFilterData.map(item => (
        <Pressable
          key={item.filter}
          onPress={() => {
            if (item.filter !== selectedFilter) {
              setSelectedFilter(item.filter);
            }
          }}
          className="h-[31] border flex-row justify-center items-center px-[10] mr-[5] rounded-[4px]"
          style={[
            {
              backgroundColor:
                item.filter === selectedFilter ? '#3a3a3a' : undefined,
              borderColor:
                item.filter === selectedFilter ? '#3a3a3a' : '#d1d5db',
            },
          ]}>
          <CustomText
            fontWeight={'500'}
            className="text-gray-800"
            style={[item.filter === selectedFilter && {color: 'white'}]}>
            {item.name}
          </CustomText>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default FeedFilter;
