import React, {Dispatch, SetStateAction} from 'react';
import {FlatList, Pressable} from 'react-native';
import CustomText from '../../common/CustomText';
import {FilterType} from '../../../screens/communityStack/postWrite/PostWriteScreen';
import PlusSvg from 'assets/images/plus-black.svg';

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
                height: 35,
                borderWidth: 1,
                backgroundColor: '#3a3a3a',
                borderColor: '#3a3a3a',
                borderRadius: 12,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}
              onPress={() => {
                setIsTagOpen(true);
              }}>
              <CustomText
                fontWeight="500"
                style={{color: 'white', fontSize: 15}}>
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
            height: 35,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#dcdcdc',
            paddingHorizontal: 10,
            borderRadius: 12,
            marginRight: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setIsTagOpen(true);
          }}>
          {Object.values(selectedTag).every(v => v === false) ? (
            <>
              <PlusSvg width={20} height={20} />
              <CustomText
                fontWeight="500"
                style={{fontSize: 15, marginLeft: 3}}>
                태그 추가
              </CustomText>
            </>
          ) : (
            <PlusSvg width={20} height={20} />
          )}
        </Pressable>
      }
    />
  );
};

export default TagList;
