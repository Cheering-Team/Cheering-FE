import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../CustomText';

interface TeamListProps {
  playerData: any;
}

const TeamList = (props: TeamListProps) => {
  const {playerData} = props;

  return (
    <View style={styles.container}>
      <CustomText fontWeight="500" style={styles.title}>
        소속팀
      </CustomText>

      <FlatList
        horizontal={true}
        data={playerData.result.teams}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable style={styles.teamContainer}>
            <Image
              source={{
                uri: item.image,
              }}
              width={20}
              height={20}
            />
            <CustomText fontWeight="500" style={styles.teamName}>
              {item.name}
            </CustomText>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  title: {color: '#d2d2d2', fontSize: 16, paddingBottom: 4},
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#373737',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 2,
    marginLeft: 15,
  },
  teamName: {color: 'white', paddingBottom: 1, marginLeft: 4, fontSize: 14},
});

export default TeamList;
