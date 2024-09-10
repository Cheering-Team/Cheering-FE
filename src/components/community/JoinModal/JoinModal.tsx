import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {GetPlayersInfoResponse} from '../../../types/player';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JoinProfile from './JoinProfile/JoinProfile';

export interface ImageType {
  uri: string;
  name: string;
  type: string;
}

interface Props {
  playerData: GetPlayersInfoResponse;
  isModalOpen: boolean;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  bottomSheetModalRef: any;
}

const JoinModal = (props: Props) => {
  const {playerData, setRefreshKey, bottomSheetModalRef} = props;

  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [380 + insets.bottom], [insets.bottom]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBlurBehavior="restore"
      keyboardBehavior="interactive">
      <BottomSheetView
        style={[styles.contentContainer, {paddingBottom: insets.bottom + 20}]}>
        <JoinProfile
          playerData={playerData}
          setRefreshKey={setRefreshKey}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default JoinModal;
