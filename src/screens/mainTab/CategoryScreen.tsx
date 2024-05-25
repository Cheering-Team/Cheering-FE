import {FlatList, Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/CustomText';
import SearchSvg from '../../../assets/images/search-sm.svg';
import React, {useState} from 'react';

const CategoryScreen = () => {
  const [selectedLeague, setSelectedLeague] = useState(0);
  const [selectedSport, setSelectedSport] = useState(0);

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
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0}}
        data={[
          {name: '야구'},
          {name: '축구'},
          {name: '농구'},
          {name: '탁구'},
          {name: '양궁'},
          {name: 'LOL'},
          {name: 'PUBG'},
        ]}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => setSelectedSport(index)}
            style={[
              {
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingTop: 8,
                paddingBottom: 5,
              },
              selectedSport === index && {backgroundColor: '#ededed'},
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
          style={{flexGrow: 3}}
          data={[{name: 'KBO'}, {name: 'K리그2'}, {name: 'K리그3'}]}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => setSelectedLeague(index)}
              style={[
                {paddingVertical: 9, paddingLeft: 12},
                selectedLeague === index && {backgroundColor: '#ededed'},
              ]}>
              <CustomText
                fontWeight={selectedLeague === index ? '500' : '400'}
                style={[
                  {color: '#9b9b9b', fontSize: 15},
                  selectedLeague === index && {color: 'black'},
                ]}>
                {item.name}
              </CustomText>
            </Pressable>
          )}
        />
        <FlatList
          numColumns={3}
          style={{flexGrow: 5, backgroundColor: '#ededed'}}
          columnWrapperStyle={{justifyContent: 'space-around'}}
          contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 5}}
          data={[
            {name: '롯데 자이언츠'},
            {name: '한화 이글스'},
            {name: '두산 베어스'},
            {name: 'KT 위즈'},
            {name: '기타 타이거즈'},
            {name: '엘지 트윈스'},
          ]}
          renderItem={({item}) => (
            <Pressable
              key={item.name}
              style={{alignItems: 'center', width: 55}}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  backgroundColor: 'black',
                  borderRadius: 20,
                  marginBottom: 5,
                }}></View>
              <CustomText
                style={{marginBottom: 15, fontSize: 13, textAlign: 'center'}}>
                {item.name}
              </CustomText>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
