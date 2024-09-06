import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {RefObject, useCallback, useMemo} from 'react';
import {Pressable} from 'react-native';
import CustomText from './CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TrashSvg from '../../../assets/images/trash-red.svg';
import ReportSvg from '../../../assets/images/report-red.svg';
import EditSvg from '../../../assets/images/edit.svg';

interface OptionModalProps {
  modalRef: RefObject<BottomSheetModalMethods>;
  firstText: string;
  firstColor?: string;
  firstSvg?: 'trash' | 'report' | 'edit';
  firstOnPress: any;
  secondText?: string;
  secondColor?: string;
  secondSvg?: 'trash' | 'report' | 'edit';
  secondOnPress?: any;
}

const OptionModal = (props: OptionModalProps) => {
  const {
    modalRef,
    firstText,
    firstColor = '#000000',
    firstSvg,
    firstOnPress,
    secondText,
    secondColor = '#000000',
    secondSvg,
    secondOnPress,
  } = props;
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => [secondText ? 160 + insets.bottom : 110 + insets.bottom],
    [insets.bottom, secondText],
  );

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
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{backgroundColor: '#f4f4f4'}}>
      <BottomSheetView
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <Pressable
          style={{
            backgroundColor: 'white',
            width: '90%',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => {
            modalRef.current?.close();
            firstOnPress();
          }}>
          <CustomText
            fontWeight="600"
            style={{color: firstColor, fontSize: 15}}>
            {firstText}
          </CustomText>
          {firstSvg === 'trash' && <TrashSvg width={20} height={20} />}
          {firstSvg === 'report' && <ReportSvg width={20} height={20} />}
          {firstSvg === 'edit' && <EditSvg width={16} height={16} />}
        </Pressable>
        {secondText && (
          <Pressable
            style={{
              backgroundColor: 'white',
              width: '90%',
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              alignItems: 'center',
            }}
            onPress={() => {
              modalRef.current?.close();
              secondOnPress();
            }}>
            <CustomText
              fontWeight="600"
              style={{color: secondColor, fontSize: 15}}>
              {secondText}
            </CustomText>
            {secondSvg === 'trash' && <TrashSvg width={20} height={20} />}
            {secondSvg === 'report' && <ReportSvg width={20} height={20} />}
            {secondSvg === 'edit' && <EditSvg width={16} height={16} />}
          </Pressable>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default OptionModal;
