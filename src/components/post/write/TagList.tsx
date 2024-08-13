import React, {Dispatch, SetStateAction} from 'react';
import {FlatList, Pressable} from 'react-native';
import CustomText from '../../common/CustomText';
import {FilterType} from '../../../screens/communityStack/PostWriteScreen';

interface FilterDataType {
  name: string;
  filter: 'photo' | 'viewing' | 'information';
}

export const TagData: FilterDataType[] = [
  {name: '📸 직찍사', filter: 'photo'},
  {name: '👀 직관인증', filter: 'viewing'},
  {name: '🔎 정보', filter: 'information'},
];

interface TagListProps {
  selectedTag: FilterType;
  setIsTagOpen: Dispatch<SetStateAction<boolean>>;
}

const TagList = (props: TagListProps) => {
  const {selectedTag, setIsTagOpen} = props;

  return (
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      data={TagData}
      style={{padding: 12, flexGrow: 0}}
      renderItem={({item}) => {
        if (selectedTag[item.filter] === true) {
          return (
            <Pressable
              key={item.filter}
              style={{
                borderWidth: 1,
                backgroundColor: '#3a3a3a',
                borderColor: '#3a3a3a',
                paddingVertical: 6,
                paddingHorizontal: 15,
                borderRadius: 20,
                marginRight: 6,
              }}
              onPress={() => {
                setIsTagOpen(true);
              }}>
              <CustomText fontWeight="500" style={{color: 'white'}}>
                {item.name}
              </CustomText>
            </Pressable>
          );
        }
        return null;
      }}
      ListHeaderComponent={
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: '#dcdcdc',
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 20,
            marginRight: 6,
          }}
          onPress={() => {
            setIsTagOpen(true);
          }}>
          {Object.values(selectedTag).every(v => v === false) ? (
            <CustomText>➕ 태그 추가</CustomText>
          ) : (
            <CustomText>➕</CustomText>
          )}
        </Pressable>
      }
    />
  );
};

export default TagList;
