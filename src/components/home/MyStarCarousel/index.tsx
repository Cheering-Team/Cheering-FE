import {useGetMyPlayers} from 'apis/player/usePlayers';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../../../assets/images/three-dots-vertical-white.svg';
import {Player} from 'apis/player/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import OptionModal from 'components/common/OptionModal';
import {useGetNotices} from 'apis/notice/useNotices';
import OfficialSvg from '../../../../assets/images/official.svg';
import Avatar from 'components/common/Avatar';

const MyStarCarousel = () => {
  const navigation = useNavigation();
  const progress = useSharedValue<number>(0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: playerData} = useGetMyPlayers();
  const {data: noticeData} = useGetNotices();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const renderItem = ({item, index}) => {
    if (playerData && index >= playerData?.result.length) {
      return (
        <Pressable
          className="w-full h-[220]"
          style={{
            shadowColor: '#5a5a5a',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 5,
          }}
          onPress={() => navigation.navigate('Notice', {noticeId: item.id})}>
          <FastImage
            source={{uri: item.image}}
            resizeMode="cover"
            className="w-full h-full rounded-2xl"
          />
        </Pressable>
      );
    }
    return (
      <Pressable
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
            params: {playerId: item.id},
          })
        }>
        <View className="absolute z-10 w-full h-full p-5 justify-between">
          <View className="flex-row justify-between">
            <View>
              <CustomText
                className="text-white text-[15px] ml-[2] pb-0"
                fontWeight="500">
                {item.englishName}
              </CustomText>
              <View className="flex-row">
                <CustomText
                  className="text-white text-[26px] leading-[35px]"
                  fontWeight="500">
                  {item.koreanName}
                </CustomText>
                {item.owner && (
                  <OfficialSvg
                    width={18}
                    height={18}
                    style={{marginLeft: 3, marginTop: 5}}
                  />
                )}
              </View>
            </View>
            <Pressable
              onPress={() => {
                setSelectedPlayer(item);
                bottomSheetModalRef.current?.present();
              }}>
              <MoreSvg width={22} height={22} />
            </Pressable>
          </View>

          {item.isOwner ? (
            <Pressable
              className="flex-row items-center"
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'Daily',
                  params: {playerId: item.id},
                })
              }>
              <Avatar uri={item.user.image} size={40} />
              <View className="ml-4">
                <View className="bg-[#efefef] rounded-xl px-[13] py-[5] z-10">
                  <CustomText className="text-[14px]">
                    팬들에게 오늘의 한마디를 남겨주세요
                  </CustomText>
                </View>
                <View className="bg-[#efefef] absolute top-[5] left-[-1] rounded-[2px] w-5 h-5 rotate-45" />
              </View>
            </Pressable>
          ) : (
            <View className="flex-row">
              <Pressable
                className="flex-1"
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'PostWrite',
                    params: {playerId: item.id},
                  })
                }>
                <CustomText
                  className="text-white text-center text-base"
                  fontWeight="500">
                  글 작성
                </CustomText>
              </Pressable>

              <Pressable
                className="flex-1 border-x-[1px] border-white"
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'ChatRoom',
                    params: {chatRoomId: item.officialChatRoomId},
                  })
                }>
                <CustomText
                  className="text-white text-center text-base"
                  fontWeight="500">
                  대표 채팅
                </CustomText>
              </Pressable>

              <Pressable
                className="flex-1"
                onPress={() =>
                  navigation.navigate('CommunityStack', {
                    screen: 'Profile',
                    params: {playerUserId: item.user.id},
                  })
                }>
                <CustomText
                  className="text-white text-center text-base"
                  fontWeight="500">
                  내 프로필
                </CustomText>
              </Pressable>
            </View>
          )}
        </View>
        <FastImage
          source={{uri: item.backgroundImage}}
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
      </Pressable>
    );
  };

  if (playerData && noticeData) {
    return (
      <>
        <Carousel
          loop={false}
          data={[...(playerData?.result || []), ...(noticeData?.result || [])]}
          mode="parallax"
          width={WINDOW_WIDTH}
          height={220}
          onProgressChange={progress}
          modeConfig={{
            parallaxScrollingScale: 0.87,
            parallaxScrollingOffset: 62,
          }}
          renderItem={renderItem}
        />
        <Pagination.Basic
          progress={progress}
          data={[...(playerData?.result || []), ...(noticeData?.result || [])]}
          dotStyle={{
            width: Math.floor(
              (WINDOW_WIDTH * 0.4) /
                (playerData.result.length + noticeData?.result.length),
            ),
            height: 4,
            backgroundColor: '#ebebeb',
            borderRadius: 1,
          }}
          activeDotStyle={{
            overflow: 'hidden',
            backgroundColor: '#393939',
          }}
          containerStyle={{gap: 6, marginBottom: 10}}
          horizontal
        />

        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText={selectedPlayer?.user?.nickname}
          firstAvatar={selectedPlayer?.user?.image}
          firstOnPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'Profile',
              params: {playerUserId: selectedPlayer?.user?.id},
            });
          }}
          secondText="커뮤니티 바로가기"
          secondSvg="enter"
          secondOnPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {playerId: selectedPlayer?.id},
            });
          }}
          thirdText="커뮤니티 탈퇴"
          thirdColor="#ff2626"
          thirdSvg="exit"
          thirdOnPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'DeletePlayerUser',
              params: {playerUserId: selectedPlayer?.user?.id},
            });
          }}
        />
      </>
    );
  }
};

export default MyStarCarousel;
