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
import {useGetPlayersInfo} from 'apis/player/usePlayers';
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
  const {communityId: playerId} = route.params;
  const [refreshKey, setRefreshKey] = useState(0);
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: communityData} = useGetPlayersInfo(playerId, refreshKey);

  if (!communityData) {
    return null;
  }

  return (
    <>
      <CommunityHeader playerData={communityData.result} />
      <Tabs.Container
        renderHeader={() => <CommunityProfile playerData={communityData} />}
        headerHeight={HEADER_HEIGHT}
        minHeaderHeight={45 + insets.top}
        renderTabBar={props => <CommunityTabBar {...props} />}>
        <Tabs.Tab name="피드">
          <FeedList playerData={communityData.result} />
        </Tabs.Tab>
        <Tabs.Tab name={communityData.result.type === 'PLAYER' ? '스타' : '팀'}>
          <StarFeedList community={communityData.result} />
        </Tabs.Tab>
        <Tabs.Tab name="라이브">
          <LiveList />
        </Tabs.Tab>
        <Tabs.Tab name="채팅">
          <ChatList community={communityData.result} />
        </Tabs.Tab>
      </Tabs.Container>
      {communityData.result.user == null && (
        <NotJoin
          community={communityData.result}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      )}
      <JoinModal
        playerData={communityData.result}
        setRefreshKey={setRefreshKey}
        bottomSheetModalRef={bottomSheetModalRef}
      />
      {communityData.result.isManager && communityData.result.user === null && (
        <OwnerModal
          playerData={communityData.result}
          setRefreshKey={setRefreshKey}
        />
      )}
    </>
  );
};

export default CommunityScreen;
