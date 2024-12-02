import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from '../../../assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {Community} from 'apis/community/types';
import CalendarSvg from 'assets/images/calendar.svg';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

interface CommunityHeaderProps {
  community: Community;
  scrollY: SharedValue<number>;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {community, scrollY} = props;
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const animatedBGStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [HEADER_HEIGHT - insets.top - 110, HEADER_HEIGHT - insets.top - 45],
        ['transparent', community.color],
      ),
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HEADER_HEIGHT - insets.top - 110, HEADER_HEIGHT - insets.top - 45],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top,
          height: insets.top + 45,
        },
        animatedBGStyle,
      ]}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <CheveronLeft width={18} height={18} />
      </Pressable>
      <CustomText
        className="text-white text-xl ml-3 flex-1"
        type="titleCenter"
        style={[animatedStyle]}>
        {community.koreanName}
      </CustomText>

      {community.curFan && (
        <View className="flex-row items-center">
          <Pressable
            onPress={() =>
              navigation.navigate('Schedule', {communityId: community.id})
            }>
            <CalendarSvg width={23} height={23} />
          </Pressable>
          <Pressable
            className="ml-4"
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
    paddingHorizontal: 12,
  },
  communityUserAvatar: {borderWidth: 1.5, borderColor: 'white', marginRight: 3},
});

export default CommunityHeader;
