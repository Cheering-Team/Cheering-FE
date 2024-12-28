import {useGetBlockedUsers, useUnblockUser} from 'apis/fan/useFans';
import AlertModal from 'components/common/AlertModal/AlertModal';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import StackHeader from 'components/common/StackHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import React, {useState} from 'react';
import {FlatList, Pressable, SafeAreaView, View} from 'react-native';

const BlockListScreen = ({route}) => {
  useDarkStatusBar();
  const {playerUserId} = route.params;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {data: blockedUsers} = useGetBlockedUsers(playerUserId);
  const {mutate: unblockUser} = useUnblockUser(playerUserId);

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="차단한 계정" />
      {blockedUsers && (
        <FlatList
          data={blockedUsers}
          renderItem={({item}) => (
            <View className="flex-row py-[10] px-4 items-center">
              <Avatar uri={item.image} size={43} />
              <CustomText className="flex-1 text-[15px] ml-2" fontWeight="500">
                {item.name}
              </CustomText>
              <Pressable
                className="bg-black py-[6] px-[10] rounded-lg"
                onPress={() => {
                  setIsModalOpen(true);
                  setSelectedId(item.id);
                }}>
                <CustomText className="text-white">차단 해제</CustomText>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<ListEmpty type="block" />}
        />
      )}
      <AlertModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="차단을 해제하시겠습니까?"
        content="이젠 상대방의 활동들을 볼 수 있습니다."
        button1Text="차단 해제"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={() => {
          if (selectedId) {
            unblockUser({fanId: selectedId});
          }
        }}
      />
    </SafeAreaView>
  );
};

export default BlockListScreen;
