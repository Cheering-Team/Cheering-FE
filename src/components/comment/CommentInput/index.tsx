import React, {Dispatch, FC, RefObject, SetStateAction, useState} from 'react';
import {Keyboard, Pressable, TextInput, View} from 'react-native';
import CustomText from '../../common/CustomText';
import CloseSvg from '../../../../assets/images/x_white.svg';
import ArrowSvg from '../../../../assets/images/arrow_up.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IdName} from '../../../apis/types';
import {
  useWriteComment,
  useWriteReComment,
} from '../../../apis/comment/useComments';
import {hideToast, showBottomToast} from '../../../utils/toast';

interface CommentInputProps {
  postId: number;
  to: IdName | null;
  setTo: Dispatch<SetStateAction<IdName | null>>;
  under: number | null;
  setUnder: Dispatch<SetStateAction<number | null>>;
  inputRef: RefObject<TextInput>;
}

const CommentInput: FC<CommentInputProps> = props => {
  const {postId, to, setTo, under, setUnder, inputRef} = props;

  const insets = useSafeAreaInsets();

  const [comment, setComment] = useState('');

  const {mutateAsync: writeComment} = useWriteComment();
  const {mutateAsync: writeReComment} = useWriteReComment(postId);

  const handleWriteComment = async () => {
    if (comment.trim().length === 0) {
      return;
    }

    showBottomToast(insets.bottom + 20, '작성중입니다...', false);

    const commentResponse = await writeComment({
      postId,
      content: comment,
    });

    hideToast();

    if (commentResponse.message === '댓글이 작성되었습니다.') {
      setComment('');
      Keyboard.dismiss();
      showBottomToast(insets.bottom + 20, '작성이 완료되었습니다.');
    } else {
      showBottomToast(insets.bottom + 20, '잠시 후 다시시도 해주세요.');
    }
  };

  const handleWriteReComment = async () => {
    if (comment.trim().length === 0 || !to || !under) {
      return;
    }

    showBottomToast(insets.bottom + 20, '작성중입니다..', false);

    const reCommentResponse = await writeReComment({
      commentId: under,
      content: comment,
      toId: to.id,
    });

    hideToast();

    if (reCommentResponse.message === '답글이 작성되었습니다.') {
      setComment('');
      setTo(null);
      setUnder(null);
      Keyboard.dismiss();
      showBottomToast(insets.bottom + 20, '작성이 완료되었습니다.');
    } else {
      showBottomToast(insets.bottom + 20, '잠시 후 다시시도 해주세요.');
    }
  };

  return (
    <>
      {to && (
        <View
          style={{
            backgroundColor: 'black',
            paddingVertical: 3,
            paddingLeft: 20,
            paddingRight: 15,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CustomText
            style={{
              color: 'white',
              fontSize: 13,
            }}>{`${to.name}님에게 답글 남기기`}</CustomText>
          <Pressable
            style={{padding: 5}}
            onPress={() => {
              setTo(null);
              setUnder(null);
            }}>
            <CloseSvg width={10} height={10} />
          </Pressable>
        </View>
      )}
      <View
        style={{
          padding: 10,
          paddingBottom: insets.bottom + 10,
          borderTopWidth: 1,
          borderTopColor: '#eeeeee',
        }}>
        <TextInput
          ref={inputRef}
          multiline
          placeholder="댓글 남기기..."
          value={comment}
          onChangeText={setComment}
          maxLength={999}
          style={{
            backgroundColor: '#f5f5f5',
            paddingBottom: 11,
            paddingTop: 11,
            paddingLeft: 15,
            paddingRight: 45,
            borderRadius: 20,
            fontSize: 15,
          }}
          placeholderTextColor={'#929292'}
        />
        <Pressable
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            right: 16,
            bottom: insets.bottom + 15,
          }}
          onPress={under ? handleWriteReComment : handleWriteComment}>
          <ArrowSvg width={15} height={15} />
        </Pressable>
      </View>
    </>
  );
};

export default CommentInput;
