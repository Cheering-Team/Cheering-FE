import {
  useDeleteDaily,
  useEditDaily,
  useGetDailys,
  useWriteDaily,
} from 'apis/post/usePosts';
import Avatar from 'components/common/Avatar';
import StackHeader from 'components/common/StackHeader';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
  ViewabilityConfig,
} from 'react-native';
import CustomText from 'components/common/CustomText';
import CloseSvg from '../../../assets/images/close-black.svg';
import {showBottomToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';

import AlertModal from 'components/common/AlertModal/AlertModal';
import DailyTextInput from 'components/community/DailyTextInput';
import {useGetComments} from 'apis/comment/useComments';
import {WINDOW_HEIGHT} from 'constants/dimension';
import Daily from 'components/post/Daily';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

const DailyScreen = ({route}) => {
  const {playerId} = route.params;
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['70%', WINDOW_HEIGHT - insets.top];
  const viewabilityConfig = useRef<ViewabilityConfig>({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
  }).current;
  const renderBackdrop = useCallback(
    props => (
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

  const {data: dailyData} = useGetDailys(playerId, '2024-10-16');
  const {data: commentData} = useGetComments(curComment);
  const {mutateAsync: writeDaily} = useWriteDaily();
  const {mutateAsync: editDaily} = useEditDaily();
  const {mutateAsync: deleteDaily} = useDeleteDaily();

  const handleWriteDaily = async () => {
    const data = await writeDaily({playerId, content});
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

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <StackHeader title="5월 15일" />
        <FlatList
          data={dailyData?.result.dailys}
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}
          renderItem={({item}) => (
            <Daily
              dailyData={dailyData?.result}
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
            dailyData?.result.isOwner ? (
              <View className="flex-row items-center my-2">
                <Avatar uri={dailyData.result.owner.image} size={40} />
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
            <DailyTextInput dailyId={curComment} {...props} />
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
                    {item.writer.nickname}
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
