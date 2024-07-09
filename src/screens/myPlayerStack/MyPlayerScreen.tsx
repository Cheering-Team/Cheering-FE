import React, {useEffect} from 'react';
import {FlatList, Pressable, View} from 'react-native';
import CustomText from '../../components/CustomText';
import {useQuery} from '@tanstack/react-query';
import {getMyPlayers} from '../../apis/player';
import Avatar from '../../components/Avatar';
import {useIsFocused} from '@react-navigation/native';
import ChevronDownSvg from '../../../assets/images/chevron-down-black-thin.svg';

const MyPlayerScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['my', 'players'],
    queryFn: getMyPlayers,
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={data.result}
      renderItem={({item}) => (
        <Pressable
          style={{
            flexDirection: 'row',
            paddingHorizontal: 17,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => navigation.navigate('Community', {playerId: item.id})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar uri={item.image} size={45} />
            <CustomText style={{fontSize: 16, marginLeft: 15}}>
              {item.koreanName}
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ededed',
              paddingHorizontal: 11,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
            <Avatar uri={item.user.image} size={22} style={{marginRight: 7}} />
            <ChevronDownSvg width={13} height={13} />
          </View>
        </Pressable>
      )}
      contentContainerStyle={{paddingTop: 10}}
    />
  );
};

export default MyPlayerScreen;
