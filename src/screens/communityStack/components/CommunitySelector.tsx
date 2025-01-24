import {Community} from 'apis/community/types';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {FlatList, ListRenderItem, Modal, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SelectorItem from './SelectorItem';

interface CommunitySelectorProps {
  community: Community;
}

const CommunitySelector = ({community}: CommunitySelectorProps) => {
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  const {data: communities = []} = useGetMyCommunities(true);

  const renderItem: ListRenderItem<Community> = ({item}) => {
    return <SelectorItem community={item} setIsOpen={setIsOpen} />;
  };

  return (
    <>
      <Pressable
        onPress={() => {
          setIsOpen(true);
        }}
        className="absolute shadow-md shadow-gray-300 bg-white rounded-full"
        style={{bottom: insets.bottom + 60, right: 12}}>
        <FastImage
          source={{uri: community.image}}
          className="bg-white w-[45] h-[45] rounded-full border border-gray-200"
        />
      </Pressable>

      {isOpen && (
        <Modal transparent animationType="none">
          <Pressable
            className="w-full h-full"
            style={{backgroundColor: 'rgba(0,0,0,0.75)'}}
            onPress={() => {
              setIsOpen(false);
            }}>
            <FlatList
              inverted
              data={communities?.filter(value => value.id !== community.id)}
              contentContainerStyle={{
                paddingTop: insets.bottom + 114,
              }}
              renderItem={renderItem}
            />
            <View
              className="flex-row items-center absolute"
              style={{bottom: insets.bottom + 61, right: 13}}>
              <CustomText
                className="text-white text-[15.5px] mr-3"
                fontWeight="600">
                {community.koreanName}
              </CustomText>
              <View className="bg-white rounded-full">
                <FastImage
                  source={{uri: community.image}}
                  className="bg-white w-[43] h-[43] rounded-full"
                />
              </View>
            </View>

            <Pressable
              onPress={() => {
                setIsOpen(prev => !prev);
              }}
              className="w-[51] h-[51] border-[2.5px] absolute rounded-full"
              style={{
                bottom: insets.bottom + 57,
                right: 9,
                borderColor: 'white',
              }}
            />
          </Pressable>
        </Modal>
      )}
    </>
  );
};

export default CommunitySelector;
