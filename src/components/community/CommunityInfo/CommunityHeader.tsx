import React from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import CheveronLeft from '../../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';

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

      {playerData.result.user && (
        <Pressable
          onPress={() =>
            navigation.navigate('Profile', {
              playerUserId: playerData.result.user.id,
            })
          }>
          <Avatar
            uri={playerData.result.user.image}
            size={25}
            style={styles.communityUserAvatar}
          />
        </Pressable>
      )}
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
