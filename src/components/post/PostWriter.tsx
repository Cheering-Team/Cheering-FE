import React, {RefObject, useState} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {formatBeforeDate} from '../../utils/format';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../assets/images/three-dots.svg';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {useDeletePost, useReportPost} from '../../apis/post/usePosts';
import {showBottomToast, showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import OfficialSvg from 'assets/images/official.svg';
import {Post} from 'apis/post/types';

interface PostWriterProps {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
  feed: Post;
  isWriter: boolean;
  type: 'post' | 'feed';
  location?: 'community' | 'home';
}

const PostWriter = ({
  bottomSheetModalRef,
  feed,
  isWriter,
  type,
  location = 'community',
}: PostWriterProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutateAsync: deletePost} = useDeletePost();
  const {mutateAsync: reportPost} = useReportPost();

  const handleDeletePost = async () => {
    type === 'feed'
      ? showTopToast(insets.top + 20, '삭제중..', false)
      : navigation.goBack();
    await deletePost({postId: feed.id});
  };

  const handleReportPost = async () => {
    const data = await reportPost({postId: feed.id});

    if (data.message === '존재하지 않는 게시글입니다.' && type === 'post') {
      navigation.goBack();
    }
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
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            location === 'community'
              ? navigation.navigate('Profile', {playerUserId: feed.writer.id})
              : navigation.navigate('CommunityStack', {
                  screen: 'Profile',
                  params: {playerUserId: feed.writer.id},
                });
          }}>
          <CustomText fontWeight="500" className="text-base">
            {feed.writer.name}
          </CustomText>
          {feed.writer.type === 'MANAGER' && (
            <OfficialSvg width={14} height={14} className="ml-[2]" />
          )}
          <CustomText style={styles.createdAt}>
            {formatBeforeDate(new Date(feed.createdAt))}
          </CustomText>
        </Pressable>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{padding: 2}}
          onPress={() => bottomSheetModalRef.current?.present()}>
          <MoreSvg width={18} height={18} />
        </TouchableOpacity>
      </View>
      {isWriter ? (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="수정"
          firstSvg="edit"
          firstOnPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'PostWrite',
              params: {communityId: feed.community.id, post: feed},
            });
          }}
          secondText="삭제"
          secondColor="#ff2626"
          secondSvg="trash"
          secondOnPress={() => {
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
        content="해당 글은 숨겨집니다. 정상적인 글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
        button1Text="신고하기"
        button1Color="#ff2626"
        button2Text="취소"
        button1Press={() => {
          handleReportPost();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  createdAt: {fontSize: 14, color: '#a5a5a5', marginLeft: 5},
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
});

export default PostWriter;
