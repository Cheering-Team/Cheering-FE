import React, {Dispatch, SetStateAction} from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {TagData} from './TagList';
import {FilterType} from '../../../screens/communityStack/PostWriteScreen';

interface TagModalProps {
  selectedTag: FilterType;
  setSelectedTag: Dispatch<SetStateAction<FilterType>>;
}

const TagModal = (props: TagModalProps) => {
  const {selectedTag, setSelectedTag} = props;

  const selectTag = (tag: 'photo' | 'viewing' | 'information') => {
    setSelectedTag(prev => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'absolute',
        top: 45,
        zIndex: 2,
        paddingTop: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#e1e1e1',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}>
      {TagData.map(tag => (
        <Pressable
          key={tag.filter}
          style={[
            {
              borderWidth: 1,
              borderColor: '#dcdcdc',
              paddingVertical: 6,
              paddingHorizontal: 15,
              borderRadius: 20,
              marginRight: 6,
              marginBottom: 10,
            },
            selectedTag[tag.filter] && {
              backgroundColor: '#3a3a3a',
              borderColor: '#3a3a3a',
            },
          ]}
          onPress={() => {
            selectTag(tag.filter);
          }}>
          <CustomText
            fontWeight="500"
            style={[selectedTag[tag.filter] && {color: 'white'}]}>
            {tag.name}
          </CustomText>
        </Pressable>
      ))}
    </View>
  );
};

export default TagModal;
