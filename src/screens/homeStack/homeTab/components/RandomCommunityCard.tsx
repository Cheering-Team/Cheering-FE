import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetRandomCommunity} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'constants/dimension';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import RefreshSvg from 'assets/images/refresh-white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';

const RandomCommunityCard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: community, refetch} = useGetRandomCommunity();

  if (community) {
    return (
      <Pressable
        className="bg-white rounded-2xl p-5 justify-between"
        style={{
          shadowColor: '#464646',
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.7,
          shadowRadius: 4,
          elevation: 5,
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT - 91 - insets.top - insets.bottom,
          transform: [{scale: 0.87}],
        }}
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: community.id, initialIndex: 0},
          })
        }>
        <View className="flex-row justify-between items-start z-10">
          <View className="flex-1">
            {community.type === 'PLAYER' ? (
              <CustomText
                className="text-white text-[18px] ml-[2] mb-[5]"
                fontWeight="600">
                {community.englishName}
              </CustomText>
            ) : (
              <CustomText
                className="text-white text-[18px] ml-[2] mb-[5]"
                fontWeight="600">
                {`${community.sportName} / ${community.leagueName}`}
              </CustomText>
            )}

            <View className="flex-row items-center">
              <CustomText
                numberOfLines={2}
                className="text-white text-[28px]"
                style={{bottom: 3}}
                type="titleCenter">
                {community.koreanName}
              </CustomText>
            </View>
          </View>
        </View>
        <View className="z-10 items-center">
          <CustomText className="text-base text-gray-100" fontWeight="400">
            아직 가입한 커뮤니티가 없으시네요
          </CustomText>
          {community.type === 'PLAYER' && (
            <CustomText
              type="titleCenter"
              className="text-[30px] text-white bottom-[2]">
              이런 선수는 어떠신가요?
            </CustomText>
          )}
          {community.type === 'TEAM' && (
            <CustomText
              type="titleCenter"
              className="text-[30px] text-white bottom-[2]">
              이런 팀은 어떠신가요?
            </CustomText>
          )}
          <Pressable
            onPress={() => refetch()}
            className="p-2 bg-black/20 rounded-full mt-2">
            <RefreshSvg width={30} height={30} />
          </Pressable>
        </View>

        {community.backgroundImage ? (
          <FastImage
            source={{
              uri: community.backgroundImage,
              priority: FastImage.priority.high,
            }}
            style={{...StyleSheet.absoluteFillObject}}
            resizeMode="cover"
            className="rounded-2xl"
          />
        ) : (
          <FastImage
            source={{uri: community.image, priority: FastImage.priority.high}}
            style={{...StyleSheet.absoluteFillObject}}
            resizeMode="contain"
            className="rounded-2xl"
          />
        )}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.6)']}
          className="rounded-2xl"
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
      </Pressable>
    );
  }
};

export default RandomCommunityCard;
