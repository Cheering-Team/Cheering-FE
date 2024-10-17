import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import PlayerCard, {Player} from './PlayerCard';
import {Community} from '../screens/SearchScreen';
import ChevronRight from '../assets/images/chevron-right.svg';
import CustomText from './CustomText';
import {navigate} from '../navigations/RootNavigation';

interface Team {
  id: number;
  teamName: string;
  image: string;
  category: string;
  league: string;
  playerCommunities: Player[];
}

interface TeamCardProps {
  team: Team;
  setCommunity: (commnity: Community) => void;
  handleModal: () => void;
}

const TeamCard = (props: TeamCardProps) => {
  const {team, setCommunity, handleModal} = props;

  return (
    <View style={styles.TeamContainer}>
      <View style={styles.TeamHeader}>
        <Image source={{uri: team.image}} style={styles.TeamLogo} />
        <View style={styles.TeamInfo}>
          <CustomText style={styles.TeamName} fontWeight="600">
            {team.teamName}
          </CustomText>
          <CustomText style={styles.TeamCategory} fontWeight="600">
            {team.category} / {team.league}
          </CustomText>
        </View>
      </View>
      <View style={styles.PlayerList}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={team.playerCommunities}
          style={{paddingHorizontal: 10}}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                if (item.isJoin === 'TRUE') {
                  navigate('Community', {communityId: item.id});
                } else {
                  setCommunity({id: item.id, name: item.name});
                  handleModal();
                }
              }}>
              <PlayerCard player={item} />
            </Pressable>
          )}
        />
        <View style={styles.PlayerAll}>
          <CustomText style={styles.PlayerAllText} fontWeight="600">
            선수단 전체보기
          </CustomText>
          <ChevronRight width={22} height={22} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TeamContainer: {
    flex: 0,
    borderRadius: 20,
    marginHorizontal: 22,
    marginVertical: 10,
    backgroundColor: 'white',
    shadowColor: '#6f6f6f',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,

    elevation: 10,
  },
  TeamHeader: {
    flex: 1,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 7,
    marginLeft: 7,
    borderColor: '#081d40',
  },
  TeamLogo: {
    width: 55,
    height: 55,
    marginRight: 10,
  },
  TeamName: {
    fontSize: 18,
    color: '#363636',
  },
  TeamInfo: {
    flex: 1,
  },
  TeamCategory: {
    color: 'gray',
    fontSize: 13,
  },
  PlayerList: {
    flex: 0,
  },
  PlayerAll: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebf1e9',
    padding: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  PlayerAllText: {
    color: '#58A04B',
    marginTop: 1,
  },
});

export default TeamCard;
