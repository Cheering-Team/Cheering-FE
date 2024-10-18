import {
  useDeleteDaily,
  useEditDaily,
  useGetDailyExist,
  useGetDailys,
  useWriteDaily,
} from 'apis/post/usePosts';
import Avatar from 'components/common/Avatar';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  UIManager,
  View,
  ViewabilityConfig,
} from 'react-native';
import CustomText from 'components/common/CustomText';
import CloseSvg from '../../assets/images/close-black.svg';
import {showBottomToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlashList,
} from '@gorhom/bottom-sheet';

import AlertModal from 'components/common/AlertModal/AlertModal';
import DailyTextInput from 'components/community/DailyTextInput';
import {useGetComments} from 'apis/comment/useComments';
import Daily from 'components/post/Daily';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import DownSvg from '../../assets/images/tri-down-gray.svg';
import {Calendar} from 'react-native-calendars';
import {formatBarDate, formatMonthDay, formatXDate} from 'utils/format';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SCREEN_WIDTH} from 'constants/dimension';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type MarkingType = {
  [key: string]: {
    marked: boolean;
    selected?: boolean;
  };
};

const DailyScreen = ({navigation, route}) => {
  const {playerId, date} = route.params;
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['80%'];
  const viewabilityConfig = useRef<ViewabilityConfig>({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
  }).current;
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [content, setContent] = useState('');
  const [curId, setCurId] = useState<number | null>(null);
  const [curComment, setCurComment] = useState<number | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const {
    data: dailyData,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetDailys(playerId, date);
  const {data: commentData} = useGetComments(curComment);
  const {data: dailyExistData} = useGetDailyExist(playerId);
  const {mutateAsync: writeDaily} = useWriteDaily();
  const {mutateAsync: editDaily} = useEditDaily();
  const {mutateAsync: deleteDaily} = useDeleteDaily();

  const handleWriteDaily = async () => {
    const data = await writeDaily({communityId: playerId, content});
    setIsWriteOpen(false);
    if (data.message === '작성 완료') {
      showBottomToast(insets.bottom + 20, data.message);
      setContent('');
    }
  };

  const handleEditDaily = async () => {
    if (curId) {
      const data = await editDaily({dailyId: curId, content});
      setIsWriteOpen(false);
      if (data.message === '수정 완료') {
        showBottomToast(insets.bottom + 20, data.message);
        setContent('');
      }
    }
  };

  const handleDeleteDaily = async () => {
    if (curId) {
      const data = await deleteDaily({dailyId: curId});
      if (data.message === '삭제 완료') {
        showBottomToast(insets.bottom + 20, data.message);
        setContent('');
      }
    }
  };

  const loadDaily = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (dailyExistData) {
      const marking: MarkingType = {};
      for (const day of dailyExistData.result) {
        marking[day] = {marked: true};
      }
      marking[date] = {...marking[date], selected: true};
      setMarkedDates(marking);
    }
  }, [dailyExistData, date]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View
          className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]"
          style={Platform.OS === 'android' && {marginTop: insets.top}}>
          <Pressable onPress={() => navigation.goBack()}>
            <CloseSvg width={32} height={32} />
          </Pressable>
          <Pressable
            className="flex-row items-center ml-4"
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setIsCalendarOpen(prev => !prev);
            }}>
            <CustomText className="text-lg pb-0 mr-1 text-sla" fontWeight="500">
              {formatMonthDay(date)}
            </CustomText>
            <DownSvg width={15} height={15} />
          </Pressable>
          <View className="w-8 h-8" />
        </View>
        {isCalendarOpen && (
          <Calendar
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#eeeeee',
            }}
            onDayPress={day => {
              navigation.setParams({playerId, date: day.dateString});
            }}
            maxDate={formatBarDate(new Date())}
            monthFormat={'M월 yyyy'}
            theme={{
              arrowColor: 'black',
              textDayHeaderFontSize: 13,
              textMonthFontFamily: 'NotoSansKR-Medium',
              dayTextColor: 'black',
              textDayFontWeight: '500',
              textSectionTitleColor: 'black',
              todayTextColor: 'black',
            }}
            renderHeader={date => (
              <CustomText fontWeight="500" className="text-base">
                {formatXDate(date)}
              </CustomText>
            )}
            markedDates={markedDates}
          />
        )}
        {dailyData ? (
          <FlatList
            data={dailyData.pages.flatMap(page => page.result.dailys)}
            className="bg-white"
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 10,
              paddingBottom: 100,
            }}
            onEndReached={loadDaily}
            onEndReachedThreshold={1}
            renderItem={({item}) => (
              <Daily
                dailyData={dailyData.pages[0].result}
                post={item}
                setIsWriteOpen={setIsWriteOpen}
                setContent={setContent}
                setCurId={setCurId}
                setIsDeleteOpen={setIsDeleteOpen}
                bottomSheetRef={bottomSheetRef}
                setCurComment={setCurComment}
              />
            )}
            ListFooterComponent={
              dailyData.pages[0].result.isManager &&
              date === formatBarDate(new Date()) ? (
                <View className="flex-row items-center my-2">
                  <Avatar
                    uri={dailyData.pages[0].result.manager.image}
                    size={40}
                  />
                  <Pressable
                    className="bg-white p-3 ml-3 rounded-[15px] flex-row items-center"
                    onPress={() => {
                      setIsWriteOpen(true);
                      setCurId(null);
                    }}
                    style={{
                      shadowColor: '#000000',
                      shadowOffset: {width: 1, height: 1},
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}>
                    <CustomText className="text-gray-400">
                      한마디 남기기..
                    </CustomText>
                  </Pressable>
                </View>
              ) : null
            }
          />
        ) : (
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1]}
            contentContainerStyle={{marginTop: 10, marginHorizontal: 15}}
            renderItem={() => (
              <SkeletonPlaceholder
                backgroundColor="#f4f4f4"
                highlightColor="#ffffff">
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        marginTop: 4,
                      }}
                    />
                    <View
                      style={{
                        width: '65%',
                        marginLeft: 12,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: 15,
                          borderRadius: 5,
                          marginVertical: 3,
                        }}
                      />
                      <View
                        style={{
                          width: '60%',
                          height: 15,
                          borderRadius: 5,
                          marginVertical: 3,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      width: '70%',
                      marginVertical: 30,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{width: 25, height: 25, borderRadius: 999}}
                      />
                      <View
                        style={{
                          height: 15,
                          flex: 1,
                          marginLeft: 12,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </SkeletonPlaceholder>
            )}
          />
        )}

        <Modal animationType="fade" visible={isWriteOpen}>
          <SafeAreaView className="w-full h-full bg-white">
            <View className="h-[48] pl-[5] pr-4 flex-row justify-between items-center">
              <Pressable
                onPress={() => {
                  setIsWriteOpen(false);
                  setContent('');
                }}>
                <CloseSvg width={32} height={32} />
              </Pressable>
              <Pressable
                onPress={curId == null ? handleWriteDaily : handleEditDaily}>
                <CustomText className="text-lg" fontWeight="500">
                  작성
                </CustomText>
              </Pressable>
            </View>
            <View className="items-center justify-center h-[50%] px-5">
              <View
                className="bg-white p-4 rounded-xl"
                style={{
                  shadowColor: '#2f2f2f',
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 10,
                }}>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  multiline
                  placeholder="한마디 남기기..."
                  placeholderTextColor="#9ca3af"
                  className="p-0 m-0"
                  style={{
                    fontFamily: 'NotoSansKR-Regular',
                    includeFontPadding: false,
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
        <AlertModal
          isModalOpen={isDeleteOpen}
          setIsModalOpen={setIsDeleteOpen}
          title="삭제하시겠어요?"
          content="삭제한 후에는 복구할 수 없습니다."
          button1Text="삭제"
          button1Color="#ff2626"
          button2Text="취소"
          button1Press={handleDeleteDaily}
        />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          enableDynamicSizing={false}
          footerComponent={props => (
            <DailyTextInput
              dailyId={curComment}
              isToady={date === formatBarDate(new Date())}
              {...props}
            />
          )}
          keyboardBlurBehavior="restore"
          keyboardBehavior="fillParent"
          android_keyboardInputMode="adjustResize">
          <BottomSheetFlashList
            showsVerticalScrollIndicator={false}
            estimatedItemSize={40}
            contentContainerStyle={{paddingBottom: 100, paddingHorizontal: 10}}
            viewabilityConfig={viewabilityConfig}
            ListEmptyComponent={<ListEmpty type="comment" />}
            data={commentData?.pages.flatMap(page => page.result.comments)}
            renderItem={({item}) => (
              <View className="flex-row my-[6]">
                <Avatar uri={item.writer.image} size={40} />
                <View className="ml-2 flex-1">
                  <CustomText className="text-[12px] pb-0 text-gray-700">
                    {item.writer.name}
                  </CustomText>
                  <CustomText className="text-[13px] pb-0">
                    {item.content}
                  </CustomText>
                </View>
              </View>
            )}
          />
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default DailyScreen;
