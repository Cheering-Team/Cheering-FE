import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../components/common/CustomText';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import ChevronRightWhiteSvg from '../../assets/images/chevron-left-white.svg';
import StarSvg from 'assets/images/star-white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {
  useGetCommunities,
  useGetCommunityById,
} from 'apis/community/useCommunities';
import ChevronRight from 'assets/images/chevron-right-white.svg';
import SearchSvg from 'assets/images/search-sm.svg';
import {Community} from 'apis/community/types';
import {debounce} from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import {queryClient} from '../../../App';
import {communityKeys} from 'apis/community/queries';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

type PlayerListScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'PlayerList'
>;

type PlayerListScreenRouteProp = RouteProp<
  CategoryStackParamList,
  'PlayerList'
>;

const PlayerListScreen = ({
  navigation,
  route,
}: {
  navigation: PlayerListScreenNavigationProp;
  route: PlayerListScreenRouteProp;
}) => {
  const insets = useSafeAreaInsets();
  const {teamId} = route.params;

  const [name, setName] = useState('');
  const debouncedSetName = debounce(setName, 300);

  const {data: team} = useGetCommunityById(teamId);
  const {data: communities} = useGetCommunities(teamId, name);

  useEffect(() => {
    if (communities) {
      communities[1].data.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id), community);
      });
    }
  });

  const renderItem: ListRenderItem<Community> = ({item}) => {
    if (item.id === null) {
      return <View className="flex-1 mx-[2]" />;
    }
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: item.id},
          })
        }
        className="flex-1 m-[2] mb-1 rounded-[5px] overflow-hidden">
        <FastImage source={{uri: item.image}} className="w-full h-[160]" />
        {team && (
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.05)',
              'rgba(0, 0, 0, 0.1)',
              'rgba(0,0,0,0.3)',
              'rgba(0,0,0,0.8)',
            ]}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />
        )}

        <View className="absolute bottom-[5] left-[5]">
          <View className="flex-row items-center ml-[1] top-[2]">
            <StarSvg width={11} height={11} className="mb-[1]" />
            <CustomText
              className="text-white ml-1 text-[13px]"
              fontWeight="500">
              {item.fanCount}
            </CustomText>
          </View>
          <CustomText className="text-white text-[20px]" type="titleCenter">
            {item.koreanName}
          </CustomText>
        </View>
      </Pressable>
    );
  };

  if (!team) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: team.color}}>
      <View
        style={{
          paddingTop: insets.top,
          height: insets.top + 45,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          justifyContent: 'space-between',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronRightWhiteSvg width={18} height={18} />
        </Pressable>
        <CustomText className="text-white text-xl" type="titleCenter">
          {team.koreanName}
        </CustomText>
        <View className="w-[18] h-[18]" />
      </View>

      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          top: insets.top + 20,
          left: 15,
        }}
        pointerEvents="none">
        <FastImage
          source={{uri: team.image}}
          className="w-[140] h-[140] absolute z-10"
          style={{
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
        />
      </View>

      <View
        className="absolute z-10"
        style={{top: insets.top + 64, right: 30, height: 70}}>
        <View className="mb-[10] px-1 flex-row items-center justify-between h-4">
          <CustomText
            className="text-white ml-1"
            fontWeight="600">{`${team.sportName} / ${team.leagueName}`}</CustomText>
          <View className="flex-row  items-center">
            <StarSvg width={13} height={13} className="mb-[1]" />
            <CustomText className="text-white ml-1" fontWeight="500">
              {team.fanCount}
            </CustomText>
          </View>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {communityId: team.id},
            })
          }
          className="pl-7 pr-4 py-[7] rounded-xl flex-row items-center"
          style={{
            backgroundColor: team.color,
          }}>
          <CustomText
            className="text-[18px] mr-[6] text-white"
            fontWeight="600">
            커뮤니티 바로가기
          </CustomText>
          <ChevronRight width={13} height={13} />
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          top: 40,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 20,
        }}>
        <FlatList
          style={{
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: 'white',
          }}
          data={
            (communities && [
              ...communities[1].data,
              ...new Array(3 - (communities[1].data.length % 3)).fill({
                id: null,
              }),
            ]) ||
            []
          }
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View
              className="bg-gray-100 flex-row px-3 rounded-2xl mx-1 items-center mb-3"
              style={{paddingVertical: Platform.OS === 'ios' ? 9 : 5}}>
              <SearchSvg width={20} height={20} />
              <TextInput
                className="flex-1 p-0 m-0 ml-[6]"
                placeholder="선수 검색"
                onChangeText={debouncedSetName}
                style={{
                  fontFamily: 'Pretendard-Regular',
                  paddingBottom: 1,
                  fontSize: 16,
                  includeFontPadding: false,
                }}
              />
            </View>
          }
          contentContainerStyle={{
            backgroundColor: 'white',
            paddingTop: 75,
            paddingHorizontal: 2,
            paddingBottom: insets.bottom + 120,
          }}
          renderItem={renderItem}
          ListFooterComponent={
            communities && communities[1].data.length > 0 ? (
              <></>
            ) : (
              <ListEmpty type="player" />
            )
          }
        />
      </View>
    </View>
  );
};

export default PlayerListScreen;
