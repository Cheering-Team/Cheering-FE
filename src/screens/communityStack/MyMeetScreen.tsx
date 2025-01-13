import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MeetInfo} from 'apis/meet/types';
import {useFindAllMyMeets} from 'apis/meet/useMeets';
import CCHeader from 'components/common/CCHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useEffect} from 'react';
import {ListRenderItem, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MeetCard from './community/meetTab/components/MeetCard';

const MyMeetScreen = () => {
  useDarkStatusBar();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetPrivateChatList'>>()
      .params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meets} = useFindAllMyMeets(community.id);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    console.log(JSON.stringify(meets));
  }, [meets]);

  const renderItem: ListRenderItem<MeetInfo> = ({item}) => {
    return (
      <MeetCard
        meet={item}
        onPress={() => {
          navigation.navigate('Meet', {meetId: item.id, community});
        }}
      />
    );
  };

  return (
    <View className="flex-1">
      <CCHeader
        title="내 모임 목록"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.FlatList
        data={meets?.pages.flatMap(page => page.meets)}
        renderItem={renderItem}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
        }}
      />
    </View>
  );
};

export default MyMeetScreen;
