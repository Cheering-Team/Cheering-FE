import CustomText from 'components/common/CustomText';
import React from 'react';
import {FlatList, Pressable, SafeAreaView, View} from 'react-native';
import {formatBeforeDate} from 'utils/format';
import ChevronRightSvg from '../../assets/images/chevron-right-gray.svg';
import StackHeader from 'components/common/StackHeader';
import {useGetNotices} from 'apis/notice/useNotices';

const NoticeListScreen = ({navigation}) => {
  const {data: noticies} = useGetNotices();

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="공지사항" type="back" />
      {noticies && (
        <FlatList
          data={noticies}
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
