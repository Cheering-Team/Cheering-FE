import CustomText from 'components/common/CustomText';
import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OfficialSvg from '../../../assets/images/official.svg';
import MegaphoneSvg from 'assets/images/megaphone-white.svg';
import MoreSvg from '../../../assets/images/three-dots-vertical-white.svg';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Community} from 'apis/player/types';
import Avatar from 'components/common/Avatar';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import OptionModal from 'components/common/OptionModal';
import {useGetDailys} from 'apis/post/usePosts';
import {formatBarDate} from 'utils/format';

interface MyStarCardProps {
  community: Community;
}

const MyStarCard = ({community}: MyStarCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: dailyData} = useGetDailys(
    community.id,
    formatBarDate(new Date()),
    community.manager !== null,
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      className="w-full h-[220] bg-white rounded-2xl"
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
      <View className="absolute z-10 w-full h-full p-5 justify-between">
        <View className="flex-row justify-between">
          <View>
            {community.englishName && (
              <CustomText
                className="text-white text-[15px] ml-[2] pb-0"
                fontWeight="500">
                {community.englishName}
              </CustomText>
            )}

            <View className="flex-row items-center">
              <CustomText
                className="text-white text-[26px] leading-[33px]"
                fontWeight="500">
                {community.koreanName}
              </CustomText>
              {community.manager && (
                <OfficialSvg width={18} height={18} style={{marginLeft: 3}} />
              )}
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

        <View>
          {community.type === 'PLAYER' &&
            dailyData &&
            dailyData.pages[0].result.dailys.length !== 0 && (
              <TouchableOpacity
                activeOpacity={1}
                className="mb-4 flex-row items-center"
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'Daily',
                    params: {
                      communityId: community.id,
                      date: formatBarDate(new Date()),
                    },
                  })
                }>
                <Avatar uri={community.image} size={27} />
                <CustomText
                  numberOfLines={1}
                  fontWeight="600"
                  className="ml-3 text-white text-[16px] flex-1">
                  {dailyData?.pages[0].result.dailys[0].content}
                </CustomText>
              </TouchableOpacity>
            )}
          {community.type === 'PLAYER' &&
            dailyData?.pages[0].result.dailys.length === 0 &&
            community.user?.type === 'MANAGER' && (
              <TouchableOpacity
                activeOpacity={1}
                className="mb-4 flex-row items-center"
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'Daily',
                    params: {
                      communityId: community.id,
                      date: formatBarDate(new Date()),
                      write: true,
                    },
                  })
                }>
                <Avatar uri={community.image} size={27} />
                <CustomText
                  numberOfLines={1}
                  fontWeight="600"
                  className="ml-3 text-orange-100 text-[15px] flex-1">
                  오늘의 한마디를 남겨주세요
                </CustomText>
              </TouchableOpacity>
            )}
          {community.type === 'TEAM' && (
            <TouchableOpacity
              activeOpacity={1}
              className="mb-4 flex-row items-center ml-1">
              <MegaphoneSvg width={18} height={18} />
              <CustomText
                numberOfLines={1}
                fontWeight="600"
                className="ml-3 text-white text-[15px] flex-1">
                {/* {'[공지사항]  9/21일 경기안내'} */}
              </CustomText>
            </TouchableOpacity>
          )}

          <View className="flex-row justify-evenly items-center">
            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'PostWrite',
                  params: {communityId: community.id},
                })
              }>
              <CustomText
                className="text-white text-center text-base"
                fontWeight="500">
                글 작성
              </CustomText>
            </TouchableOpacity>
            <View className="h-5 bg-white w-[2]" />
            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'ChatRoom',
                  params: {chatRoomId: community.officialChatRoomId},
                })
              }>
              <CustomText
                className="text-white text-center text-base"
                fontWeight="500">
                대표 채팅
              </CustomText>
            </TouchableOpacity>
            <View className="h-5 bg-white w-[2]" />

            <TouchableOpacity
              className="p-1"
              activeOpacity={0.5}
              onPress={() => {
                if (community.user) {
                  navigation.navigate('CommunityStack', {
                    screen: 'Profile',
                    params: {playerUserId: community.user.id},
                  });
                }
              }}>
              <CustomText
                className="text-white text-center text-base"
                fontWeight="500">
                내 프로필
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FastImage
        source={{uri: community.backgroundImage || community.image}}
        resizeMode="cover"
        className="w-full h-full rounded-2xl"
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.65)', 'rgba(0, 0, 0, 0.65)']}
        className="rounded-2xl"
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
      <OptionModal
        modalRef={bottomSheetModalRef}
        firstText={community.user?.name}
        firstAvatar={community.user?.image}
        firstOnPress={() => {
          if (community.user) {
            navigation.navigate('CommunityStack', {
              screen: 'Profile',
              params: {playerUserId: community.user.id},
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
          if (community.user) {
            navigation.navigate('CommunityStack', {
              screen: 'DeletePlayerUser',
              params: {playerUserId: community.user.id},
            });
          }
        }}
      />
    </TouchableOpacity>
  );
};

export default MyStarCard;
