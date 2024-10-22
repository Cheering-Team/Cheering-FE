import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';

interface TeamListProps {
  playerData: any;
}

const TeamList = (props: TeamListProps) => {
  const {playerData} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={playerData.result.teams}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Pressable
            style={styles.teamContainer}
            key={item.teamName}
            onPress={() =>
              navigation.push('Community', {communityId: item.communityId})
            }>
            <Image
              source={{
                uri: item.image,
              }}
              width={18}
              height={18}
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
  },
  title: {color: '#d2d2d2', fontSize: 16, paddingBottom: 4},
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#373737',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 2,
    marginLeft: 5,
  },
  teamName: {color: 'white', paddingBottom: 1, marginLeft: 4, fontSize: 12},
});

export default TeamList;
