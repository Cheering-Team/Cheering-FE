import React from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import FastImage from 'react-native-fast-image';
import {useGetTeamsByPlayer} from 'apis/team/useTeams';

interface TeamListProps {
  playerId: number;
}

const TeamList = ({playerId}: TeamListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const {data: teams} = useGetTeamsByPlayer(playerId);

  if (!teams) {
    return null;
  }

  return (
    <View className="pr-3">
      {teams.map(team => (
        <Pressable
          key={team.id.toString()}
          onPress={() =>
            navigation.push('Community', {
              communityId: team.id,
              initialIndex: 0,
            })
          }>
          <FastImage source={{uri: team.image}} className="w-[60] h-[60]" />
        </Pressable>
      ))}
    </View>
  );
};

export default TeamList;
