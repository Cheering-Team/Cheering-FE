import {Apply} from 'apis/apply/types';
import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {LayoutAnimation, View} from 'react-native';
import {Pressable} from 'react-native';
import {formatDate} from 'utils/format';
import ChevronDownGraySvg from 'assets/images/chevron-down-gray.svg';
import ChevronUpGraySvg from 'assets/images/chevron-up-gray.svg';
import {useDeleteApply} from 'apis/apply/useApplies';
import AlertModal from 'components/common/AlertModal/AlertModal';
import {showTopToast} from 'utils/toast';

interface CommunityApplyProps {
  apply: Apply;
}

const CommunityApply = ({apply}: CommunityApplyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const {mutateAsync: deleteApply} = useDeleteApply();

  const handleDeleteApply = async () => {
    try {
      await deleteApply({applyId: apply.id});
    } catch (error: any) {
      if (error.code === 2008) {
        showTopToast({message: '이미 처리된 신청입니다'});
      }
    }
  };

  return (
    <View className="pl-3 pr-2 py-4 bg-white">
      <Pressable
        style={{opacity: apply.status === 'PENDING' ? 1 : 0.5}}
        className="flex-row items-start"
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsOpen(prev => !prev);
        }}>
        <View className="flex-1">
          <CustomText className="text-base text-gray-500" fontWeight="500">
            {formatDate(apply.createdAt)}
          </CustomText>
          <CustomText
            className="text-lg text-slate-800"
            numberOfLines={isOpen ? 999 : 1}>
            {apply.content}
          </CustomText>
        </View>
        <View className="flex-row items-center ml-2">
          {apply.status === 'PENDING' && (
            <View className="bg-gray-500 py-1 px-2 rounded-md">
              <CustomText className="text-white text-[15px]" fontWeight="500">
                대기중
              </CustomText>
            </View>
          )}
          {apply.status === 'APPROVED' && (
            <View className="bg-green-700 py-1 px-2 rounded-md">
              <CustomText className="text-white text-[15px]" fontWeight="500">
                등록 완료
              </CustomText>
            </View>
          )}
          {apply.status === 'REJECTED' && (
            <View className="bg-rose-600 py-1 px-2 rounded-md">
              <CustomText className="text-white text-[15px]" fontWeight="500">
                등록 거절
              </CustomText>
            </View>
          )}
          <View className="p-2">
            {isOpen ? (
              <ChevronUpGraySvg width={18} height={18} />
            ) : (
              <ChevronDownGraySvg width={18} height={18} />
            )}
          </View>
        </View>
      </Pressable>
      {isOpen && (
        <View className="mt-3">
          <View className="bg-gray-200 p-2 rounded-md mr-1">
            {apply.status === 'PENDING' && (
              <CustomText className="text-gray-600">
                승인 대기중입니다
              </CustomText>
            )}
            {apply.status === 'APPROVED' && (
              <CustomText className="text-gray-600">
                등록 완료되었습니다
              </CustomText>
            )}
            {apply.status === 'REJECTED' && (
              <CustomText numberOfLines={999} className="text-gray-600">
                {apply.comment}
              </CustomText>
            )}
          </View>
          {apply.status === 'PENDING' && (
            <View className="items-end">
              <Pressable
                onPress={() => setIsDeleteAlertOpen(true)}
                className="py-2 px-2 bg-rose-500 rounded-lg mt-3 mr-1">
                <CustomText className="text-white text-[15px]">삭제</CustomText>
              </Pressable>
            </View>
          )}
        </View>
      )}
      <AlertModal
        isModalOpen={isDeleteAlertOpen}
        setIsModalOpen={setIsDeleteAlertOpen}
        title="신청을 삭제하시겠습니까?"
        button1Text="삭제하기"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={handleDeleteApply}
      />
    </View>
  );
};

export default CommunityApply;
