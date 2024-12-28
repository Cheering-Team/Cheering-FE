import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {useRef} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {formatBeforeDate} from 'utils/format';
import {Cheer as CheerType} from 'apis/cheer/types';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  useDeleteCheer,
  useDeleteLikeCheer,
  useLikeCheer,
} from 'apis/cheer/useCheers';
import CrownSvg from 'assets/images/crown.svg';
import {Community} from 'apis/community/types';
import HeartSvg from 'assets/images/heart-gray-bold.svg';
import HeartFillSvg from 'assets/images/heart-fill-pink.svg';

interface CheerProps {
  cheer: CheerType;
  matchId: number;
  community: Community;
}

const Cheer = ({cheer, matchId, community}: CheerProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {mutate: likeCheer} = useLikeCheer(matchId, community.id, cheer.id);
  const {mutate: deleteLikeCheer} = useDeleteLikeCheer(
    matchId,
    community.id,
    cheer.id,
  );
  const {mutateAsync: deleteCheer} = useDeleteCheer(matchId, community.id);

  const handleDeleteCheer = async () => {
    await deleteCheer({cheerId: cheer.id});
  };

  const handleLikeCheer = () => {
    likeCheer({
      communityId: community.id,
      cheerId: cheer.id,
    });
  };

  const handleDeleteLikeCheer = () => {
    deleteLikeCheer({
      communityId: community.id,
      cheerId: cheer.id,
    });
  };

  return (
    <>
      <Pressable
        onLongPress={() => bottomSheetModalRef.current?.present()}
        className="flex-row px-1 py-2 rounded-md my-[3] border"
        style={{
          backgroundColor: `${community.color}0b`,
          borderColor: `${community.color}10`,
        }}>
        <Avatar uri={cheer.writer.image} size={32} className="mt-[2]" />
        <View className="ml-2 flex-1">
          <View className="flex-row items-center mb-[3]">
            <CustomText fontWeight="500" className="mr-[6] text-xs">
              {cheer.writer.name}
            </CustomText>
            {cheer.writer.type === 'ADMIN' && (
              <CrownSvg width={20} height={20} className="ml-[2]" />
            )}
            <CustomText className="text-gray-500 text-xs" fontWeight="400">
              {formatBeforeDate(cheer.createdAt)}
            </CustomText>
          </View>

          <CustomText
            className="mb-1 text-[14px] text-gray-900"
            numberOfLines={999}>
            {cheer.content}
          </CustomText>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          className="items-center pl-[18] pr-[6] mt-1"
          onPress={cheer.isLike ? handleDeleteLikeCheer : handleLikeCheer}>
          {cheer.isLike ? (
            <HeartFillSvg width={15} height={15} />
          ) : (
            <HeartSvg width={15} height={15} />
          )}
          {cheer.likeCount !== 0 && (
            <CustomText
              className="text-[11px] text-gray-500 mt-1 text-center"
              style={{color: cheer.isLike ? '#fa4b4b' : '#6b7280'}}
              fontWeight="500">
              {cheer.likeCount}
            </CustomText>
          )}
        </TouchableOpacity>
      </Pressable>
      {cheer.isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="삭제"
          firstColor="#ff2626"
          firstSvg="trash"
          firstOnPress={handleDeleteCheer}
        />
      ) : (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="신고"
          firstColor="#ff2626"
          firstSvg="report"
          firstOnPress={() => {
            // setIsReportAlertOpen(true);
          }}
        />
      )}
    </>
  );
};

export default Cheer;
