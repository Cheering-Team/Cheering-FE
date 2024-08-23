import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {formatDate} from '../../utils/format';
import MoreSvg from '../../../assets/images/three-dots-black.svg';
import {useNavigation} from '@react-navigation/native';
import OptionModal from '../common/OptionModal';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {deleteReComment, reportReComment} from '../../apis/post';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AlertModal from '../common/AlertModal/AlertModal';

interface ReCommentProps {
  postId: number;
  comment: any;
  reComment: any;
  closeModal: () => void;
  handleToUser: (writer) => void;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
}

const ReComment = (props: ReCommentProps) => {
  const {postId, comment, reComment, closeModal, handleToUser, refetch} = props;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deleteReComment,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
      queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
      queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
    },
  });

  const reportMutation = useMutation({
    mutationFn: reportReComment,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
      queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
      queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
    },
  });

  const handleDeleteReComment = async () => {
    const data = await mutation.mutateAsync({reCommentId: reComment.id});

    if (data.message === '답글이 삭제되었습니다.') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: insets.bottom + 20,
        text1: '댓글을 삭제하였습니다.',
      });
    }
  };

  const handleReportPost = async () => {
    const data = await reportMutation.mutateAsync({reCommentId: reComment.id});

    if (data.message === '이미 신고하였습니다.') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: insets.bottom + 20,
        text1: '이미 신고한 답글입니다.',
      });
      return;
    }

    if (data.message === '신고가 접수되었습니다.') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: insets.bottom + 20,
        text1: '답글을 신고하였습니다.',
      });
      return;
    }
  };

  return (
    <View style={{flexDirection: 'row', marginTop: 19}}>
      <Pressable
        onPress={() => {
          closeModal();
          navigation.navigate('Profile', {
            playerUserId: comment.writer.id,
          });
        }}>
        <Avatar uri={reComment.writer.image} size={34} style={{marginTop: 2}} />
      </Pressable>

      <View style={{marginLeft: 8, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => {
              closeModal();
              navigation.navigate('Profile', {
                playerUserId: comment.writer.id,
              });
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              fontWeight="500"
              style={{color: '#1b1b1b', fontSize: 12}}>
              {reComment.writer.name}
            </CustomText>
            <CustomText
              style={{
                color: '#797979',
                marginLeft: 6,
                fontSize: 13,
                paddingBottom: 2,
              }}>
              {formatDate(reComment.createdAt)}
            </CustomText>
          </Pressable>
          <Pressable style={{padding: 5}} onPress={() => setIsModalOpen(true)}>
            <MoreSvg width={16} height={16} />
          </Pressable>
        </View>

        <CustomText fontWeight="300" style={{marginTop: 1}}>
          <CustomText
            fontWeight="500"
            style={{
              fontSize: 13,
              color: '#58a04b',
            }}>{`@${reComment.to.name} `}</CustomText>
          {reComment.content}
        </CustomText>
        <Pressable
          onPress={() => {
            handleToUser(reComment.writer);
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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="삭제하기"
          option1color="#fe6363"
          option1Press={() => {
            handleDeleteReComment();
          }}
        />
      ) : (
        <OptionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="신고하기"
          option1Press={() => {
            setIsReportAlertOpen(true);
          }}
          option1color="#fe6363"
        />
      )}
      <AlertModal
        isModalOpen={isReportAlertOpen}
        setIsModalOpen={setIsReportAlertOpen}
        title="게시글을 신고하시겠습니까?"
        content="정상적인 글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
        button1Text="신고하기"
        button1Color="#fe6363"
        button2Text="취소"
        button1Press={() => {
          handleReportPost();
        }}
      />
    </View>
  );
};

export default ReComment;
