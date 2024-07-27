import React from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from '../../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';

interface CommunityHeaderProps {
  scrollY: any;
  playerData: any;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {scrollY, playerData} = props;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, Dimensions.get('window').height / 3],
    outputRange: ['rgba(0, 0, 0, 0)', '#000000'],
    extrapolate: 'clamp',
  });

  const headerTitleColor = scrollY.interpolate({
    inputRange: [0, Dimensions.get('window').height / 3],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          backgroundColor: headerBackgroundColor,
        },
        {paddingTop: insets.top, height: insets.top + 52},
      ]}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <CheveronLeft width={25} height={25} />
      </Pressable>
      <View style={styles.rowContainer}>
        <Animated.Text style={[styles.title, {color: headerTitleColor}]}>
          {`${playerData.result.koreanName} / `}
        </Animated.Text>
        <Animated.Text style={[styles.title, {color: headerTitleColor}]}>
          {playerData.result.englishName}
        </Animated.Text>
      </View>
      {playerData.result.user && (
        <Pressable
          onPress={() =>
            navigation.navigate('Profile', {
              playerUserId: playerData.result.user.id,
            })
          }>
          <Avatar
            uri={playerData.result.user.image}
            size={30}
            style={styles.communityUserAvatar}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 52,
    width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
  },
  communityUserAvatar: {borderWidth: 1.5, borderColor: 'white', marginRight: 3},
});

export default CommunityHeader;
