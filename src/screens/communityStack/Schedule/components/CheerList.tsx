import React, {useState} from 'react';
import {
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowSvg from 'assets/images/arrow_up.svg';
import {useGetCheers, useWriteCheer} from 'apis/cheer/useCheers';
import {showTopToast} from 'utils/toast';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {queryClient} from '../../../../../App';
import {matchKeys} from 'apis/match/queries';
import Cheer from './Cheer';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import CommentSkeleton from 'components/skeleton/CommentSkeleton';

interface CheerListProps {
  matchId: number;
  communityId: number;
}

const CheerList = ({matchId, communityId}: CheerListProps) => {
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
  } = useGetCheers(matchId, communityId);

  const handleWriteCheer = async () => {
    if (content.trim().length === 0) {
      return;
    }
    setContent('');
    try {
      await writeCheer({
        matchId,
        communityId,
        content,
      });
    } catch (error: any) {
      if (error.code === 2004) {
        showTopToast(insets.top + 20, '부적절한 단어가 포함되어 있습니다');
      }
      if (error.message === '존재하지 않는 경기') {
        showTopToast(insets.top + 20, '취소된 경기입니다');
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
      <Tabs.FlashList
        data={isLoading ? [] : cheers?.pages.flatMap(page => page.cheers)}
        renderItem={({item}) => (
          <Cheer cheer={item} matchId={matchId} communityId={communityId} />
        )}
        contentContainerStyle={{paddingHorizontal: 10, paddingVertical: 10}}
        estimatedItemSize={100}
        onEndReached={loadCheers}
        onEndReachedThreshold={1}
        ListFooterComponent={isFetchingNextPage ? <CommentSkeleton /> : null}
        ListEmptyComponent={
          isLoading ? <CommentSkeleton /> : <ListEmpty type="cheer" />
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
      <View
        className="px-2 pt-[5] border-t border-t-[#eeeeee]"
        style={{paddingBottom: insets.bottom + 5}}>
        <View
          className="flex-row bg-[#f5f5f5] rounded-[20px] justify-between pl-3"
          style={{paddingVertical: Platform.OS === 'ios' ? 9 : 6}}>
          <TextInput
            multiline
            placeholder="응원 남기기"
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
    </>
  );
};

export default CheerList;
