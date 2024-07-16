import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import SearchSvg from '../../../assets/images/search-sm.svg';
import CloseSvg from '../../../assets/images/close-black.svg';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getPlayers} from '../../apis/player';
import PlayerList from '../../components/PlayerList';

const SearchScreen = ({navigation}) => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['players'],
    queryFn: () => getPlayers({name: content}),
    enabled: false,
  });

  const searchPlayer = () => {
    if (content.length > 0) {
      refetch();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingLeft: 8,
          paddingRight: 15,
          borderBottomColor: '#f2f2f2',
          borderBottomWidth: 1,
        }}>
        <Pressable
          onPress={() => {
            queryClient.removeQueries({queryKey: ['players']});
            navigation.goBack();
          }}>
          <CloseSvg width={30} height={30} />
        </Pressable>

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
            marginLeft: 7,
          }}>
          <TextInput
            placeholder="선수 또는 팀을 입력해주세요."
            style={{
              fontSize: 16,
              fontFamily: 'NotoSansKR-Regular',
              includeFontPadding: false,
              flex: 1,
            }}
            placeholderTextColor={'#777777'}
            returnKeyType="search"
            value={content}
            onChangeText={setContent}
            onSubmitEditing={searchPlayer}
          />
          <Pressable onPress={searchPlayer}>
            <SearchSvg />
          </Pressable>
        </View>
      </View>
      {isLoading ? (
        <View style={{marginTop: 50}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : data ? (
        <PlayerList players={data?.result} />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
