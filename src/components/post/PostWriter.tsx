import React, {RefObject, useState} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {formatBeforeDate} from '../../utils/format';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../assets/images/three-dots.svg';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {useDeletePost, useReportPost} from '../../apis/post/usePosts';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Post} from 'apis/post/types';
import {queryClient} from '../../../App';
import {postKeys} from 'apis/post/queries';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import CrownSvg from 'assets/images/crown.svg';

interface PostWriterProps {
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
  post: Post;
  isWriter: boolean;
  type: 'post' | 'feed';
}

const PostWriter = ({
  bottomSheetModalRef,
  post,
  isWriter,
  type,
}: PostWriterProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const {mutate: deletePost} = useDeletePost(post.id, type);
  const {mutateAsync: reportPost} = useReportPost(type);

  const handleDeletePost = () => {
    deletePost({postId: post.id});
  };

  const handleReportPost = async () => {
    try {
      await reportPost({postId: post.id});
    } catch (error: any) {
      if (error.message === '존재하지 않는 게시글') {
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
        if (type === 'post') {
          navigation.goBack();
        }
      }
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View className="flex-row items-center flex-1">
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              if (post.writer.type !== 'ADMIN')
                navigation.navigate('CommunityStack', {
                  screen: 'Profile',
                  params: {fanId: post.writer.id},
                });
            }}>
            <CustomText fontWeight="600" className="text-sm text-gray-800">
              {post.writer.name}
            </CustomText>
            {post.writer.type === 'ADMIN' && (
              <CrownSvg width={20} height={20} className="ml-[2]" />
            )}
          </Pressable>
          <CustomText style={{color: '#737373', marginLeft: 5}}>
            {formatBeforeDate(post.createdAt)}
          </CustomText>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{padding: 2}}
          onPress={() => {
            if (post.writer.type !== 'ADMIN')
              bottomSheetModalRef.current?.present();
          }}>
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
              params: {community: post.community, post: post},
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

export default PostWriter;
