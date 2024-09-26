import CustomText from 'components/common/CustomText';
import React from 'react';
import {FlatList, Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/chevron-left.svg';
import {useGetNotices} from 'apis/notice/useNotices';
import {formatBeforeDate} from 'utils/format';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';

const NoticeListScreen = ({navigation}) => {
  const {data} = useGetNotices();

  return (
    <SafeAreaView className="flex-1">
      <View className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="500" className="text-lg pb-0">
          공지사항
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      {data && (
        <FlatList
          data={data.result}
          renderItem={({item}) => (
            <Pressable
              className="flex-row px-4 py-3 border-b border-b-gray-100 justify-between items-center"
              onPress={() =>
                navigation.navigate('Notice', {noticeId: item.id})
              }>
              <View>
                <CustomText className="text-lg mb-2">{`[공지사항] ${item.title}`}</CustomText>
                <CustomText className="text-xs text-gray-500">
                  {formatBeforeDate(item.createdAt)}
                </CustomText>
              </View>
              <ChevronRightSvg />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NoticeListScreen;
