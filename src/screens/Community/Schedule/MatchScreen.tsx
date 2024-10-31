import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetMatchDetail} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackSvg from 'assets/images/chevron-left.svg';
import MatchInfo from './components/MatchInfo';
import CheerList from './components/CheerList';
import {CommunityTabBar} from 'components/community/CommunityTabBar/CommunityTabBar';

const MatchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const {matchId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'Match'>>().params;

  const insets = useSafeAreaInsets();

  const {data: match, isLoading} = useGetMatchDetail(matchId);

  if (isLoading || !match) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-insets.bottom}>
      <View
        className="px-[5] flex-row justify-between items-center bg-white z-50"
        style={{paddingTop: insets.top, height: 48 + insets.top}}>
        <Pressable className="pr-[28]" onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <View className="flex-row items-center">
          <FastImage
            source={{
              uri: community.image,
            }}
            className="w-[35] h-[35] rounded-full mr-1"
          />
          <CustomText fontWeight="500" className="text-lg pb-0 ml-1">
            {community.koreanName}
          </CustomText>
        </View>
        <View className="w-[65]" />
      </View>
      <Tabs.Container
        renderHeader={() => <MatchInfo match={match} />}
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
          <CheerList matchId={matchId} communityId={community.id} />
        </Tabs.Tab>
        <Tabs.Tab name="MVP 투표"></Tabs.Tab>
      </Tabs.Container>
    </KeyboardAvoidingView>
  );
};

export default MatchScreen;
