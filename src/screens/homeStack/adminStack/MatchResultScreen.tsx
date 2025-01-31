import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MatchDetail} from 'apis/match/types';
import {useGetUnfinishedMatches} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import StackHeader from 'components/common/StackHeader';
import {AdminStackParamList} from 'navigations/adminStack/AdminStackNavigator';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatDate} from 'utils/format';

const MatchResultScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const {data, hasNextPage, fetchNextPage} = useGetUnfinishedMatches();

  const loadMatches = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem: ListRenderItem<MatchDetail> = ({item}) => {
    return (
      <Pressable
        className="px-3 pt-1 pb-2 mb-2 border border-gray-300 mx-2 rounded-xl"
        onPress={() => navigation.navigate('MatchEdit', {matchId: item.id})}>
        <CustomText className="text-lg mb-2" fontWeight="700">
          {formatDate(item.time)}
        </CustomText>
        <View className="flex-row items-center">
          <View className="flex-1 items-center">
            <FastImage
              source={{uri: item.homeTeam.image}}
              className="w-[50] h-[50] mb-1"
            />
            <CustomText className="text-base" fontWeight="600">
              {item.homeTeam.shortName}
            </CustomText>
          </View>
          <View className="flex-1 items-center">
            <View className="flex-row">
              <CustomText
                className="text-base"
                fontWeight="500">{`${item.homeScore || 0} : ${item.awayScore || 0}`}</CustomText>
            </View>
            <CustomText className="text-base">
              {item.status === 'not_started' && '경기전'}
            </CustomText>
            <CustomText className="text-gray-700 mt-[2]">
              {item.location}
            </CustomText>
          </View>
          <View className="flex-1 items-center">
            <FastImage
              source={{uri: item.awayTeam.image}}
              className="w-[50] h-[50] mb-1"
            />
            <CustomText className="text-base" fontWeight="600">
              {item.awayTeam.shortName}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="경기 결과 관리" />
      <FlatList
        data={data?.pages.flatMap(page => page.matches) || []}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={loadMatches}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </SafeAreaView>
  );
};

export default MatchResultScreen;
