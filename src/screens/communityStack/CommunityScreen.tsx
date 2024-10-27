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
import {useGetCommunityInfo} from 'apis/community/useCommunities';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import OwnerModal from 'components/community/OwnerModal';
import StarFeedList from 'components/community/StarFeedList';
import LiveList from 'components/community/LiveList';
import NotJoin from 'components/community/NotJoin';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

export type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'Community'
>;

type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
  const {communityId} = route.params;
  const [refreshKey, setRefreshKey] = useState(0);
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: community} = useGetCommunityInfo(communityId, refreshKey);

  if (!community) {
    return null;
  }

  return (
    <>
      <CommunityHeader playerData={community} />
      <Tabs.Container
        renderHeader={() => <CommunityProfile community={community} />}
        headerHeight={HEADER_HEIGHT}
        minHeaderHeight={45 + insets.top}
        renderTabBar={props => <CommunityTabBar {...props} />}>
        <Tabs.Tab name="피드">
          <FeedList community={community} />
        </Tabs.Tab>
        <Tabs.Tab name={community.type === 'PLAYER' ? '스타' : '팀'}>
          <StarFeedList community={community} />
        </Tabs.Tab>
        <Tabs.Tab name="라이브">
          <LiveList community={community} />
        </Tabs.Tab>
        <Tabs.Tab name="채팅">
          <ChatList community={community} />
        </Tabs.Tab>
      </Tabs.Container>
      {community.user == null && (
        <NotJoin
          community={community}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      )}
      <JoinModal
        community={community}
        setRefreshKey={setRefreshKey}
        bottomSheetModalRef={bottomSheetModalRef}
      />
      {community.isManager && community.user === null && (
        <OwnerModal community={community} setRefreshKey={setRefreshKey} />
      )}
    </>
  );
};

export default CommunityScreen;
