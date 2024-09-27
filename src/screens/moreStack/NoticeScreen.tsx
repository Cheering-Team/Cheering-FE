import CustomText from 'components/common/CustomText';
import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import CloseSvg from '../../../assets/images/close-black.svg';
import FastImage from 'react-native-fast-image';
import {useGetNoticeById} from 'apis/notice/useNotices';
import {formatDate} from 'utils/format';
import PlayerForm from 'components/notice/PlayerForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const NoticeScreen = ({navigation, route}) => {
  const {noticeId} = route.params;

  const {data} = useGetNoticeById(noticeId);

  return (
    <SafeAreaView className="flex-1 pb-10">
      <View className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]">
        <Pressable onPress={() => navigation.goBack()}>
          <CloseSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="500" className="text-lg">
          공지사항
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      {data && (
        <KeyboardAwareScrollView className="flex-1 p-3">
          <View className="border-b border-b-gray-100 mb-5">
            <CustomText fontWeight="600" className="text-xl mb-2">
              {`[NOTICE] ${data.result.title}`}
            </CustomText>
            <CustomText className="text-sm text-gray-500 mb-3">
              {formatDate(data.result.createdAt)}
            </CustomText>
          </View>

          <FastImage
            source={{
              uri: data.result.image,
            }}
            className="w-full h-auto, aspect-[1.25]"
            resizeMode="contain"
          />
          <CustomText className="text-base">{data.result.content}</CustomText>
          {data.result.id === 1 && <PlayerForm />}
          <View className="w-full h-[100]" />
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};

export default NoticeScreen;
