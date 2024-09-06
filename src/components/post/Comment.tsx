import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Avatar from '../common/Avatar';
import MoreSvg from '../../../assets/images/three-dots.svg';
import CustomText from '../common/CustomText';
import {formatDate} from '../../utils/format';
import {useNavigation} from '@react-navigation/native';
import ReComment from './ReComment';
import {useGetRecomments} from '../../apis/comment/useComments';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface Props {
  comment: any;
  setUnder: any;
  setTo: any;
  inputRef: any;
}

const Comment = (props: Props) => {
  const {comment, setUnder, setTo, inputRef} = props;
  const navigation = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReCommentOpen, setIsReCommentOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {data} = useGetRecomments(comment.id, isReCommentOpen);

  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
      }}>
      <Pressable
        style={{height: 33}}
        onPress={() => {
          navigation.navigate('Profile', {playerUserId: comment.writer.id});
        }}>
        <Avatar uri={comment.writer.image} size={33} style={{marginTop: 3}} />
      </Pressable>

      <View style={{marginLeft: 10, flex: 1}}>
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
              navigation.navigate('Profile', {playerUserId: comment.writer.id});
            }}>
            <CustomText fontWeight="500" style={styles.writerName}>
              {comment.writer.nickname}
            </CustomText>
            <CustomText style={styles.createdAt}>
              {formatDate(comment.createdAt)}
            </CustomText>
          </Pressable>
          <Pressable
            style={{padding: 2}}
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}>
            <MoreSvg width={18} height={18} />
          </Pressable>
        </View>
        <CustomText style={{color: '#282828'}}>{comment.content}</CustomText>
        <Pressable
          onPress={() => {
            setUnder(comment.id);
            setTo({id: comment.writer.id, name: comment.writer.nickname});
            inputRef.current.focus();
          }}>
          <CustomText
            fontWeight="500"
            style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
            답글 달기
          </CustomText>
        </Pressable>
        {isReCommentOpen &&
          data &&
          data.result.reComments.map(reComment => (
            <ReComment
              key={reComment.id}
              commentId={comment.id}
              reComment={reComment}
              setUnder={setUnder}
              setTo={setTo}
              inputRef={inputRef}
            />
          ))}
        {comment.reCount !== 0 && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 13,
            }}
            onPress={() => {
              setIsReCommentOpen(prev => !prev);
            }}>
            <View
              style={{
                height: 0.5,
                width: 30,
                marginRight: 9,
                backgroundColor: '#bababa',
              }}
            />
            {isReCommentOpen ? (
              <CustomText
                fontWeight="500"
                style={{
                  fontSize: 12,
                  color: '#888888',
                }}>
                답글 숨기기
              </CustomText>
            ) : (
              <CustomText
                fontWeight="500"
                style={{
                  fontSize: 12,
                  color: '#888888',
                }}>{`답글 ${comment.reCount}개 더보기`}</CustomText>
            )}
          </Pressable>
        )}
      </View>
      {comment.isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="삭제"
          firstColor="#ff2626"
          firstSvg="trash"
          firstOnPress={() => {
            // handleDeleteComment();
          }}
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

const styles = StyleSheet.create({
  createdAt: {fontSize: 14, color: '#a5a5a5', marginLeft: 5},
  writerName: {fontSize: 14},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
});

export default Comment;
