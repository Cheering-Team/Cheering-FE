import React, {Dispatch, SetStateAction} from 'react';
import {Platform, Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {TagData} from './TagList';
import {FilterType} from '../../../screens/communityStack/postWrite/PostWriteScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface TagModalProps {
  selectedTag: FilterType;
  setSelectedTag: Dispatch<SetStateAction<FilterType>>;
}

const TagModal = (props: TagModalProps) => {
  const {selectedTag, setSelectedTag} = props;
  const insets = useSafeAreaInsets();

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
        top: Platform.OS === 'android' ? insets.top + 45 : 45,
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
              height: 35,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#dcdcdc',
              paddingHorizontal: 12,
              borderRadius: 12,
              marginRight: 6,
              marginBottom: 10,
              marginTop: 5,
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
            style={[
              {fontSize: 15},
              selectedTag[tag.filter] && {color: 'white'},
            ]}>
            {tag.name}
          </CustomText>
        </Pressable>
      ))}
    </View>
  );
};

export default TagModal;
