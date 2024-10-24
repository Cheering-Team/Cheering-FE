import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Pressable, TextInput, TouchableOpacity, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import ReComment from './ReComment';
import {useGetRecomments} from '../../apis/comment/useComments';
import CommentWriter from '../comment/CommentWriter';
import {Comment as CommentType} from '../../apis/comment/types';
import {IdName} from 'apis/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {queryClient} from '../../../App';
import {commentKeys} from 'apis/comment/queries';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  comment: CommentType;
  setUnder: Dispatch<SetStateAction<number | null>>;
  setTo: Dispatch<SetStateAction<IdName | null>>;
  inputRef: RefObject<TextInput>;
  postId: number;
}

const Comment = ({comment, setUnder, setTo, inputRef, postId}: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isReCommentOpen, setIsReCommentOpen] = useState(false);

  const {
    data: recomments,
    isError,
    error,
  } = useGetRecomments(comment.id, isReCommentOpen);

  useEffect(() => {
    if (isError && error.message === '존재하지 않는 댓글') {
      showTopToast(insets.top + 20, '삭제된 댓글입니다');
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
    }
  }, [error?.message, insets.top, isError, postId]);

  return (
    <Pressable
      style={[
        {
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#eeeeee',
        },
        comment.status === 'temp' && {backgroundColor: '#e2e8f0'},
      ]}
      onLongPress={() => bottomSheetModalRef.current?.present()}>
      <Pressable
        style={{height: 33}}
        onPress={() => {
          navigation.navigate('Profile', {fanId: comment.writer.id});
        }}>
        <Avatar uri={comment.writer.image} size={33} style={{marginTop: 3}} />
      </Pressable>

      <View style={{marginLeft: 10, flex: 1, alignItems: 'flex-start'}}>
        <CommentWriter
          bottomSheetModalRef={bottomSheetModalRef}
          comment={comment}
          type="comment"
          postId={postId}
          under={comment.id}
        />
        <CustomText className="text-[#282828] text-base">
          {comment.content}
        </CustomText>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setUnder(comment.id);
            setTo({id: comment.writer.id, name: comment.writer.name});
            setIsReCommentOpen(true);
            inputRef.current?.focus();
          }}>
          <CustomText
            fontWeight="500"
            style={{marginTop: 8, fontSize: 14, color: '#888888'}}>
            답글 달기
          </CustomText>
        </TouchableOpacity>
        {isReCommentOpen &&
          recomments &&
          recomments.map(reComment => (
            <ReComment
              key={reComment.id}
              commentId={comment.id}
              reComment={reComment}
              setUnder={setUnder}
              setTo={setTo}
              inputRef={inputRef}
              postId={postId}
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
                  fontSize: 13,
                  color: '#888888',
                }}>
                답글 숨기기
              </CustomText>
            ) : (
              <CustomText
                fontWeight="500"
                style={{
                  fontSize: 13,
                  color: '#888888',
                }}>{`답글 ${comment.reCount}개 더보기`}</CustomText>
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default Comment;
