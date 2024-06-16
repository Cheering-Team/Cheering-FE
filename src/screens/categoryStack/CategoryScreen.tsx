import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import CustomText from '../../components/CustomText';
import SearchSvg from '../../../assets/images/search-sm.svg';
import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getLeagues, getSports, getTeams} from '../../apis/team';

const CategoryScreen = ({navigation}) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const {data: sports, isLoading: sportsLoading} = useQuery({
    queryKey: ['sports'],
    queryFn: getSports,
    enabled: true,
  });

  const {data: leagues} = useQuery({
    queryKey: ['leagues', selectedSport],
    queryFn: getLeagues,
    enabled: !!selectedSport,
  });

  const {data: teams} = useQuery({
    queryKey: ['teams', selectedLeague],
    queryFn: getTeams,
    enabled: !!selectedLeague,
  });

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
    <SafeAreaView style={{flex: 1}}>
      <Pressable
        style={{
          flexDirection: 'row',
          paddingVertical: 12,
          paddingHorizontal: 15,
          borderBottomColor: '#f2f2f2',
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#f0f0f0',
            height: 40,
            borderRadius: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 13,
          }}>
          <CustomText fontWeight="400" style={{fontSize: 16, color: '#777777'}}>
            선수 또는 팀을 입력해주세요.
          </CustomText>
          <SearchSvg />
        </View>
      </Pressable>
      {sportsLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={'#737373'} />
        </View>
      ) : (
        <>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{flexGrow: 0}}
            data={sports ? sports.result : []}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <Pressable
                onPress={() => setSelectedSport(item.id)}
                style={[
                  {
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingTop: 8,
                    paddingBottom: 5,
                  },
                  selectedSport === item.id && {backgroundColor: '#f4f4f4'},
                ]}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    backgroundColor: 'black',
                    borderRadius: 10,
                    marginBottom: 6,
                  }}></View>
                <CustomText>{item.name}</CustomText>
              </Pressable>
            )}
          />
          <View style={{flexDirection: 'row', flex: 1}}>
            <FlatList
              style={{width: 120}}
              data={leagues ? leagues.result : []}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => setSelectedLeague(item.id)}
                  style={[
                    {paddingVertical: 9, paddingLeft: 12},
                    selectedLeague === item.id && {backgroundColor: '#f4f4f4'},
                  ]}>
                  <CustomText
                    fontWeight={selectedLeague === item.id ? '500' : '400'}
                    style={[
                      {color: '#9b9b9b', fontSize: 15},
                      selectedLeague === item.id && {color: 'black'},
                    ]}>
                    {item.name}
                  </CustomText>
                </Pressable>
              )}
            />
            <FlatList
              numColumns={3}
              style={{
                width: Dimensions.get('window').width - 120,
                backgroundColor: '#f4f4f4',
              }}
              columnWrapperStyle={{justifyContent: 'space-around'}}
              contentContainerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 5,
              }}
              data={teams ? teams.result : []}
              renderItem={({item}) => (
                <Pressable
                  key={item.name}
                  style={{alignItems: 'center', width: 55}}
                  onPress={() => {
                    navigation.navigate('PlayerList', {
                      teamId: item.id,
                    });
                  }}>
                  <Image
                    resizeMode="center"
                    source={{uri: item.image}}
                    style={{
                      width: 55,
                      height: 55,
                      backgroundColor: 'white',
                      borderRadius: 20,
                      marginBottom: 5,
                    }}
                  />
                  <CustomText
                    style={{
                      marginBottom: 15,
                      fontSize: 13,
                      textAlign: 'center',
                    }}>
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

export default CategoryScreen;
