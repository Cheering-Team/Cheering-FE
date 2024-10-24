import {Comment} from 'apis/comment/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {RefObject, useRef, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import OfficialSvg from 'assets/images/official.svg';
import MoreSvg from 'assets/images/three-dots.svg';
import AlertModal from 'components/common/AlertModal/AlertModal';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useDeleteComment, useReportComment} from 'apis/comment/useComments';
import {showTopToast} from 'utils/toast';
import {dailyKeys} from 'apis/post/queries';
import {queryClient} from '../../../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {commentKeys} from 'apis/comment/queries';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface DailyCommentProps {
  comment: Comment;
  postId: number | null;
  bottomSheetRef: RefObject<BottomSheetMethods>;
}

const DailyComment = ({comment, postId, bottomSheetRef}: DailyCommentProps) => {
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutate: deleteComment} = useDeleteComment(postId);
  const {mutateAsync: reportComment} = useReportComment(postId);

  const handleDeleteComment = () => {
    deleteComment({commentId: comment.id});
  };

  const handleReportComment = async () => {
    if (postId) {
      try {
        await reportComment({postId, commentId: comment.id});
      } catch (error: any) {
        if (error.message === '존재하지 않는 게시글') {
          showTopToast(insets.top + 20, '삭제된 글입니다');
          queryClient.invalidateQueries({queryKey: dailyKeys.lists()});
          bottomSheetRef.current?.close();
        }
        if (error.message === '존재하지 않는 댓글') {
          showTopToast(insets.top + 20, '삭제된 댓글입니다');
          queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
        }
      }
    }
  };
  return (
    <Pressable
      className="flex-row py-3 px-[10]"
      style={comment.status === 'temp' && {backgroundColor: '#e2e8f0'}}
      onLongPress={() => bottomSheetModalRef.current?.present()}>
      <Avatar uri={comment.writer.image} size={36} className="mt-[2]" />
      <View className="ml-2 flex-1">
        <View className="flex-row items-center">
          <CustomText fontWeight="500" className="text-[15px]">
            {comment.writer.name}
          </CustomText>
          {comment.writer.type === 'MANAGER' && (
            <OfficialSvg width={13} height={13} className="ml-[2]" />
          )}
        </View>
        <CustomText fontWeight="400" className="text-base text-gray-900">
          {comment.content}
        </CustomText>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => bottomSheetModalRef.current?.present()}>
        <MoreSvg width={17} height={17} />
      </TouchableOpacity>

      {comment.isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="삭제"
          firstColor="#ff2626"
          firstSvg="trash"
          firstOnPress={handleDeleteComment}
        />
      ) : (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="신고"
          firstColor="#ff2626"
          firstSvg="report"
          firstOnPress={() => {
            setIsReportAlertOpen(true);
          }}
        />
      )}
      <AlertModal
        isModalOpen={isReportAlertOpen}
        setIsModalOpen={setIsReportAlertOpen}
        title="댓글을 신고하시겠습니까?"
        content="해당 댓글은 숨겨집니다. 정상적인 댓글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
        button1Text="신고하기"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={handleReportComment}
      />
    </Pressable>
  );
};

export default DailyComment;
