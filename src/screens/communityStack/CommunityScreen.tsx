import React, {useCallback, useRef, useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import CommunityHeader from '../../components/community/CommunityInfo/CommunityHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommunityProfile from '../../components/community/CommunityInfo/CommunityProfile';
import {CommunityTabBar} from '../../components/community/CommunityTabBar/CommunityTabBar';
import FeedList from '../../components/community/FeedList/FeedList';
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

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

export type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'Community'
>;

type CommunityScreenRouteProp = RouteProp<CommunityStackParamList, 'Community'>;

const CommunityScreen = ({route}: {route: CommunityScreenRouteProp}) => {
  const {playerId} = route.params;
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {data: playerData, isLoading: playerIsLoading} = useGetPlayersInfo(
    playerId,
    refreshKey,
  );

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  if (playerIsLoading || !playerData) {
    return null;
  }

  return (
    <>
      <CommunityHeader playerData={playerData} />
      <Tabs.Container
        renderHeader={() => <CommunityProfile playerData={playerData} />}
        headerHeight={HEADER_HEIGHT}
        minHeaderHeight={45 + insets.top}
        renderTabBar={props => <CommunityTabBar {...props} />}>
        <Tabs.Tab name="피드">
          <FeedList
            playerData={playerData.result}
            handlePresentModalPress={handlePresentModalPress}
          />
        </Tabs.Tab>
        {playerData.result.owner != null && (
          <Tabs.Tab name="스타">
            <StarFeedList />
          </Tabs.Tab>
        )}
        {playerData.result.owner != null && (
          <Tabs.Tab name="라이브">
            <LiveList />
          </Tabs.Tab>
        )}
        <Tabs.Tab name="채팅">
          <ChatList
            playerData={playerData.result}
            handlePresentModalPress={handlePresentModalPress}
          />
        </Tabs.Tab>
      </Tabs.Container>
      <JoinModal
        playerData={playerData.result}
        setRefreshKey={setRefreshKey}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        bottomSheetModalRef={bottomSheetModalRef}
      />
      {playerData.result.isOwner && playerData.result.user === null && (
        <OwnerModal
          playerData={playerData.result}
          setRefreshKey={setRefreshKey}
        />
      )}
    </>
  );
};

export default CommunityScreen;
