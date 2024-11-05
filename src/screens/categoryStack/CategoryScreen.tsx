import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchSvg from '../../assets/images/search-sm.svg';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/common/CustomText';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IdName} from 'apis/types';
import TeamSkeleton from 'components/skeleton/TeamSkeleton';
import FastImage from 'react-native-fast-image';
import {useGetLeagues, useGetSports, useGetTeams} from 'apis/team/useTeams';
import {Sport} from 'apis/team/types';
import RightSvg from 'assets/images/chevron-right-gray.svg';

type CategoryScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'Category'
>;

const CategoryScreen = ({
  navigation,
}: {
  navigation: CategoryScreenNavigationProp;
}) => {
  const insets = useSafeAreaInsets();
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<IdName | null>(null);

  const {data: sports} = useGetSports();
  const {data: leagues} = useGetLeagues(
    selectedSport ? selectedSport.id : null,
  );
  const {data: teams} = useGetTeams(selectedLeague ? selectedLeague.id : null);

  useEffect(() => {
    if (sports?.length) {
      setSelectedSport(sports[0]);
    }
  }, [sports]);

  useEffect(() => {
    if (leagues?.length) {
      setSelectedLeague(leagues[0]);
    }
  }, [leagues]);

  return (
    <SafeAreaView className="flex-1">
      <Pressable
        className="flex-row pb-3 px-4 border-b-gray-200 border-b"
        style={{paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 12}}
        onPress={() => navigation.navigate('Search')}>
        <View className="flex-1 flex-row bg-[#f0f0f0] h-10 rounded justify-between items-center px-3">
          <CustomText fontWeight="400" className="text-base text-[#777777]">
            선수 또는 팀을 입력해주세요.
          </CustomText>
          <SearchSvg />
        </View>
      </Pressable>

      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 5}}
        className="flex-grow-0 bg-white h-[100] border-b border-gray-100"
        data={sports || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setSelectedSport(item)}
            className="items-center px-2 justify-center"
            style={{opacity: selectedSport !== item ? 0.45 : 1}}>
            <View className="w-[53] h-[53] items-center justify-center">
              {item.name === '야구' && (
                <FastImage
                  source={require('../../assets/images/baseball-bg.png')}
                  className="rounded-full w-[50] h-[50]"
                />
              )}
              {item.name === '축구' && (
                <FastImage
                  source={require('../../assets/images/soccer-bg.jpg')}
                  className="rounded-full w-[50] h-[50]"
                />
              )}
              {item.name === '농구' && (
                <FastImage
                  source={require('../../assets/images/basketball-bg.png')}
                  className="rounded-full w-[50] h-[50]"
                />
              )}
              {item.name === '배구' && (
                <FastImage
                  source={require('../../assets/images/volleyball-bg.png')}
                  className="rounded-full w-[50] h-[50]"
                />
              )}
            </View>
            <CustomText
              fontWeight="600"
              className="text-[15px] text-slate-800 mt-[6]">
              {item.name}
            </CustomText>
          </TouchableOpacity>
        )}
      />
      <View className="flex-row flex-1">
        <FlatList
          className="w-[120] bg-[#f4f4f4]"
          data={leagues || []}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Pressable
              onPress={() => setSelectedLeague(item)}
              className={`py-4 pl-3 ${selectedLeague === item && 'bg-white'}`}>
              <CustomText
                fontWeight="600"
                className={`color-[#6f6f6f] text-[15px] ${selectedLeague === item && 'text-black'}`}>
                {item.name}
              </CustomText>
            </Pressable>
          )}
        />
        <FlatList
          style={{
            width: Dimensions.get('window').width - 120,
          }}
          contentContainerStyle={{paddingBottom: 50}}
          data={teams || []}
          renderItem={({item}) => {
            if (item.koreanName === null) {
              return <View className="flex-1" />;
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  if (selectedSport && selectedLeague) {
                    navigation.navigate('PlayerList', {
                      teamId: item.id,
                      sportName: selectedSport?.name,
                      leagueName: selectedLeague?.name,
                    });
                  }
                }}
                activeOpacity={0.6}
                className="flex-row my-[2] mx-[2] items-center justify-end">
                <FastImage
                  source={{uri: item.image}}
                  resizeMode="cover"
                  style={{
                    marginRight: 40,
                    width: 85,
                    height: 50,
                    backgroundColor: 'white',
                  }}
                />
                <View className="absolute flex-row justify-between w-full px-4 items-center">
                  <CustomText
                    className="text-[16px] text-gray-800"
                    fontWeight="500">
                    {item.shortName}
                  </CustomText>
                  <Pressable>
                    <RightSvg />
                  </Pressable>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            teams ? (
              <View
                style={{
                  height: Dimensions.get('window').height * 0.3 + 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomText
                  fontWeight="600"
                  className="text-base mb-[5] text-gray-800"
                  style={{fontSize: 16, marginBottom: 5}}>
                  등록된 팀이 없어요
                </CustomText>
              </View>
            ) : (
              <></>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
