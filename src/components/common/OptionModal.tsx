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
import ExitSvg from '../../../assets/images/exit.svg';
import Avatar from './Avatar';
import EnterSvg from '../../../assets/images/enter.svg';

interface OptionModalProps {
  modalRef: RefObject<BottomSheetModalMethods>;
  firstText?: string;
  firstColor?: string;
  firstSvg?: 'trash' | 'report' | 'edit' | 'exit';
  firstOnPress: any;
  firstAvatar?: string;
  secondText?: string;
  secondColor?: string;
  secondSvg?: 'trash' | 'report' | 'edit' | 'exit' | 'enter';
  secondOnPress?: any;
  thirdText?: string;
  thirdColor?: string;
  thirdSvg?: 'trash' | 'report' | 'edit' | 'exit';
  thirdOnPress?: any;
}

const OptionModal = (props: OptionModalProps) => {
  const {
    modalRef,
    firstText,
    firstColor = '#000000',
    firstSvg,
    firstOnPress,
    firstAvatar,
    secondText,
    secondColor = '#000000',
    secondSvg,
    secondOnPress,
    thirdText,
    thirdColor = '#000000',
    thirdSvg,
    thirdOnPress,
  } = props;
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => [
      thirdText
        ? 220 + insets.bottom
        : secondText
        ? 160 + insets.bottom
        : 110 + insets.bottom,
    ],
    [insets.bottom, secondText, thirdText],
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
            height: 52,
            paddingHorizontal: 20,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: firstAvatar ? undefined : 'space-between',
            alignItems: 'center',
          }}
          onPress={() => {
            modalRef.current?.close();
            firstOnPress();
          }}>
          {firstAvatar && <Avatar uri={firstAvatar} size={30} />}
          <CustomText
            fontWeight="500"
            style={{
              color: firstColor,
              fontSize: 15,
              marginLeft: firstAvatar ? 10 : undefined,
            }}>
            {firstText}
          </CustomText>
          {firstSvg === 'trash' && <TrashSvg width={20} height={20} />}
          {firstSvg === 'report' && <ReportSvg width={20} height={20} />}
          {firstSvg === 'edit' && <EditSvg width={16} height={16} />}
          {firstSvg === 'exit' && <ExitSvg width={16} height={16} />}
        </Pressable>
        {secondText && (
          <Pressable
            style={{
              backgroundColor: 'white',
              width: '90%',
              height: 52,
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
              fontWeight="500"
              style={{color: secondColor, fontSize: 15}}>
              {secondText}
            </CustomText>
            {secondSvg === 'trash' && <TrashSvg width={20} height={20} />}
            {secondSvg === 'report' && <ReportSvg width={20} height={20} />}
            {secondSvg === 'edit' && <EditSvg width={16} height={16} />}
            {secondSvg === 'exit' && <ExitSvg width={16} height={16} />}
            {secondSvg === 'enter' && <EnterSvg width={16} height={16} />}
          </Pressable>
        )}
        {thirdText && (
          <Pressable
            style={{
              backgroundColor: 'white',
              width: '90%',
              height: 52,
              paddingHorizontal: 20,
              borderRadius: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              alignItems: 'center',
            }}
            onPress={() => {
              modalRef.current?.close();
              thirdOnPress();
            }}>
            <CustomText
              fontWeight="500"
              style={{color: thirdColor, fontSize: 15}}>
              {thirdText}
            </CustomText>
            {thirdSvg === 'trash' && <TrashSvg width={20} height={20} />}
            {thirdSvg === 'report' && <ReportSvg width={20} height={20} />}
            {thirdSvg === 'edit' && <EditSvg width={16} height={16} />}
            {thirdSvg === 'exit' && <ExitSvg width={16} height={16} />}
          </Pressable>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default OptionModal;
