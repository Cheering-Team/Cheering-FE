import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMatchDetail} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackSvg from 'assets/images/chevron-left.svg';
import {CommunityTabBar} from 'components/community/CommunityTabBar/CommunityTabBar';
import {useGetCommunityById} from 'apis/community/useCommunities';
import CheerTab from './CheerTab';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import MatchInfo from 'components/common/MatchInfo';
import VoteList from '../Schedule/match/components/VoteList';

const MatchScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const {matchId, communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'Match'>>().params;
  const insets = useSafeAreaInsets();

  const {data: match, isLoading} = useGetMatchDetail(matchId);
  const {data: community} = useGetCommunityById(communityId);

  if (isLoading || !match || !community) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-insets.bottom}>
      <View
        className="px-[5] flex-row justify-between items-center bg-white z-50"
        style={{paddingTop: insets.top, height: 40 + insets.top}}>
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={25} height={25} />
        </Pressable>

        <View className="items-center">
          <CustomText fontWeight="500" className="text-[15px] text-slate-900">
            경기 일정
          </CustomText>
          <CustomText
            fontWeight="500"
            className="text-[13px]"
            style={{color: community.color}}>
            {community.koreanName}
          </CustomText>
        </View>
        <View className="w-[25]" />
      </View>
      <Tabs.Container
        renderHeader={() => <MatchInfo match={match} height={130} />}
        renderTabBar={props => (
          <CommunityTabBar
            {...props}
            labelStyle={{color: 'black'}}
            tabStyle={{backgroundColor: 'white'}}
            indicatorStyle={{backgroundColor: 'black'}}
            activeColor="black"
            inactiveColor="black"
          />
        )}>
        <Tabs.Tab name="응원">
          <CheerTab match={match} community={community} />
        </Tabs.Tab>
        <Tabs.Tab name="투표">
          <VoteList matchId={matchId} community={community} />
        </Tabs.Tab>
      </Tabs.Container>
    </KeyboardAvoidingView>
  );
};

export default MatchScreen;
