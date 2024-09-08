import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {formatDate} from '../../../utils/format';
import MoreSvg from '../../../../assets/images/three-dots.svg';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import OptionModal from '../../common/OptionModal';
import AlertModal from '../../common/AlertModal/AlertModal';
import {
  useDeleteComment,
  useDeleteReComment,
} from '../../../apis/comment/useComments';
import {Comment, ReComment} from '../../../apis/comment/types';

interface CommentWriterProps {
  comment: Comment | ReComment;
  type: 'comment' | 'reComment';
}

const CommentWriter = (props: CommentWriterProps) => {
  const {comment, type} = props;
  const navigation = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutate: deleteComment} = useDeleteComment();
  const {mutate: deleteReComment} = useDeleteReComment();

  const handleDeleteComment = () => {
    deleteComment({commentId: comment.id});
  };

  const handleDeleteReComment = () => {
    deleteReComment({reCommentId: comment.id});
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Pressable
        style={{flexDirection: 'row'}}
        onPress={() => {
          navigation.navigate('Profile', {
            playerUserId: writer.id,
          });
        }}>
        <CustomText fontWeight="500">{comment.writer.nickname}</CustomText>
        <CustomText style={{color: '#a5a5a5', marginLeft: 5}}>
          {formatDate(comment.createdAt)}
        </CustomText>
      </Pressable>
      <Pressable
        style={{padding: 2}}
        onPress={() => bottomSheetModalRef.current?.present()}>
        <MoreSvg width={18} height={18} />
      </Pressable>
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
        content="정상적인 글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
        button1Text="신고하기"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={() => {
          // handleReportPost();
        }}
      />
    </View>
  );
};

export default CommentWriter;
