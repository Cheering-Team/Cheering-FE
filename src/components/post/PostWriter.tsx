import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {formatDate} from '../../utils/format';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../../assets/images/three-dots.svg';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {deletePost} from '../../apis/post';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useReportPost} from '../../apis/post/usePosts';

interface PostWriterProps {
  feed: any;
  isWriter: boolean;
}

const PostWriter = (props: PostWriterProps) => {
  const {feed, isWriter} = props;

  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);
  const [isInhibitAlertOpen, setIsInhibitAlertOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
      queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
    },
  });

  const {mutate: reportPost} = useReportPost();

  const handleDeletePost = async () => {
    Toast.show({
      type: 'default',
      position: 'bottom',
      visibilityTime: 2000,
      bottomOffset: insets.bottom + 20,
      text1: '삭제중입니다...',
    });

    await mutation.mutateAsync({postId: feed.id});
  };

  const handleReportPost = () => {
    reportPost({postId: feed.id});
  };

  return (
    <>
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
            navigation.navigate('Profile', {playerUserId: feed.writer.id});
          }}>
          <CustomText fontWeight="500" style={styles.writerName}>
            {feed.writer.nickname}
          </CustomText>
          <CustomText style={styles.createdAt}>
            {formatDate(feed.createdAt)}
          </CustomText>
        </Pressable>
        <Pressable
          style={{padding: 2}}
          onPress={() => bottomSheetModalRef.current?.present()}>
          <MoreSvg width={18} height={18} />
        </Pressable>
      </View>
      {isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="수정"
          firstSvg="edit"
          firstOnPress={() => {
            if (feed.isHide) {
              setIsInhibitAlertOpen(true);
              return;
            }
            navigation.navigate('CommunityStack', {
              screen: 'PostWrite',
              params: {playerId: feed.player.id, feed},
            });
          }}
          secondText="삭제"
          secondColor="#ff2626"
          secondSvg="trash"
          secondOnPress={() => {
            if (feed.isHide) {
              setIsInhibitAlertOpen(true);
              return;
            }
            setIsDeleteAlertOpen(true);
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
        isModalOpen={isDeleteAlertOpen}
        setIsModalOpen={setIsDeleteAlertOpen}
        title="게시글을 삭제하시겠어요?"
        content="게시글을 삭제한 후에는 복구할 수 없습니다."
        button1Text="삭제"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={() => {
          handleDeletePost();
        }}
      />
      <AlertModal
        isModalOpen={isReportAlertOpen}
        setIsModalOpen={setIsReportAlertOpen}
        title="게시글을 신고하시겠습니까?"
        content="정상적인 글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
        button1Text="신고하기"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={() => {
          handleReportPost();
        }}
      />
      <AlertModal
        isModalOpen={isInhibitAlertOpen}
        setIsModalOpen={setIsInhibitAlertOpen}
        title="신고 누적된 게시글입니다."
        content="게시글을 수정하거나 삭제할 수 없습니다."
        button1Text="확인"
      />
    </>
  );
};

const styles = StyleSheet.create({
  createdAt: {fontSize: 14, color: '#a5a5a5', marginLeft: 5},
  writerName: {fontSize: 14},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
});

export default PostWriter;
