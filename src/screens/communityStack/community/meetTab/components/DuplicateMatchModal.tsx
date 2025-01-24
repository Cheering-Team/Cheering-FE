import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import MatchInfo from 'components/common/MatchInfo';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {Dispatch, SetStateAction} from 'react';
import {Modal, Pressable, View} from 'react-native';

interface DuplicateMatchModalProps {
  match: MatchDetail | null;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  community: Community;
}

const DuplicateMatchModal = ({
  match,
  setIsModalOpen,
  community,
}: DuplicateMatchModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <Modal transparent>
      <View className="w-full h-full bg-black/50 justify-center items-center">
        <View className="bg-white w-[85%] rounded-2xl shadow-md px-6 pt-6 pb-4">
          <CustomText
            fontWeight="600"
            className="text-[18px] mb-3"
            numberOfLines={999}>
            {`이미 해당 경기에\n예정된 모임이 있습니다`}
          </CustomText>
          <CustomText
            className="text-gray-600 leading-5 text-[15px] mb-4"
            numberOfLines={999}>
            한 경기에 대해서는 하나의 모임에만 참여 가능합니다. 기존의 모임을
            취소한 후 다시 시도해 주세요.
          </CustomText>
          {match && <MatchInfo match={match} height={60} />}
          <View className="flex-row mt-6">
            <Pressable className="flex-grow-[2] justify-center items-center py-3 rounded-xl mr-2 bg-[#1e293b]">
              <CustomText
                fontWeight="500"
                className="text-white"
                onPress={() => {
                  setIsModalOpen(false);
                  navigation.navigate('MyMeet', {community});
                }}>
                내 모임 확인
              </CustomText>
            </Pressable>
            <Pressable
              className="flex-grow-[1] justify-center items-center ml-2"
              onPress={() => {
                setIsModalOpen(false);
              }}>
              <CustomText fontWeight="500" className="text-gray-700">
                닫기
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DuplicateMatchModal;
