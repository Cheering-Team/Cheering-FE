import React, {useRef, useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import CommunityHeader from '../../components/community/CommunityInfo/CommunityHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommunityProfile from '../../components/community/CommunityInfo/CommunityProfile';
import {CommunityTabBar} from '../../components/community/CommunityTabBar/CommunityTabBar';
import FeedList from '../../components/community/FeedList';
import ChatList from '../../components/community/ChatList/ChatList';
import {WINDOW_HEIGHT} from '../../constants/dimension';
import JoinModal from '../../components/community/JoinModal/JoinModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useGetPlayerById} from 'apis/player/usePlayers';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import OwnerModal from 'components/community/OwnerModal';
import NotJoin from 'components/community/NotJoin';
import {useGetTeamById} from 'apis/team/useTeams';
import {useGetCommunityById} from 'apis/community/useCommunities';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

export type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'Community'
>;

type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
  const {communityId} = route.params;

  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: community} = useGetCommunityById(communityId);

  if (!community) {
    return null;
  }

  return (
    <>
      <CommunityHeader community={community} />
      <Tabs.Container
        renderHeader={() => <CommunityProfile community={community} />}
        headerHeight={HEADER_HEIGHT}
        minHeaderHeight={45 + insets.top}
        renderTabBar={props => <CommunityTabBar {...props} />}>
        <Tabs.Tab name="피드">
          <FeedList community={community} />
        </Tabs.Tab>
        <Tabs.Tab name="채팅">
          <ChatList community={community} />
        </Tabs.Tab>
      </Tabs.Container>
      {community.curFan == null && (
        <NotJoin
          community={community}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      )}
      <JoinModal
        community={community}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};

export default CommunityScreen;
