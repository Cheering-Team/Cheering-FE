import React, {RefObject, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../../common/CustomText';
import {NAME_REGEX} from '../../../../constants/regex';
import CustomBottomSheetTextInput from '../../../common/CustomBottomSheetTextInput';
import {showTopToast} from 'utils/toast';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import LoadingOverlay from 'components/common/LoadingOverlay';
import {Community} from 'apis/community/types';
import {useJoinCommunity} from 'apis/community/useCommunities';

interface Props {
  community: Community;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
}

const JoinProfile = (props: Props) => {
  const {community, bottomSheetModalRef} = props;

  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');

  const {mutateAsync: joinCommunity, isPending} = useJoinCommunity();

  const handleJoinCommunity = async () => {
    if (!NAME_REGEX.test(nickname)) {
      setIsValid(false);
      setNicknameInvalidMessage(
        '2자~10자, 한글 영어 숫자 . _ 만 사용 가능합니다.',
      );
      return;
    }
    try {
      await joinCommunity({
        communityId: community.id,
        name: nickname,
      });
      showTopToast({message: '가입 완료'});
    } catch (error: any) {
      if (error.code === 2004) {
        setIsValid(false);
        setNicknameInvalidMessage('부적절한 닉네임입니다.');
      }
      if (error.code === 2007) {
        setIsValid(false);
        setNicknameInvalidMessage('이미 사용중인 이름입니다.');
      }
    }
  };

  useEffect(() => {
    if (community.curFan) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [bottomSheetModalRef, community.curFan]);

  return (
    <View className="flex-1 w-[90%] mt-1 justify-between">
      <LoadingOverlay isLoading={isPending} type="OVERLAY" />

      <View className="w-full">
        <CustomText fontWeight="800" className="text-[22px] mt-2 mb-1 ml-[2]">
          지금 바로 팬들과 함께
        </CustomText>
        <CustomText
          fontWeight="500"
          className="text-base text-gray-500 mb-3 ml-[2]">
          정보를 공유하고 경기를 응원해보세요
        </CustomText>
        <CustomBottomSheetTextInput
          label="닉네임"
          value={nickname}
          isValid={isValid}
          inValidMessage={nicknameInvalidMessage}
          maxLength={10}
          length
          curLength={nickname.length}
          onChangeText={e => {
            setNickname(e);
            setIsValid(true);
          }}
        />
      </View>
      <View className="flex-row">
        <Pressable
          className="flex-1 justify-center items-center border py-[12] mr-1 rounded-lg"
          onPress={() => bottomSheetModalRef.current?.close()}>
          <CustomText fontWeight="600" className="text-base">
            뒤로가기
          </CustomText>
        </Pressable>
        <Pressable
          className="flex-1 justify-center items-center border border-black bg-black py-[12] ml-1 rounded-lg"
          onPress={handleJoinCommunity}>
          <CustomText fontWeight="600" className="text-white text-base">
            시작하기
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default JoinProfile;
