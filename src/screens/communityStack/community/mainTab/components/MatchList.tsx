import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import MatchCard from 'components/match/MatchCard';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useEffect, useRef} from 'react';
import {FlatList, ListRenderItem, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatDOW, formatTime, formatTodayOrDate} from 'utils/format';

interface MatchListProps {
  community: Community;
  onTabPress: (index: number) => void;
  matches: MatchDetail[] | undefined;
}

const MatchList = ({community, onTabPress, matches}: MatchListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const matchRef = useRef<FlatList | null>(null);

  const renderItem: ListRenderItem<MatchDetail> = ({item}) => {
    return (
      <MatchCard
        match={item}
        community={community}
        onPress={() => {
          navigation.navigate('Match', {
            matchId: item.id,
            communityId: community.id,
          });
        }}
        liveOnPress={() => {
          if (community.officialRoomId) {
            navigation.navigate('ChatRoom', {
              chatRoomId: community.officialRoomId,
              type: 'OFFICIAL',
            });
          }
        }}
      />
    );
  };

  useEffect(() => {
    if (matches) {
      const index = matches.findIndex(match => {
        const matchDate = new Date(match.time);
        const now = new Date();

        const matchStart = new Date(
          matchDate.getFullYear(),
          matchDate.getMonth(),
          matchDate.getDate(),
        );

        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return matchStart >= todayStart;
      });
      matchRef.current?.scrollToOffset({
        offset: (WINDOW_WIDTH * 0.67 + 8) * index,
        animated: false,
      });
    }
  }, [matches]);

  if (!matches) {
    return null;
  }

  return (
    <View className="mt-3">
      <View className="flex-row justify-between items-center px-[14] mb-2">
        <View className="flex-row items-center">
          <CustomText className="text-lg" fontWeight="500">
            일정
          </CustomText>
          <View className="w-[3] h-[3] bg-black rounded-full mx-[3]" />
          <CustomText className="text-lg" fontWeight="500">
            결과
          </CustomText>
        </View>

        <Pressable
          className="border-b border-b-gray-600"
          onPress={() => onTabPress(3)}>
          <CustomText className="text-gray-600 text-[13px]">
            전체보기
          </CustomText>
        </Pressable>
      </View>
      {matches.length > 0 ? (
        <FlatList
          ref={matchRef}
          horizontal
          data={matches}
          snapToInterval={WINDOW_WIDTH * 0.67 + 8}
          decelerationRate={'fast'}
          contentContainerStyle={{
            paddingLeft: 13,
            paddingRight: 8,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <View className="justify-center items-center h-[80]">
          <CustomText className="text-slate-700">
            최근 일주일 전/후 경기가 없습니다
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default MatchList;
