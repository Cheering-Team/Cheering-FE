import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import SearchSvg from '../../../assets/images/search-sm.svg';
import CloseSvg from '../../../assets/images/close-black.svg';
import {useQueryClient} from '@tanstack/react-query';
import PlayerList from '../../components/common/PlayerList';
import {useGetPlayers} from 'apis/player/usePlayers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'Search'
>;

const SearchScreen = ({
  navigation,
}: {
  navigation: SearchScreenNavigationProp;
}) => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');

  const {data, isLoading, refetch} = useGetPlayers(content);

  const searchPlayer = () => {
    if (content.length > 0) {
      refetch();
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center py-3 pl-2 pr-4 border-b-[#f2f2f2] border-b">
        <Pressable
          onPress={() => {
            queryClient.removeQueries({queryKey: ['players']});
            navigation.goBack();
          }}>
          <CloseSvg width={30} height={30} />
        </Pressable>

        <View className="flex-1 flex-row bg-[#f0f0f0] h-10 rounded-[3px] justify-between items-center px-3 ml-2">
          <TextInput
            placeholder="선수 또는 팀을 입력해주세요."
            className="text-base flex-1"
            style={styles.textInputFont}
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
        <View className="mt-[50]">
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

const styles = StyleSheet.create({
  textInputFont: {
    fontFamily: 'NotoSansKR-Regular',
    paddingBottom: 1,
  },
});

export default SearchScreen;
