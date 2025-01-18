import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import CrownSvg from 'assets/images/crown-flat.svg';
import MoreSvg from 'assets/images/three-dots-black.svg';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {MeetMember} from 'apis/meet/types';
import {Community} from 'apis/community/types';
import OptionModal from 'components/common/OptionModal';
import TwoButtonModal from 'components/common/TwoButtonModal';
import {useReportMember} from 'apis/meet/useMeets';
import {showTopToast} from 'utils/toast';

interface MeetMemberCardProps {
  member: MeetMember;
  community: Community;
  meetId: number;
}

const MeetMemberCard = ({member, community, meetId}: MeetMemberCardProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);

  const {mutateAsync: reportMember} = useReportMember();

  const handleReportMember = async (text: string) => {
    if (text.trim().length === 0) {
      showTopToast({type: 'fail', message: '신고 사유를 입력해주세요'});
      return;
    }
    try {
      await reportMember({
        meetId,
        reportedFanId: member.fanId,
        reason: text,
      });
      setIsReportOpen(false);
      showTopToast({type: 'success', message: '신고가 완료되었습니다'});
    } catch (error: any) {
      //
    }
  };

  return (
    <View className="flex-row items-center py-[10]">
      <Avatar size={42} uri={member.image} />

      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <CustomText fontWeight="500" className="text-[15px] mb-[2]">
            {member.name}
          </CustomText>
          {member.isManager && (
            <CrownSvg width={15} height={15} className="ml-[3] mb-[2]" />
          )}
        </View>

        <View className="flex-row items-center">
          <CustomText className="text-gray-500">
            {new Date().getFullYear() - member.userAge + 1}
          </CustomText>
          <View className="w-[2] h-[2] bg-gray-400 mx-[5] rounded-full" />
          <CustomText className="text-gray-500">
            {member.userGender === 'MALE' ? '남자' : '여자'}
          </CustomText>
        </View>
      </View>
      {community.curFan?.id !== member.fanId && (
        <Pressable
          className="px-[15] py-2"
          onPress={() => {
            bottomSheetModalRef.current?.present();
          }}>
          <MoreSvg width={16} height={16} />
        </Pressable>
      )}
      <OptionModal
        modalRef={bottomSheetModalRef}
        firstText="신고하기"
        firstSvg="report"
        firstColor="#ff2626"
        firstOnPress={() => {
          setIsReportOpen(true);
        }}
      />
      {isReportOpen && (
        <TwoButtonModal
          title="모임 멤버 신고하기"
          content="해당 멤버를 신고하는 이유에 대해서 설명해주세요."
          firstCallback={() => {
            setIsReportOpen(false);
          }}
          secondText="신고하기"
          textInputSecondCallback={text => {
            handleReportMember(text);
          }}
          secondButtonColor="#e65151"
          textInputLabel="신고 사유"
          textInputPlaceholder="ex. 해당 멤버가 모임에 나오지 않았어요"
        />
      )}
    </View>
  );
};

export default MeetMemberCard;
