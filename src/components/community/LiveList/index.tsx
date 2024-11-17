import {Player} from 'apis/player/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React from 'react';
import {View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface LiveListProps {
  community: Player;
}

const LiveList = ({community}: LiveListProps) => {
  const insets = useSafeAreaInsets();

  if (community.manager === null) {
    return (
      <Tabs.FlatList
        data={[]}
        renderItem={() => <></>}
        ListEmptyComponent={
          <View
            className="items-center justify-center pb-4"
            style={{
              height: WINDOW_HEIGHT / 2 - insets.bottom - 45 - 40,
            }}>
            <Avatar
              uri={community.image}
              size={80}
              style={{borderWidth: 1, borderColor: 'black'}}
            />
            <CustomText className="mt-5 text-lg" fontWeight="600">
              아직 참여하지 않으셨어요
            </CustomText>
          </View>
        }
      />
    );
  }

  return <></>;
};

export default LiveList;
