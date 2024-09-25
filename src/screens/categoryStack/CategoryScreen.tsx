import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import SearchSvg from '../../../assets/images/search-sm.svg';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/common/CustomText';
import {useGetLeagues, useGetSports, useGetTeams} from 'apis/player/usePlayers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import FastImage from 'react-native-fast-image';

type CategoryScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'Category'
>;

const CategoryScreen = ({
  navigation,
}: {
  navigation: CategoryScreenNavigationProp;
}) => {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);

  const {data: sports, isLoading: sportsLoading} = useGetSports();
  const {data: leagues} = useGetLeagues(selectedSport);
  const {data: teams} = useGetTeams(selectedLeague);

  useEffect(() => {
    if (sports && sports.result.length) {
      setSelectedSport(sports.result[0].id);
    }
  }, [sports]);

  useEffect(() => {
    if (leagues && leagues.result.length) {
      setSelectedLeague(leagues.result[0].id);
    }
  }, [leagues]);

  return (
    <SafeAreaView className="flex-1">
      <Pressable
        className="flex-row py-3 px-4 border-b-gray-200 border-b"
        onPress={() => navigation.navigate('Search')}>
        <View className="flex-1 flex-row bg-[#f0f0f0] h-10 rounded justify-between items-center px-3">
          <CustomText fontWeight="400" className="text-base text-[#777777]">
            선수 또는 팀을 입력해주세요.
          </CustomText>
          <SearchSvg />
        </View>
      </Pressable>
      {sportsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={'#737373'} />
        </View>
      ) : (
        <>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex-grow-0"
            data={sports ? sports.result : []}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <Pressable
                onPress={() => setSelectedSport(item.id)}
                className={`items-center px-[10] pt-2 pb-[5] ${selectedSport === item.id && 'bg-[#f4f4f4]'}`}>
                <FastImage
                  source={{uri: item.image}}
                  className="w-[55] h-[55] bg-slate-50 rounded-lg border border-slate-100 mb-1"
                />
                <CustomText>{item.name}</CustomText>
              </Pressable>
            )}
          />
          <View className="flex-row flex-1">
            <FlatList
              className="w-[120]"
              data={leagues ? leagues.result : []}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => setSelectedLeague(item.id)}
                  className={`py-[9] pl-3 ${selectedLeague === item.id && 'bg-[#f4f4f4]'}`}>
                  <CustomText
                    fontWeight={selectedLeague === item.id ? '500' : '400'}
                    className={`color-[#9b9b9b] text-[15px] ${selectedLeague === item.id && 'text-black'}`}>
                    {item.name}
                  </CustomText>
                </Pressable>
              )}
            />
            <FlatList
              numColumns={3}
              className="bg-[#f4f4f4]"
              style={{
                width: Dimensions.get('window').width - 120,
              }}
              columnWrapperStyle={styles.justifyaround}
              contentContainerStyle={styles.padding}
              data={teams ? teams.result : []}
              renderItem={({item}) => (
                <Pressable
                  key={item.name}
                  className="items-center w-[55]"
                  onPress={() => {
                    navigation.navigate('PlayerList', {
                      teamId: item.id,
                    });
                  }}>
                  <Image
                    resizeMode="center"
                    source={{uri: item.image}}
                    className="w-[55] h-[55] bg-white rounded-[20px] mb-[5]"
                  />
                  <CustomText className="mb-[15] text-[13px] text-center">
                    {item.name}
                  </CustomText>
                </Pressable>
              )}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  justifyaround: {justifyContent: 'space-around'},
  padding: {paddingVertical: 20, paddingHorizontal: 5},
});

export default CategoryScreen;
