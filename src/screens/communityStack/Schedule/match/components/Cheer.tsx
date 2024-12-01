import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {formatBeforeDate} from 'utils/format';
import MoreSvg from 'assets/images/three-dots-black.svg';
import {Cheer as CheerType} from 'apis/cheer/types';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useDeleteCheer} from 'apis/cheer/useCheers';

interface CheerProps {
  cheer: CheerType;
  matchId: number;
  communityId: number;
}

const Cheer = ({cheer, matchId, communityId}: CheerProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {mutateAsync: deleteCheer} = useDeleteCheer(matchId, communityId);

  const handleDeleteCheer = async () => {
    await deleteCheer({cheerId: cheer.id});
  };

  return (
    <>
      <View
        className="flex-row px-3 py-2 bg-white rounded-lg mb-2 border border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 1, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}>
        <Avatar uri={cheer.writer.image} size={30} className="mt-1" />
        <View className="ml-2 flex-1">
          <View className="flex-row items-center">
            <CustomText fontWeight="500" className="mb-1 mr-1 text-base">
              {cheer.writer.name}
            </CustomText>
            <CustomText className="text-gray-600 text-[13px]">
              {formatBeforeDate(cheer.createdAt)}
            </CustomText>
          </View>

          <CustomText
            className="mb-1 text-base text-gray-900"
            numberOfLines={999}>
            {cheer.content}
          </CustomText>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => bottomSheetModalRef.current?.present()}>
          <MoreSvg width={15} height={15} className="mt-[2]" />
        </TouchableOpacity>
      </View>
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
