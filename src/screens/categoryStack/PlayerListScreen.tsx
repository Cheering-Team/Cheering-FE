import React, {useLayoutEffect} from 'react';
import PlayerList from '../../components/PlayerList';
import {Image, SafeAreaView, View} from 'react-native';
import Back from '../../hooks/Back';
import CustomText from '../../components/CustomText';
import {useQuery} from '@tanstack/react-query';
import {getPlayersByTeam} from '../../apis/player';
import {formatComma} from '../../utils/format';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import ChevronRightGraySvg from '../../../assets/images/chevron-right-gray.svg';

const PlayerListScreen = ({navigation, route}) => {
  Back(navigation);

  const teamId = route.params.teamId;

  const {data, isLoading} = useQuery({
    queryKey: ['players', teamId],
    queryFn: getPlayersByTeam,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data
        ? `${data?.result.sportName} / ${data?.result.leagueName}`
        : '',
    });
  }, [navigation, data]);

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          backgroundColor: 'white',
          width: '100%',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          borderTopWidth: 1,
          borderTopColor: '#efefef',
        }}>
        <Image
          source={{
            uri: data.result.team.image,
          }}
          style={{height: 75, width: 75}}
        />
        <View
          style={{
            flex: 1,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <CustomText
              fontWeight="600"
              style={{fontSize: 20, paddingBottom: 0, color: '#2b2b2b'}}>
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

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          </View>
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
