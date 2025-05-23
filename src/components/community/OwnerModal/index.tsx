import {useNavigation} from '@react-navigation/native';
import {Community} from 'apis/community/types';
import {useJoinCommunity} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {showTopToast} from 'utils/toast';

interface OwnerModalProps {
  community: Community;
  setRefreshKey: Dispatch<SetStateAction<number>>;
}

const OwnerModal = (props: OwnerModalProps) => {
  const {community, setRefreshKey} = props;
  const navigation = useNavigation();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const {mutateAsync: joinCommunity} = useJoinCommunity();

  const handleJoinCommunity = async () => {
    await joinCommunity({
      communityId: community.id,
      name: community.koreanName,
      image: {
        uri: '',
        name: '',
        type: 'image',
      },
    });
    setIsModalOpen(false);
    setRefreshKey((prev: number) => prev + 1);
    showTopToast({message: '커뮤니티에 참여했어요'});
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isModalOpen}>
      <View className="w-full h-full bg-black/30 items-center justify-center">
        <View
          className="w-[80%] h-[65%] bg-white rounded-3xl items-center"
          style={{
            shadowColor: '#000000',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <View className="flex-1 px-4 pt-5">
            <CustomText className="text-lg text-gray-800" fontWeight="500">
              {`${community.koreanName}님! 다시 한번 환영합니다`}
            </CustomText>
            <CustomText className="text-lg text-gray-800" fontWeight="500">
              등등 선수들이 사용할 수 있는 기능들에 대한 간략한 설명
            </CustomText>
          </View>

          <View className="flex-row border-t border-[#e1e1e1]">
            <Pressable
              className="flex-1 items-center p-3"
              onPress={() => navigation.goBack()}>
              <CustomText className="text-red-500">취소</CustomText>
            </Pressable>
            <Pressable
              className="flex-1 items-center border-l border-[#e1e1e1] p-3"
              onPress={handleJoinCommunity}>
              <CustomText>다음</CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OwnerModal;
