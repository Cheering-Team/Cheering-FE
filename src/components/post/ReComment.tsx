import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {formatDate} from '../../utils/format';
import MoreSvg from '../../../assets/images/three-dots.svg';
import {useNavigation} from '@react-navigation/native';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface Props {
  commentId: number;
  reComment: any;
  setUnder: any;
  setTo: any;
  inputRef: any;
}

const ReComment = (props: Props) => {
  const {commentId, reComment, setUnder, setTo, inputRef} = props;
  const navigation = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  return (
    <View
      style={{
        paddingTop: 10,
        flexDirection: 'row',
      }}>
      <Pressable
        style={{height: 33}}
        onPress={() => {
          navigation.navigate('Profile', {
            playerUserId: reComment.writer.id,
          });
        }}>
        <Avatar uri={reComment.writer.image} size={33} />
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
              navigation.navigate('Profile', {
                playerUserId: reComment.writer.id,
              });
            }}>
            <CustomText fontWeight="500" style={styles.writerName}>
              {reComment.writer.nickname}
            </CustomText>
            <CustomText style={styles.createdAt}>
              {formatDate(reComment.createdAt)}
            </CustomText>
          </Pressable>
          <Pressable
            style={{padding: 2}}
            onPress={() => bottomSheetModalRef.current?.present()}>
            <MoreSvg width={18} height={18} />
          </Pressable>
        </View>
        <CustomText style={{color: '#282828'}}>{reComment.content}</CustomText>
        <Pressable
          onPress={() => {
            setUnder(commentId);
            setTo({id: reComment.writer.id, name: reComment.writer.nickname});
            inputRef.current.focus();
          }}>
          <CustomText
            fontWeight="500"
            style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
            답글 달기
          </CustomText>
        </Pressable>
      </View>
      {reComment.isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="삭제"
          firstColor="#ff2626"
          firstSvg="trash"
          firstOnPress={() => {
            // handleDeleteReComment();
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
        title="답글을 신고하시겠습니까?"
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

export default ReComment;
