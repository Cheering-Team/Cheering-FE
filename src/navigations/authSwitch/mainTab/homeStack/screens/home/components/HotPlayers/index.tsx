import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetPopularPlayers} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import React from 'react';
import {FlatList, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const HotPlayers = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {data: popularPlayers} = useGetPopularPlayers();

  return (
    <View>
      <CustomText className="text-lg mt-5 mb-[10] ml-4" fontWeight="500">
        현재 인기있는 선수
      </CustomText>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={popularPlayers || []}
        contentContainerStyle={{paddingLeft: 10}}
        renderItem={({item}) => (
          <Pressable
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {communityId: item.id, initialIndex: 0},
              })
            }
            className="items-center border border-gray-200 p-2 rounded-lg shadow-sm shadow-gray-100 bg-white mx-1"
            style={{
              width: 130,
            }}>
            <FastImage
              source={{uri: item.image}}
              className="w-[80] h-[80] border border-gray-200 rounded-full"
              resizeMode="contain"
            />
            <CustomText
              fontWeight="600"
              className="mt-4 text-[14px] text-gray-900">
              {item.koreanName}
            </CustomText>
            <CustomText
              className="text-[11px] text-gray-600 mt-[3]"
              fontWeight="400">
              {item.firstTeamName}
            </CustomText>
            <View className="bg-black mt-3 rounded-lg w-[93%] items-center">
              <CustomText
                fontWeight="500"
                className="text-white py-[7] text-[13px]">
                바로가기
              </CustomText>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default HotPlayers;
