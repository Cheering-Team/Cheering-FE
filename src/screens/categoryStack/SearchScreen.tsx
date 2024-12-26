import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CloseSvg from '../../assets/images/close-black.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from 'components/common/CustomText';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Community} from 'apis/community/types';
import StarSvg from 'assets/images/star-white.svg';
import {debounce} from 'lodash';
import RightSvg from 'assets/images/chevron-right-white.svg';
import {queryClient} from '../../../App';
import {communityKeys} from 'apis/community/queries';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {useSearchPlayers} from 'apis/community/useCommunities';
import {useSearchTeams} from 'apis/team/useTeams';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'Search'
>;

const SearchScreen = ({
  navigation,
}: {
  navigation: SearchScreenNavigationProp;
}) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const debouncedSetName = debounce(setName, 300);

  const {data: teams} = useSearchTeams(name, name.length !== 0);
  const {
    data: communities,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useSearchPlayers(null, name, true);

  useEffect(() => {
    if (communities) {
      communities.pages
        .flatMap(page => page.players)
        .forEach(community => {
          queryClient.setQueryData(
            communityKeys.detail(community.id),
            community,
          );
        });
    }
  });

  const loadCommunities = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem: ListRenderItem<Community> = ({item}) => {
    if (item.id === null) {
      return <View className="flex-1 m-[2] mb-1" />;
    }
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: item.id},
          })
        }
        className="flex-1 m-[2] mb-1 rounded-[5px] overflow-hidden">
        <FastImage source={{uri: item.image}} className="w-full h-[160]" />

        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.1)',
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.8)',
          ]}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />

        <View className="absolute bottom-[5] left-[5]">
          <View className="flex-row items-center ml-[1]">
            <StarSvg width={11} height={11} className="mb-[1]" />
            <CustomText
              className="text-white ml-1 text-[13px]"
              fontWeight="500">
              {item.fanCount}
            </CustomText>
          </View>
          <CustomText className="text-white text-[20px]" fontWeight="700">
            {item.koreanName}
          </CustomText>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle={'dark-content'} />
      <View
        className="flex-row items-center pb-3 pl-2 pr-4"
        style={{paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 12}}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <CloseSvg width={30} height={30} />
        </Pressable>

        <View className="flex-1 flex-row bg-[#f0f0f0] rounded-[3px] justify-between items-center px-3 ml-2 pt-[7] pb-[8]">
          <TextInput
            placeholder="선수 또는 팀을 입력해주세요"
            className="text-base flex-1 p-0 m-0"
            style={styles.textInputFont}
            placeholderTextColor={'#777777'}
            returnKeyType="search"
            onChangeText={debouncedSetName}
          />
        </View>
      </View>
      <FlatList
        numColumns={3}
        data={
          (communities && [
            ...communities.pages.flatMap(page => page.players),
            ...new Array(
              3 - (communities.pages.flatMap(page => page.players).length % 3),
            ).fill({
              id: null,
            }),
          ]) ||
          []
        }
        ListHeaderComponent={
          <>
            {teams && teams.length > 0 ? (
              <View className="mb-2">
                {teams.map(community => (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('PlayerList', {
                        teamId: community.id,
                      });
                    }}
                    key={community.id.toString()}
                    className="flex-row my-[2] mx-[2] items-center justify-end rounded-md"
                    style={{backgroundColor: community.color}}>
                    <FastImage
                      source={{uri: community.image}}
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
                        fontWeight="600">
                        {community.koreanName}
                      </CustomText>
                      <Pressable>
                        <RightSvg width={15} height={15} />
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {teams && (
              <CustomText className="text-2xl mx-1 mb-[2]" type="titleCenter">
                PLAYER
              </CustomText>
            )}
          </>
        }
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 2,
          paddingBottom: insets.bottom + 50,
        }}
        onEndReached={loadCommunities}
        onEndReachedThreshold={1}
        ListFooterComponent={
          isLoading ? (
            <View className="mt-[100]">
              <ActivityIndicator size={'small'} color={'#1e1e1e'} />
            </View>
          ) : communities &&
            communities.pages.flatMap(page => page.players).length > 0 ? (
            <></>
          ) : name.length === 0 ? (
            <></>
          ) : (
            <ListEmpty type="player" />
          )
        }
      />
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
