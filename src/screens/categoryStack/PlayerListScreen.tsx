import React, {useLayoutEffect} from 'react';
import {Image, Platform, Pressable, SafeAreaView, View} from 'react-native';
import Back from '../../hooks/Back';
import CustomText from '../../components/common/CustomText';
import PlayerList from '../../components/common/PlayerList';
import {useGetPlayersByTeam} from 'apis/player/usePlayers';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import ChevronRightGraySvg from '../../../assets/images/chevron-right-gray.svg';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import {formatComma} from 'utils/format';
import StackHeader from 'components/common/StackHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type PlayerListScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'PlayerList'
>;

type PlayerListScreenRouteProp = RouteProp<
  CategoryStackParamList,
  'PlayerList'
>;

const PlayerListScreen = ({
  navigation,
  route,
}: {
  navigation: PlayerListScreenNavigationProp;
  route: PlayerListScreenRouteProp;
}) => {
  const insets = useSafeAreaInsets();
  const teamId = route.params.teamId;

  const {data, isLoading} = useGetPlayersByTeam(teamId);

  if (isLoading || !data) {
    return <></>;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader
        title={`${data.result.sportName}/${data.result.leagueName}`}
        type="back"
      />
      <View
        className="absolute z-10 bg-white w-full h-20 flex-row items-center px-[15] border-t border-t-[#efefef] rounded-b-2xl"
        style={{top: insets.top + 48}}>
        <Image
          source={{
            uri: data.result.team.image,
          }}
          className="h-[75] w-[75]"
        />
        <View className="flex-1 p-[10] flex-row items-center justify-between">
          <View>
            <CustomText
              fontWeight="600"
              className="text-lg pb-0 text-[#2b2b2b]">
              {data.result.team.name}
            </CustomText>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <StarOrangeSvg width={11} height={11} />
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 12,
                  color: '#F99E35',
                  marginLeft: 3,
                  paddingBottom: 2,
                }}>
                {formatComma(data.result.team.fanCount)}
              </CustomText>
            </View>
          </View>

          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {playerId: data.result.team.communityId},
              })
            }>
            <CustomText
              fontWeight="600"
              style={{
                fontSize: 15,
                color: '#4d4d4d',
                marginRight: 3,
              }}>
              이동하기
            </CustomText>
            <ChevronRightGraySvg width={12} height={12} />
          </Pressable>
        </View>
      </View>
      <PlayerList
        teamName={data.result.team.name}
        players={data.result.players}
        paddingTop={true}
      />
    </SafeAreaView>
  );
};

export default PlayerListScreen;
