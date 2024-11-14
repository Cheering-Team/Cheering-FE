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
import FastImage from 'react-native-fast-image';
import {useGetLeagues, useGetSports, useGetTeams} from 'apis/team/useTeams';
import {Sport} from 'apis/team/types';
import RightSvg from 'assets/images/chevron-right-white.svg';
import RegisterModal from 'components/common/RegisterModal';
import PlusSvg from 'assets/images/plus-black.svg';

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
  const [isRegisiterOpen, setIsRegisterOpen] = useState(false);
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
        className="flex-row pb-3 px-4"
        style={{paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 12}}
        onPress={() => navigation.navigate('Search')}>
        <View className="flex-1 flex-row bg-[#f0f0f0] h-10 rounded justify-between items-center px-3">
          <CustomText fontWeight="400" className="text-base text-[#777777]">
            선수 또는 팀을 입력해주세요
          </CustomText>
          <SearchSvg />
        </View>
      </Pressable>
      <View className="flex-row items-center justify-between">
        <FlatList
          horizontal={true}
          className="flex-grow-0 bg-white border-b-gray-50 border-b"
          contentContainerStyle={{paddingHorizontal: 5}}
          data={sports || []}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Pressable
              onPress={() => setSelectedSport(item)}
              className="items-center px-[14] py-[10] justify-center"
              style={{
                borderBottomWidth: 3,
                borderBlockColor: selectedSport === item ? 'black' : 'white',
              }}>
              <CustomText
                fontWeight="600"
                className="text-[18px]"
                style={{color: selectedSport === item ? 'black' : 'gray'}}>
                {item.name}
              </CustomText>
            </Pressable>
          )}
        />
        <Pressable
          className="px-3 pb-1"
          onPress={() => setIsRegisterOpen(true)}>
          <PlusSvg width={27} height={27} />
        </Pressable>
      </View>
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
                  navigation.navigate('PlayerList', {
                    teamId: item.id,
                  });
                }}
                activeOpacity={0.6}
                className="flex-row my-[1] mx-[2] items-center justify-end rounded-md"
                style={{backgroundColor: item.color}}>
                <FastImage
                  source={{uri: item.image}}
                  resizeMode="cover"
                  style={{
                    marginRight: 40,
                    width: 85,
                    height: 50,
                    shadowColor: '#000',
                    shadowOffset: {width: 1, height: 1},
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                  }}
                />
                <View className="absolute flex-row justify-between w-full pl-4 pr-3 items-center">
                  <CustomText
                    className="text-[16px] text-white"
                    type="titleCenter">
                    {item.shortName}
                  </CustomText>
                  <Pressable>
                    <RightSvg width={15} height={15} />
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
      {isRegisiterOpen && (
        <RegisterModal setIsRegisterOpen={setIsRegisterOpen} />
      )}
    </SafeAreaView>
  );
};

export default CategoryScreen;
