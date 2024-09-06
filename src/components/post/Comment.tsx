// import React, {useEffect, useState} from 'react';
// import {ActivityIndicator, Pressable, View} from 'react-native';
// import {formatDate} from '../../utils/format';
// import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
// import {deleteComment, getReComments, reportComment} from '../../apis/post';
// import CustomText from '../common/CustomText';
// import Avatar from '../common/Avatar';
// import {useNavigation} from '@react-navigation/native';
// import MoreSvg from '../../../assets/images/three-dots-black.svg';
// import ReComment from './ReComment';
// import OptionModal from '../common/OptionModal';
// import Toast from 'react-native-toast-message';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import AlertModal from '../common/AlertModal/AlertModal';

// interface CommentProps {
//   postId: number;
//   comment: any;
//   setCommentContent: any;
//   setToComment: any;
//   setUnderCommentId: any;
//   reIdx: number | null;
//   setReIdx: any;
//   closeModal: any;
//   commentInputRef: any;
// }

// const Comment = (props: CommentProps) => {
//   const {
//     postId,
//     comment,
//     setCommentContent,
//     setToComment,
//     setUnderCommentId,
//     reIdx,
//     setReIdx,
//     closeModal,
//     commentInputRef,
//   } = props;

//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const queryClient = useQueryClient();

//   const [isReCommentOpen, setIsReCommentOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

//   const {
//     data: reCommentsData,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ['comments', comment.id, 'reComments'],
//     queryFn: getReComments,
//     enabled: false,
//   });

//   const mutation = useMutation({
//     mutationFn: deleteComment,
//     onSuccess: () => {
//       queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
//       queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
//       queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
//     },
//   });

//   const reportMutation = useMutation({
//     mutationFn: reportComment,
//     onSuccess: () => {
//       queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
//       queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
//       queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
//     },
//   });

//   const handleToUser = writer => {
//     setCommentContent('');
//     setToComment(writer);
//     setUnderCommentId(comment.id);
//     commentInputRef.current.focus();
//   };

//   const handleDeleteComment = async () => {
//     const data = await mutation.mutateAsync({commentId: comment.id});

//     if (data.message === '댓글이 삭제되었습니다.') {
//       Toast.show({
//         type: 'default',
//         position: 'bottom',
//         visibilityTime: 3000,
//         bottomOffset: insets.bottom + 20,
//         text1: '댓글을 삭제하였습니다.',
//       });
//     }
//   };

//   const handleReportPost = async () => {
//     const data = await reportMutation.mutateAsync({commentId: comment.id});

//     if (data.message === '이미 신고하였습니다.') {
//       Toast.show({
//         type: 'default',
//         position: 'bottom',
//         visibilityTime: 3000,
//         bottomOffset: insets.bottom + 20,
//         text1: '이미 신고한 댓글입니다.',
//       });
//       return;
//     }

//     if (data.message === '신고가 접수되었습니다.') {
//       Toast.show({
//         type: 'default',
//         position: 'bottom',
//         visibilityTime: 3000,
//         bottomOffset: insets.bottom + 20,
//         text1: '댓글을 신고하였습니다.',
//       });
//       return;
//     }
//   };

//   useEffect(() => {
//     if (isReCommentOpen) {
//       refetch();
//     }
//   }, [isReCommentOpen, refetch]);

//   useEffect(() => {
//     if (reIdx === comment.id) {
//       refetch();
//       setIsReCommentOpen(true);
//       setReIdx(null);
//     }
//   }, [comment.id, reIdx, refetch, setReIdx]);

//   return (
//     <View style={{paddingVertical: 10, paddingHorizontal: 15}} key={comment.id}>
//       <View style={{flexDirection: 'row'}}>
//         <Pressable
//           onPress={() => {
//             closeModal();
//             navigation.navigate('Profile', {playerUserId: comment.writer.id});
//           }}>
//           <Avatar uri={comment.writer.image} size={36} style={{marginTop: 2}} />
//         </Pressable>

