import CustomText from 'components/common/CustomText';
import React, {useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MoreSvg from '../../../assets/images/three-dots-vertical-white.svg';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import OptionModal from 'components/common/OptionModal';
import {useGetNextMatch} from 'apis/match/useMatches';
import {Community} from 'apis/community/types';
interface MyStarCardProps {
  community: Community;
}

const MyStarCard = ({community}: MyStarCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: match} = useGetNextMatch(community.id);

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        className="bg-white rounded-2xl p-5 w-full h-full justify-between"
        style={{
          shadowColor: '#464646',
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.7,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: community.id},
          })
        }
        onLongPress={() => {
          bottomSheetModalRef.current?.present();
        }}>
        <View className="flex-row justify-between items-start z-10">
          <View className="flex-1">
            {community.type === 'PLAYER' ? (
              <CustomText
                className="text-white text-[18px] ml-[2] mb-[1]"
                fontWeight="600">
                {community.englishName}
              </CustomText>
            ) : (
              <CustomText
                className="text-white text-[18px] ml-[2] mb-[1]"
                fontWeight="600">
                {`${community.sportName} / ${community.leagueName}`}
              </CustomText>
            )}

            <View className="flex-row items-center">
              <CustomText
                numberOfLines={2}
                className="text-white text-[28px]"
                style={{lineHeight: Platform.OS === 'android' ? 36 : 31}}
                type="titleCenter">
                {community.koreanName}
              </CustomText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}>
            <MoreSvg width={22} height={22} />
          </TouchableOpacity>
        </View>

        <View className="z-10 items-end">
          {match &&
            (match.status === 'live' ||
            match.status === 'delayed' ||
            match.status === 'started' ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'Match',
                    params: {community, matchId: match.id},
                  })
                }
                className="mb-5 p-1">
                <View>
                  <View
                    key={match.id}
                    className="flex-row items-end justify-end">
                    <CustomText
                      className="text-[85px] text-white mr-4"
                      style={styles.shadow}
                      fontWeight="700">
                      {48}
                    </CustomText>
                    <View className="flex-row items-center">
                      <View className="items-center">
                        <CustomText
                          className="text-white text-[15px]"
                          style={styles.shadow}>
                          {match.location}
                        </CustomText>
                        <CustomText
                          className="text-4xl text-white"
                          fontWeight="800"
                          style={styles.shadow}>
                          VS
                        </CustomText>
                        <CustomText
                          className="text-[20px] text-[#dc4343]"
                          fontWeight="700"
                          style={styles.shadow}>
                          LIVE
                        </CustomText>
                      </View>
                      <CustomText
                        className="text-[40px] text-white ml-[9] mb-2"
                        fontWeight="700"
                        style={styles.shadow}>
                        {52}
                      </CustomText>
                    </View>

                    <View className="items-center ml-2 w-[65]">
                      <FastImage
                        source={{
                          uri:
                            community.id === match.homeTeam.id
                              ? match.awayTeam.image
                              : match.homeTeam.image,
                        }}
                        className="w-[60] h-[60]"
                      />
                      <CustomText
                        style={styles.shadow}
                        className="text-white text-base"
                        fontWeight="500">
                        {community.id === match.homeTeam.id
                          ? match.awayTeam.shortName
                          : match.homeTeam.shortName}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                className="mb-5 p-1 flex-row self-end items-end"
                style={{}}
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'Match',
                    params: {matchId: match.id, community: community},
                  })
                }>
                <View className="items-center">
                  <CustomText
                    className="text-white text-[15px]"
                    style={styles.shadow}>
                    {match.location}
                  </CustomText>
                  <CustomText
                    className="text-4xl text-white"
                    fontWeight="800"
                    style={styles.shadow}>
                    VS
                  </CustomText>
                  <CustomText
                    className="text-base text-white"
                    style={styles.shadow}>
                    11.02 14:00
                  </CustomText>
                </View>
                <View className="items-center ml-3">
                  <FastImage
                    source={{
                      uri:
                        community.id === match.homeTeam.id
                          ? match.awayTeam.image
                          : match.homeTeam.image,
                    }}
                    className="w-[60] h-[60]"
                  />
                  <CustomText
                    className="text-white text-base"
                    fontWeight="500"
                    style={styles.shadow}>
                    {community.id === match.homeTeam.id
                      ? match.awayTeam.shortName
                      : match.homeTeam.shortName}
                  </CustomText>
                </View>
              </TouchableOpacity>
            ))}
          <View className="w-full flex-row justify-evenly items-center">
            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'PostWrite',
                  params: {community},
                })
              }>
              <CustomText
                className="text-white text-center text-lg"
                fontWeight="500">
                글 작성
              </CustomText>
            </TouchableOpacity>
            <CustomText className="text-lg text-white">|</CustomText>
            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() => {
                if (community.officialRoomId !== null) {
                  navigation.navigate('CommunityStack', {
                    screen: 'ChatRoom',
                    params: {chatRoomId: community.officialRoomId},
                  });
                }
              }}>
              <CustomText
                className="text-white text-center text-lg"
                fontWeight="500">
                대표 채팅
              </CustomText>
            </TouchableOpacity>
            <CustomText className="text-lg text-white">|</CustomText>

            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() => {
                if (community.curFan) {
                  navigation.navigate('CommunityStack', {
                    screen: 'Schedule',
                    params: {community: community},
                  });
                }
              }}>
              <CustomText
                className="text-white text-center text-lg"
                fontWeight="500">
                경기 일정
              </CustomText>
            </TouchableOpacity>
          </View>
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
            resizeMode={community.type === 'TEAM' ? 'contain' : 'cover'}
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
      </TouchableOpacity>
      <OptionModal
        modalRef={bottomSheetModalRef}
        firstText={community.curFan?.name}
        firstAvatar={community.curFan?.image}
        firstOnPress={() => {
          if (community.curFan) {
            navigation.navigate('CommunityStack', {
              screen: 'Profile',
              params: {fanId: community.curFan.id},
            });
          }
        }}
        secondText="커뮤니티 바로가기"
        secondSvg="enter"
        secondOnPress={() => {
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: community.id},
          });
        }}
        thirdText="커뮤니티 탈퇴"
        thirdColor="#ff2626"
        thirdSvg="exit"
        thirdOnPress={() => {
          if (community.curFan) {
            navigation.navigate('CommunityStack', {
              screen: 'DeleteFan',
              params: {fanId: community.curFan.id},
            });
          }
        }}
      />
    </>
  );
};

export default MyStarCard;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
});
