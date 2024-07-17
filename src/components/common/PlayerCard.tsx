import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import CustomText from './CustomText';

export interface Player {
  id: number;
  name: string;
  image: string;
  isJoin?: 'TRUE' | 'FALSE';
}

interface PlayerCardProps {
  player: Player;
  canAdd?: boolean;
}

const PlayerCard = (props: PlayerCardProps) => {
  const {player} = props;
  return (
    <View style={styles.Player}>
      <Image
        style={styles.PlayerImg}
        source={{uri: player.image}}
        resizeMode="cover"
      />
      <CustomText style={styles.PlayerName} fontWeight="500">
        {player.name}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  Player: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#6f6f6f',
    borderRadius: 20,
    marginVertical: 15,
    marginHorizontal: 8,
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 10,
  },
  PlayerImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 15,
  },
  PlayerName: {
    color: '#393939',
    fontSize: 16,
    fontWeight: '600',
  },
  PlayerBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 0,
    height: 0,
    borderWidth: 25,
    borderBottomColor: 'white',
    borderRightColor: 'white',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
  },
  PlayerText: {
    position: 'absolute',
    bottom: -20,
    right: -20,
  },
});

export default PlayerCard;
