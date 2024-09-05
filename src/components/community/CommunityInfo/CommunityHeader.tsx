import React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from '../../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';
import HomeSvg from '../../../../assets/images/home_white.svg';

interface CommunityHeaderProps {
  playerData: any;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {playerData} = props;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  return (
    <Animated.View
      style={[
        styles.headerContainer,

        {paddingTop: insets.top, height: insets.top + 45},
      ]}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <CheveronLeft width={20} height={20} />
      </Pressable>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Pressable
          onPress={() => {
            navigation.navigate('HomeStack', {
              screen: 'Home',
              params: undefined,
            });
          }}>
          <HomeSvg />
        </Pressable>
        {playerData.result.user && (
          <Pressable
            onPress={() =>
              navigation.navigate('Profile', {
                playerUserId: playerData.result.user.id,
              })
            }
            style={{marginLeft: 20}}>
            <Avatar
              uri={playerData.result.user.image}
              size={25}
              style={styles.communityUserAvatar}
            />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  communityUserAvatar: {borderWidth: 1.5, borderColor: 'white', marginRight: 3},
});

export default CommunityHeader;
