import React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from '../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {Community} from 'apis/community/types';
import CalendarSvg from 'assets/images/calendar.svg';

interface CommunityHeaderProps {
  community: Community;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {community} = props;
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

      {community.curFan && (
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.navigate('Schedule', {community})}>
            <CalendarSvg width={23} height={23} />
          </Pressable>
          <Pressable
            className="ml-5"
            onPress={() => {
              if (community.curFan) {
                navigation.navigate('Profile', {
                  fanId: community.curFan.id,
                });
              }
            }}>
            <Avatar
              uri={community.curFan.image}
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
