import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import PlayerList from '../../components/common/PlayerList';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import ChevronRightGraySvg from '../../assets/images/chevron-right-gray.svg';
import StarOrangeSvg from '../../assets/images/star-orange.svg';
import {formatComma} from 'utils/format';
import StackHeader from 'components/common/StackHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {
  useGetCommunitiesByTeam,
  useGetCommunityById,
} from 'apis/community/useCommunities';

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
  const {teamId, sportName, leagueName} = route.params;

  const {data: team} = useGetCommunityById(teamId);
  const {data: players} = useGetCommunitiesByTeam(teamId);

  if (!team) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title={`${sportName} / ${leagueName}`} type="back" />
      <View
        className="absolute z-10 bg-white w-full h-20  px-[15] border-t border-t-[#efefef] rounded-b-2xl"
        style={{top: insets.top + 48}}>
        <View className="flex-row items-center">
          <FastImage
            source={{
              uri: team.image,
            }}
            className="h-[75] w-[75]"
          />
          <View className="flex-1 p-[10] flex-row items-center justify-between">
            <View>
              <CustomText
                fontWeight="600"
                className="text-lg pb-0 text-[#2b2b2b]">
                {team.koreanName}
              </CustomText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <StarOrangeSvg width={11} height={11} />
                <CustomText
                  fontWeight="600"
                  style={{
                    fontSize: 12,
                    color: '#F99E35',
                    marginLeft: 3,
                  }}>
                  {formatComma(team.fanCount)}
                </CustomText>
              </View>
            </View>

            <Pressable
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'Community',
                  params: {communityId: team.id, type: 'TEAM'},
                })
              }>
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 15,
                  color: '#4d4d4d',
                  marginRight: 3,
                }}>
                바로가기
              </CustomText>
              <ChevronRightGraySvg width={12} height={12} />
            </Pressable>
          </View>
        </View>
      </View>
      <PlayerList
        type="TEAM"
        teamName={team.koreanName}
        communities={players}
        paddingTop={true}
      />
    </SafeAreaView>
  );
};

export default PlayerListScreen;
