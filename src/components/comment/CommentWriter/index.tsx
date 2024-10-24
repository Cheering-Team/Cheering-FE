import {useNavigation} from '@react-navigation/native';
import React, {RefObject, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {formatBeforeDate} from '../../../utils/format';
import MoreSvg from '../../../assets/images/three-dots.svg';
import OptionModal from '../../common/OptionModal';
import AlertModal from '../../common/AlertModal/AlertModal';
import {
  useDeleteComment,
  useDeleteReComment,
  useReportComment,
  useReportReComment,
} from '../../../apis/comment/useComments';
import {Comment, ReComment} from '../../../apis/comment/types';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import OfficialSvg from 'assets/images/official.svg';
import {queryClient} from '../../../../App';
import {postKeys} from 'apis/post/queries';
import {commentKeys, reCommentKeys} from 'apis/comment/queries';

interface CommentWriterProps {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
  comment: Comment | ReComment;
  type: 'comment' | 'reComment';
  postId: number;
  under: number;
}

const CommentWriter = ({
  bottomSheetModalRef,
  comment,
  type,
  postId,
  under,
}: CommentWriterProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutate: deleteComment} = useDeleteComment(postId);
  const {mutate: deleteReComment} = useDeleteReComment(comment.id);
  const {mutateAsync: reportComment} = useReportComment(postId);
  const {mutateAsync: reportReComment} = useReportReComment(under);

  const handleDeleteComment = () => {
    deleteComment({commentId: comment.id});
  };

  const handleDeleteReComment = () => {
    deleteReComment({reCommentId: comment.id});
    showTopToast(insets.top + 20, '삭제 완료');
  };

  const handleReportComment = async () => {
    try {
      await reportComment({postId, commentId: comment.id});
    } catch (error: any) {
      if (error.message === '존재하지 않는 게시글') {
        showTopToast(insets.top + 20, '삭제된 글입니다');
        navigation.goBack();
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
      }
      if (error.message === '존재하지 않는 댓글') {
        showTopToast(insets.top + 20, '삭제된 댓글입니다');
        queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      }
    }
  };
  const handleReportReComment = async () => {
    try {
      await reportReComment({postId, reCommentId: comment.id});
    } catch (error: any) {
      if (error.message === '존재하지 않는 게시글') {
        showTopToast(insets.top + 20, '삭제된 글입니다');
        navigation.goBack();
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
      }
      if (error.message === '존재하지 않는 댓글') {
        showTopToast(insets.top + 20, '삭제된 댓글입니다');
        queryClient.invalidateQueries({
          queryKey: reCommentKeys.list(comment.id),
        });
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('Profile', {
            fanId: comment.writer.id,
          });
        }}>
        <CustomText fontWeight="500" className="text-base">
          {comment.writer.name}
        </CustomText>
        {comment.writer.type === 'MANAGER' && (
          <OfficialSvg width={13} height={13} className="ml-[2]" />
        )}
        <CustomText style={{color: '#a5a5a5', marginLeft: 5}}>
          {formatBeforeDate(comment.createdAt)}
        </CustomText>
      </Pressable>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{padding: 2}}
        onPress={() => bottomSheetModalRef.current?.present()}>
        <MoreSvg width={18} height={18} />
      </TouchableOpacity>
      {comment.isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="삭제"
          firstColor="#ff2626"
          firstSvg="trash"
          firstOnPress={
            type === 'comment' ? handleDeleteComment : handleDeleteReComment
          }
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
        button1Press={
          type === 'comment' ? handleReportComment : handleReportReComment
        }
      />
    </View>
  );
};

export default CommentWriter;
