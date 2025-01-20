import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, {RefObject, useCallback, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import CustomText from './CustomText';
import {formatMonthDayDay, formatTime} from 'utils/format';
import FastImage from 'react-native-fast-image';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {MatchDetail} from 'apis/match/types';
import {Community} from 'apis/community/types';

interface MatchSelectModalProps {
  matchModalRef: RefObject<BottomSheetModalMethods>;
  matches?: MatchDetail[];
  community: Community;
  onPress: (item: MatchDetail) => void;
}

const MatchSelectModal = ({
  matchModalRef,
  matches,
  community,
  onPress,
}: MatchSelectModalProps) => {
  const snapPoints = useMemo(() => ['70%', '90%'], []);

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
      ref={matchModalRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      snapPoints={snapPoints}>
      <BottomSheetFlatList
        data={matches || []}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 10}}
        ListEmptyComponent={
          <View className="h-[200] items-center justify-center">
            <CustomText className="text-[17px] text-gray-900">
              1주일 전/후의 최근 경기가 없습니다
            </CustomText>
          </View>
        }
        ListHeaderComponent={
          matches && matches?.length > 0 ? (
            <CustomText
              className="text-center text-gray-600 text-[15px] my-2"
              fontWeight="500">
              2주 이내의 경기만 선택 가능합니다
            </CustomText>
          ) : null
        }
        renderItem={({item}) => (
          <Pressable
            className="border border-slate-200 rounded-lg bg-wihte my-[6] px-3 pt-2 pb-3 bg-white"
            onPress={() => {
              onPress(item);
              matchModalRef.current?.dismiss();
            }}>
            <CustomText
              className="text-[15px] text-slate-700 mb-2"
              fontWeight="600">
              {formatMonthDayDay(item.time)}
            </CustomText>
            <View className="flex-row justify-between items-center">
              <View className="items-center w-[110]">
                <FastImage
                  source={{uri: item.homeTeam.image}}
                  className="w-[60] h-[60]"
                />
                <CustomText
                  fontWeight={
                    community.koreanName === item.homeTeam.koreanName
                      ? '600'
                      : '400'
                  }
                  style={{
                    color:
                      community.koreanName === item.homeTeam.koreanName
                        ? 'black'
                        : '#2d2d2d',
                  }}>
                  {item.homeTeam.shortName}
                </CustomText>
              </View>
              <View className="items-center">
                <CustomText fontWeight="600" className="text-[15px]">
                  {formatTime(item.time)}
                </CustomText>
                <CustomText
                  className="text-slate-600 text-[13px] mt-[3]"
                  fontWeight="500">
                  {item.location}
                </CustomText>
              </View>
              <View className="items-center w-[110]">
                <FastImage
                  source={{uri: item.awayTeam.image}}
                  className="w-[60] h-[60]"
                />
                <CustomText
                  fontWeight={
                    community.koreanName === item.homeTeam.koreanName
                      ? '400'
                      : '600'
                  }
                  style={{
                    color:
                      community.koreanName === item.homeTeam.koreanName
                        ? '#2d2d2d'
                        : 'black',
                  }}>
                  {item.awayTeam.shortName}
                </CustomText>
              </View>
            </View>
          </Pressable>
        )}
      />
    </BottomSheetModal>
  );
};

export default MatchSelectModal;
