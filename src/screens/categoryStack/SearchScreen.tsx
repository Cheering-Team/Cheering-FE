import React, {useEffect, useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import SearchSvg from '../../assets/images/search-sm.svg';
import CloseSvg from '../../assets/images/close-black.svg';
import {useQueryClient} from '@tanstack/react-query';
import PlayerList from '../../components/common/PlayerList';
import {useGetPlayers} from 'apis/player/usePlayers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  const [content, setContent] = useState('');

  const {data} = useGetPlayers(content, content.length !== 0);

  return (
    <SafeAreaView className="flex-1">
      <View
        className="flex-row items-center pb-3 pl-2 pr-4 border-b-[#f2f2f2] border-b"
        style={{paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 12}}>
        <Pressable
          onPress={() => {
            queryClient.removeQueries({queryKey: ['players']});
            navigation.goBack();
          }}>
          <CloseSvg width={30} height={30} />
        </Pressable>

        <View className="flex-1 flex-row bg-[#f0f0f0] rounded-[3px] justify-between items-center px-3 ml-2 pt-[7] pb-[8]">
          <TextInput
            placeholder="선수 또는 팀을 입력해주세요."
            className="text-base flex-1 p-0 m-0"
            style={styles.textInputFont}
            placeholderTextColor={'#777777'}
            returnKeyType="search"
            value={content}
            onChangeText={setContent}
          />
        </View>
      </View>
      {data ? <PlayerList type="Search" communityData={data} /> : <></>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInputFont: {
    fontFamily: 'NotoSansKR-Regular',
    paddingBottom: 1,
    includeFontPadding: false,
  },
});

export default SearchScreen;
