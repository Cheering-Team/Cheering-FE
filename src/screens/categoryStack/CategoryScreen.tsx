import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import SearchSvg from '../../assets/images/search-sm.svg';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/common/CustomText';
import {
  useGetLeagues,
  useGetSports,
  useGetTeams,
} from 'apis/community/useCommunities';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {SvgUri} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {queryClient} from '../../../App';
import {teamKeys} from 'apis/community/queries';
import {Sport} from 'apis/community/types';
import {IdName} from 'apis/types';
import TeamSkeleton from 'components/skeleton/TeamSkeleton';

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

  useEffect(() => {
    if (teams) {
      teams.forEach(team => {
        queryClient.setQueryData(teamKeys.detail(team.id), team);
      });
    }
  });

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
        className="flex-grow-0 bg-[#f4f4f4] border-b border-b-gray-100 h-[80]"
        data={sports || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Pressable
            onPress={() => setSelectedSport(item)}
            className={`items-center px-[10] ${selectedSport === item && 'bg-white'} justify-evenly`}>
            <View className="w-[40] h-[40] items-center justify-center">
              <SvgUri
                uri={item.image}
                width={35}
                height={35}
                className="rounded-lg"
              />
            </View>
            <CustomText
              fontWeight={selectedSport === item ? '600' : '400'}
              className={`color-[#9b9b9b] text-[14px] ${selectedSport === item && 'text-black'}`}>
              {item.name}
            </CustomText>
          </Pressable>
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
              className={`py-[9] pl-3 ${selectedLeague === item && 'bg-white'}`}>
              <CustomText
                fontWeight={selectedLeague === item ? '500' : '400'}
                className={`color-[#9b9b9b] text-[15px] ${selectedLeague === item && 'text-black'}`}>
                {item.name}
              </CustomText>
            </Pressable>
          )}
        />
        <FlatList
          numColumns={3}
          style={{
            width: Dimensions.get('window').width - 120,
          }}
          columnWrapperStyle={styles.justifyaround}
          contentContainerStyle={styles.padding}
          data={
            teams && teams.length !== 0
              ? [
                  ...teams,
                  ...new Array(3 - (teams.length % 3)).fill({
                    name: null,
                  }),
                ]
              : []
          }
          renderItem={({item}) => {
            if (item.name === null) {
              return <View className="flex-1" />;
            }
            return (
              <Pressable
                key={item.name}
                className="items-center flex-1"
                onPress={() => {
                  if (selectedSport && selectedLeague) {
                    navigation.navigate('PlayerList', {
                      teamId: item.id,
                      sportName: selectedSport?.name,
                      leagueName: selectedLeague?.name,
                    });
                  }
                }}>
                <Image
                  resizeMode="center"
                  source={{uri: item.image}}
                  className="w-[55] h-[55] bg-white rounded-[13px] mb-[5]"
                />
                <CustomText
                  fontWeight="500"
                  className="pb-0 text-[12px] text-center">
                  {item.firstName}
                </CustomText>
                <CustomText
                  fontWeight="500"
                  className="pb-0 text-[12px] text-center">
                  {item.secondName}
                </CustomText>
              </Pressable>
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
              <TeamSkeleton />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  justifyaround: {marginBottom: 25},
  padding: {paddingVertical: 20, paddingHorizontal: 5, paddingBottom: 40},
});

export default CategoryScreen;
