import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {
  useChangeCommuniyOrder,
  useGetMyCommunities,
} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import ListSvg from 'assets/images/list-white.svg';
import LinearGradient from 'react-native-linear-gradient';

const ChangeOrderScreen = () => {
  const navigaiton =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [data, setData] = useState<Community[]>([]);

  const {data: communities} = useGetMyCommunities();
  const {mutateAsync: changeCommunityOrder, isPending} =
    useChangeCommuniyOrder();

  const handleChangeCommunityOrder = async () => {
    const communityOrder = data.map((community, index) => ({
      communityId: community.id,
      communityOrder: index + 1,
    }));

    await changeCommunityOrder(communityOrder);
  };

  useEffect(() => {
    if (communities) {
      setData(communities);
    }
  }, [communities]);

  const renderItem = ({item, drag, isActive}: RenderItemParams<Community>) => {
    return (
      <ScaleDecorator>
        <View className="flex-row items-center mx-[4] my-[2]">
          <FastImage
            source={{uri: item.backgroundImage || item.image}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 65,
              backgroundColor: 'white',
              borderRadius: 5,
            }}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.65)', 'rgba(0, 0, 0, 0.65)']}
            style={[StyleSheet.absoluteFillObject, {borderRadius: 5}]}
          />
          <View className="absolute flex-row justify-between w-full pl-4 items-center">
            <CustomText className="text-lg text-white" fontWeight="500">
              {item.koreanName}
            </CustomText>
            <Pressable onLongPress={drag} disabled={isActive} className="p-5">
              <ListSvg width={25} height={25} />
            </Pressable>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between mb-1">
        <Pressable onPress={() => navigaiton.goBack()} className="py-3 px-5">
          <CustomText className="text-gray-500 text-[17px]" fontWeight="500">
            취소
          </CustomText>
        </Pressable>
        {isPending ? (
          <ActivityIndicator color={'#84b3fe'} style={{marginRight: 24}} />
        ) : (
          <Pressable className="py-3 px-5" onPress={handleChangeCommunityOrder}>
            <CustomText className="text-sky-500 text-[17px]" fontWeight="600">
              저장
            </CustomText>
          </Pressable>
        )}
      </View>
      {communities && (
        <DraggableFlatList
          data={data}
          onDragEnd={({data: newData}) => setData(newData)}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ChangeOrderScreen;
