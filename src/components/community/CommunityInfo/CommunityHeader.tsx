import React from 'react';
import {Platform, Pressable, StyleSheet, View} from 'react-native';
import CheveronLeft from 'assets/images/chevron-left-white.svg';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../common/Avatar';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {Community} from 'apis/community/types';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import CustomText from 'components/common/CustomText';

interface CommunityHeaderProps {
  community: Community;
  scrollY: SharedValue<number>;
}

const CommunityHeader = (props: CommunityHeaderProps) => {
  const {community, scrollY} = props;
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const animatedBGStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top - 40],
        ['transparent', community.color],
      ),
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top - 40],
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
          height: insets.top + 40,
        },
        animatedBGStyle,
      ]}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <CheveronLeft width={15} height={15} />
      </Pressable>
      <CustomText
        className="text-white text-[19px] ml-3 flex-1"
        type="titleCenter"
        style={[animatedStyle, {bottom: Platform.OS === 'android' ? 3 : 0}]}>
        {community.koreanName}
      </CustomText>
      {community.curFan && (
        <View className="flex-row items-center">
          <Pressable
            className="ml-4"
            onPress={() => {
              if (community.curFan && community.curFan.type !== 'ADMIN') {
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
