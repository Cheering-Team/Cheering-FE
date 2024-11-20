import {useGetCommunityApplies} from 'apis/apply/useApplies';
import StackHeader from 'components/common/StackHeader';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommunityApply from './components/CommunityApply';
import CustomText from 'components/common/CustomText';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import RegisterModal from 'components/common/RegisterModal';

const CommunityApplyListScreen = () => {
  const [isRegisiterOpen, setIsRegisterOpen] = useState(false);

  const {data: applies, isLoading} = useGetCommunityApplies();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="커뮤니티 신청 내역" />
      <FlatList
        data={applies || []}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        renderItem={({item}) => <CommunityApply apply={item} />}
        ListHeaderComponent={
          isLoading ? null : (
            <View className="flex-row justify-between pl-3 pr-4 pt-2 pb-2 items-center border-b border-gray-100">
              <CustomText
                className="text-lg text-slate-700"
                fontWeight="600">{`신청 내역 ${applies?.length}건`}</CustomText>

              <Pressable
                className="bg-black p-1 px-2 rounded-lg"
                onPress={() => setIsRegisterOpen(true)}>
                <CustomText className="text-white text-base" fontWeight="500">
                  신청하기
                </CustomText>
              </Pressable>
            </View>
          )
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="h-[500] justify-center items-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ListEmpty type="apply" />
          )
        }
      />
      {isRegisiterOpen && (
        <RegisterModal setIsRegisterOpen={setIsRegisterOpen} />
      )}
    </SafeAreaView>
  );
};

export default CommunityApplyListScreen;
