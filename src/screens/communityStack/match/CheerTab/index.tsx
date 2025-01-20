import React, {useState} from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowSvg from 'assets/images/arrow_up.svg';
import {useGetCheers, useWriteCheer} from 'apis/cheer/useCheers';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {matchKeys} from 'apis/match/queries';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import CommentSkeleton from 'components/skeleton/CommentSkeleton';
import {Community} from 'apis/community/types';
import {queryClient} from '../../../../../App';
import Cheer from './components/Cheer';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';

interface CheerTabProps {
  match: MatchDetail;
  community: Community;
}

const CheerTab = ({match, community}: CheerTabProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [content, setContent] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {mutateAsync: writeCheer} = useWriteCheer();
  const {
    data: cheers,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetCheers(match.id, community.id);

  const handleWriteCheer = async () => {
    if (content.trim().length === 0) {
      return;
    }
    setContent('');
    try {
      await writeCheer({
        matchId: match.id,
        communityId: community.id,
        content,
      });
    } catch (error: any) {
      if (error.message === '존재하지 않는 경기') {
        navigation.goBack();
        queryClient.invalidateQueries({queryKey: matchKeys.lists()});
      }
    }
  };

  const loadCheers = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <Tabs.FlatList
        data={cheers?.pages.flatMap(page => page.cheers) || []}
        renderItem={({item}) => (
          <Cheer cheer={item} matchId={match.id} community={community} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 6,
          paddingBottom: 100,
        }}
        onEndReached={loadCheers}
        onEndReachedThreshold={1}
        ListHeaderComponent={<View className="w-full h-[5]" />}
        ListFooterComponent={isFetchingNextPage ? <CommentSkeleton /> : null}
        ListEmptyComponent={
          isLoading ? <CommentSkeleton /> : <ListEmpty type="cheer" />
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
      {match.status === 'live' ? (
        <View
          className="absolute bottom-0 w-full z-10"
          style={{paddingBottom: insets.bottom}}>
          <Pressable
            onPress={() => {
              if (community.officialRoomId) {
                navigation.navigate('ChatRoom', {
                  chatRoomId: community.officialRoomId,
                  type: 'OFFICIAL',
                });
              }
            }}
            className="justify-center items-center m-2 rounded-md py-2 "
            style={{
              backgroundColor: community.color,
            }}>
            <CustomText className="text-white text-base" fontWeight="500">
              실시간 응원 채팅 바로가기
            </CustomText>
            <View className="w-2 h-2 rounded-full bg-rose-600 absolute right-2 top-[6]" />
          </Pressable>
        </View>
      ) : (
        <View
          className="px-2 pt-[5] border-t border-t-[#eeeeee] bg-white absolute bottom-0 w-full z-10"
          style={{paddingBottom: insets.bottom + 5}}>
          <View
            className="flex-row bg-[#f5f5f5] rounded-[20px] justify-between pl-3"
            style={{paddingVertical: Platform.OS === 'ios' ? 9 : 6}}>
            <TextInput
              multiline
              editable={match.status !== 'closed'}
              placeholder={
                match.status === 'closed'
                  ? '이미 경기가 끝났어요'
                  : '응원 남기기'
              }
              maxLength={999}
              className="text-sm flex-1 p-0 m-0 mr-[50]"
              value={content}
              onChangeText={setContent}
              style={{
                fontFamily: 'NotoSansKR-Regular',
                includeFontPadding: false,
              }}
              allowFontScaling={false}
              placeholderTextColor={'#929292'}
            />
            <TouchableOpacity
              onPress={handleWriteCheer}
              disabled={content.trim().length === 0}
              activeOpacity={0.5}
              style={[
                {
                  position: 'absolute',
                  right: 5,
                  bottom: 3,
                  backgroundColor: 'black',
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  borderRadius: 20,
                },
                content.trim().length === 0 && {backgroundColor: '#a1a1a1'},
              ]}>
              <ArrowSvg width={15} height={15} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default CheerTab;
