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
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CrownSvg from 'assets/images/crown.svg';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutate: deleteComment} = useDeleteComment(postId);
  const {mutate: deleteReComment} = useDeleteReComment(comment.id);
  const {mutate: reportComment} = useReportComment(postId);
  const {mutate: reportReComment} = useReportReComment(under);

  const handleDeleteComment = () => {
    deleteComment({commentId: comment.id});
  };

  const handleDeleteReComment = () => {
    deleteReComment({reCommentId: comment.id});
    showTopToast({message: '삭제 완료'});
  };

  const handleReportComment = () => {
    reportComment({postId, commentId: comment.id});
  };
  const handleReportReComment = () => {
    reportReComment({postId, reCommentId: comment.id});
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
          if (comment.writer.type !== 'ADMIN')
            navigation.navigate('Profile', {
              fanId: comment.writer.id,
            });
        }}>
        <CustomText fontWeight="600" className="text-sm text-gray-800">
          {comment.writer.name}
        </CustomText>
        {comment.writer.type === 'ADMIN' && (
          <CrownSvg width={20} height={20} className="ml-[2]" />
        )}
        <CustomText style={{color: '#737373', marginLeft: 5}}>
          {formatBeforeDate(comment.createdAt)}
        </CustomText>
      </Pressable>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{padding: 2}}
        onPress={() => {
          if (comment.writer.type !== 'ADMIN')
            bottomSheetModalRef.current?.present();
        }}>
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
