import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JoinProfile from './JoinProfile/JoinProfile';
import {Player} from 'apis/player/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Community} from 'apis/community/types';

interface Props {
  community: Community;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
}

const JoinModal = (props: Props) => {
  const {community, bottomSheetModalRef} = props;

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
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize">
      <BottomSheetView
        style={[styles.contentContainer, {paddingBottom: insets.bottom + 20}]}>
        <JoinProfile
          community={community}
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
