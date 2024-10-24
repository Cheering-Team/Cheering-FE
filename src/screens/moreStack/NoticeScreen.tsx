import CustomText from 'components/common/CustomText';
import React, {useEffect} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import CloseSvg from '../../assets/images/close-black.svg';
import FastImage from 'react-native-fast-image';
import {useGetNoticeById} from 'apis/notice/useNotices';
import {formatDate} from 'utils/format';
import PlayerForm from 'components/notice/PlayerForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StackHeader from 'components/common/StackHeader';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const NoticeScreen = ({navigation, route}) => {
  const {noticeId} = route.params;

  const insets = useSafeAreaInsets();

  const {data: notice, isError, error} = useGetNoticeById(noticeId);

  useEffect(() => {
    if (isError && error.message === '존재하지 않는 공지사항') {
      navigation.goBack();
      showTopToast(insets.top + 20, '공지사항이 삭제됐어요');
    }
  }, [error?.message, insets.top, isError, navigation]);

  return (
    <SafeAreaView className="flex-1 pb-10">
      <StackHeader title="공지사항" type="close" />
      {notice && (
        <KeyboardAwareScrollView className="flex-1 p-3">
          <View className="border-b border-b-gray-100 mb-5">
            <CustomText fontWeight="600" className="text-xl mb-2">
              {`[NOTICE] ${notice.title}`}
            </CustomText>
            <CustomText className="text-sm text-gray-500 mb-3">
              {formatDate(notice.createdAt)}
            </CustomText>
          </View>

          <FastImage
            source={{
              uri: notice.image,
            }}
            className="w-full h-auto, aspect-[1.25]"
            resizeMode="contain"
          />
          <CustomText className="text-base">{notice.content}</CustomText>
          {notice.id === 1 && <PlayerForm />}
          <View className="w-full h-[100]" />
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};

export default NoticeScreen;