//         <View style={{marginLeft: 8, flex: 1}}>
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <Pressable
//               onPress={() => {
//                 closeModal();
//                 navigation.navigate('Profile', {
//                   playerUserId: comment.writer.id,
//                 });
//               }}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//               }}>
//               <CustomText
//                 fontWeight="500"
//                 style={{color: '#1b1b1b', fontSize: 12}}>
//                 {comment.writer.name}
//               </CustomText>
//               {comment.createdAt && (
//                 <CustomText
//                   style={{
//                     color: '#797979',
//                     marginLeft: 6,
//                     fontSize: 13,
//                   }}>
//                   {formatDate(comment.createdAt)}
//                 </CustomText>
//               )}
//             </Pressable>
//             <Pressable
//               style={{padding: 5}}
//               onPress={() => setIsModalOpen(true)}>
//               <MoreSvg width={16} height={16} />
//             </Pressable>
//           </View>

//           <CustomText fontWeight="300" style={{marginTop: 1, fontSize: 14}}>
//             {comment.content}
//           </CustomText>
//           <Pressable
//             onPress={() => {
//               setCommentContent('');
//               setToComment(comment.writer);
//               setUnderCommentId(comment.id);
//               commentInputRef.current.focus();
//             }}>
//             <CustomText
//               fontWeight="500"
//               style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
//               답글 달기
//             </CustomText>
//           </Pressable>
//           {isLoading && <ActivityIndicator style={{padding: 10}} />}
//           {isReCommentOpen &&
//             reCommentsData?.result.reComments.map(reComment => (
//               <ReComment
//                 postId={postId}
//                 key={reComment.id}
//                 comment={comment}
//                 reComment={reComment}
//                 closeModal={closeModal}
//                 handleToUser={handleToUser}
//                 refetch={refetch}
//               />
//             ))}
//           {comment.reCount !== 0 && (
//             <Pressable
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginTop: 13,
//               }}
//               onPress={() => {
//                 setIsReCommentOpen(prev => !prev);
//               }}>
//               <View
//                 style={{
//                   height: 0.5,
//                   width: 30,
//                   marginRight: 9,
//                   backgroundColor: '#bababa',
//                 }}
//               />
//               {isReCommentOpen ? (
//                 <CustomText
//                   fontWeight="500"
//                   style={{
//                     fontSize: 12,
//                     color: '#888888',
//                   }}>
//                   답글 숨기기
//                 </CustomText>
//               ) : (
//                 <CustomText
//                   fontWeight="500"
//                   style={{
//                     fontSize: 12,
//                     color: '#888888',
//                   }}>{`답글 ${comment.reCount}개 더보기`}</CustomText>
//               )}
//             </Pressable>
//           )}
//         </View>
//       </View>
//       {comment.isWriter ? (
//         <OptionModal
//           isModalOpen={isModalOpen}
//           setIsModalOpen={setIsModalOpen}
//           option1Text="삭제하기"
//           option1color="#fe6363"
//           option1Press={() => {
//             handleDeleteComment();
//           }}
//         />
//       ) : (
//         <OptionModal
//           isModalOpen={isModalOpen}
//           setIsModalOpen={setIsModalOpen}
//           option1Text="신고하기"
//           option1Press={() => {
//             setIsReportAlertOpen(true);
//           }}
//           option1color="#fe6363"
//         />
//       )}
//       <AlertModal
//         isModalOpen={isReportAlertOpen}
//         setIsModalOpen={setIsReportAlertOpen}
//         title="게시글을 신고하시겠습니까?"
//         content="정상적인 글에 대한 신고가 계속될 경우 신고자가 제재받을 수 있습니다."
//         button1Text="신고하기"
//         button1Color="#fe6363"
//         button2Text="취소"
//         button1Press={() => {
//           handleReportPost();
//         }}
//       />
//     </View>
//   );
// };

// export default Comment;

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Avatar from '../common/Avatar';
import MoreSvg from '../../../assets/images/three-dots.svg';
import CustomText from '../common/CustomText';
import {formatDate} from '../../utils/format';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getReComments} from '../../apis/post';
import ReComment from './ReComment';
import {useGetRecomments} from '../../apis/comment/useComments';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';

interface Props {
  comment: any;
  setUnder: any;
  setTo: any;
  inputRef: any;
}

const Comment = (props: Props) => {
  const {comment, setUnder, setTo, inputRef} = props;
  const navigation = useNavigation();

  const [isReCommentOpen, setIsReCommentOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <Pressable style={{padding: 2}} onPress={() => setIsModalOpen(true)}>
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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="삭제하기"
          option1color="#fe6363"
          option1Press={() => {
            // handleDeleteComment();
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
