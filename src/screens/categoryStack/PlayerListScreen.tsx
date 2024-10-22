import React, {useEffect} from 'react';
import {Image, Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import PlayerList from '../../components/common/PlayerList';
import {useGetPlayersByTeam, useGetTeamById} from 'apis/player/usePlayers';
import {CategoryStackParamList} from 'navigations/CategoryStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import ChevronRightGraySvg from '../../assets/images/chevron-right-gray.svg';
import StarOrangeSvg from '../../assets/images/star-orange.svg';
import {formatComma} from 'utils/format';
import StackHeader from 'components/common/StackHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {queryClient} from '../../../App';
import {communityKeys} from 'apis/player/queries';

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

  const {data: teamData} = useGetTeamById(teamId);
  const {data: communityData} = useGetPlayersByTeam(teamId);

  useEffect(() => {
    if (communityData) {
      communityData.result.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id, 0), {
          status: 200,
          message: '커뮤니티 정보 조회 완료',
          result: community,
        });
      });
    }
  }, [communityData]);

  if (!teamData) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title={`${sportName}/${leagueName}`} type="back" />
      <View
        className="absolute z-10 bg-white w-full h-20 flex-row items-center px-[15] border-t border-t-[#efefef] rounded-b-2xl"
        style={{top: insets.top + 48}}>
        <Image
          source={{
            uri: teamData.result.image,
          }}
          className="h-[75] w-[75]"
        />
        <View className="flex-1 p-[10] flex-row items-center justify-between">
          <View>
            <CustomText
              fontWeight="600"
              className="text-lg pb-0 text-[#2b2b2b]">
              {`${teamData.result.firstName} ${teamData.result.secondName}`}
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
                {formatComma(teamData.result.fanCount)}
              </CustomText>
            </View>
          </View>

          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {communityId: teamData.result.communityId},
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
        type="Team"
        teamName={`${teamData.result.firstName} ${teamData.result.secondName}`}
        communityData={communityData}
        paddingTop={true}
      />
    </SafeAreaView>
  );
};

export default PlayerListScreen;
