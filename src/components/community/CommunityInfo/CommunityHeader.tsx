import React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from '../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';
import DailySvg from '../../../assets/images/comment-white.svg';
import {Community} from 'apis/player/types';
import {formatBarDate} from 'utils/format';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';

interface CommunityHeaderProps {
  playerData: Community;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {playerData} = props;
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

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

      {playerData.user && (
        <View className="flex-row items-center">
          {playerData.manager && (
            <Pressable
              onPress={() =>
                navigation.navigate('Daily', {
                  playerId: playerData.id,
                  date: formatBarDate(new Date()),
                  write: false,
                })
              }>
              <DailySvg width={20} height={20} />
            </Pressable>
          )}

          <Pressable
            className="ml-5"
            onPress={() => {
              if (playerData.user) {
                navigation.navigate('Profile', {
                  playerUserId: playerData.user.id,
                });
              }
            }}>
            <Avatar
              uri={playerData.user.image}
              size={25}
              style={styles.communityUserAvatar}
            />
          </Pressable>
        </View>
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
