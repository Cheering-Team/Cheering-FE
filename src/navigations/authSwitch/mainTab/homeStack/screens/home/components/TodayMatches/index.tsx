import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetCommunitiesByIds} from 'apis/community/useCommunities';
import {useGetMatchesByDate} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import MatchCard from 'components/match/MatchCard';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TodayMatches = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const today = new Date();
  const matchModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const insets = useSafeAreaInsets();

  const [curMatchId, setCurMatchId] = useState<number | null>(null);
  const [communityIds, setCommunityIds] = useState<number[] | null>(null);
  const [isLive, setIsLive] = useState(false);

  const {data: matches} = useGetMatchesByDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  const communities = useGetCommunitiesByIds(communityIds);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <>
      <CustomText className="text-[18px] mt-8 mb-3 ml-4" fontWeight="500">
        오늘 우리팀 경기
      </CustomText>
      <View className="mx-[14]">
        {matches?.map(match => {
          return (
            <MatchCard
              key={match.id}
              match={match}
              onPress={() => {
                setIsLive(false);
                setCommunityIds(match.relatedCommunityIds);
                setCurMatchId(match.id);
                matchModalRef.current?.present();
              }}
              liveOnPress={() => {
                setIsLive(true);
                setCommunityIds(match.relatedCommunityIds);
                setCurMatchId(match.id);
                matchModalRef.current?.present();
              }}
            />
          );
        })}
        {matches?.length === 0 && (
          <Pressable
            className="bg-white py-[9] px-2 rounded-lg shadow-sm shadow-gray-100 justify-center items-center h-[110]"
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}>
            <CustomText className="text-slate-700 text-[14px]">
              오늘 하루는 심심할지도..
            </CustomText>
          </Pressable>
        )}
      </View>
      <BottomSheetModal
        ref={matchModalRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={true}
        snapPoints={snapPoints}>
        <BottomSheetFlatList
          data={communities.map(query => query.data)}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: insets.bottom + 10,
          }}
          ListHeaderComponent={
            <CustomText
              className="text-center text-gray-600 text-[15px] my-2"
              fontWeight="500">
              이동할 커뮤니티를 선택해 주세요
            </CustomText>
          }
          renderItem={({item}) => (
            <Pressable
              className="border border-slate-200 rounded-lg bg-wihte my-[6] px-3 py-2 bg-white flex-row items-center"
              onPress={() => {
                if (curMatchId && item) {
                  if (isLive && item.officialRoomId) {
                    matchModalRef.current?.dismiss();
                    navigation.navigate('CommunityStack', {
                      screen: 'ChatRoom',
                      params: {
                        chatRoomId: item.officialRoomId,
                        type: 'OFFICIAL',
                      },
                    });
                  } else {
                    matchModalRef.current?.dismiss();
                    navigation.navigate('CommunityStack', {
                      screen: 'Match',
                      params: {matchId: curMatchId, communityId: item.id},
                    });
                  }
                }
              }}>
              <FastImage
                source={{uri: item?.image}}
                className="w-10 h-10 rounded-full"
              />
              <CustomText className="text-[14.5px] ml-[15] text-gray-900">
                {item?.koreanName}
              </CustomText>
            </Pressable>
          )}
        />
      </BottomSheetModal>
    </>
  );
};

export default TodayMatches;
