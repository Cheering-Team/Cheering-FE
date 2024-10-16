import React, {Dispatch, FC, RefObject, SetStateAction, useState} from 'react';
import {Keyboard, Platform, Pressable, TextInput, View} from 'react-native';
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

    if (commentResponse.message === '작성 완료') {
      setComment('');
      Keyboard.dismiss();
    } else {
      showBottomToast(insets.bottom + 20, '잠시 후 다시시도 해주세요.');
    }

    if (commentResponse.message === '부적절한 단어가 포함되어 있습니다.') {
      showBottomToast(insets.bottom + 20, commentResponse.message);
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

    if (reCommentResponse.message === '부적절한 단어가 포함되어 있습니다.') {
      showBottomToast(insets.bottom + 20, reCommentResponse.message);
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
          paddingHorizontal: 8,
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: '#eeeeee',
        }}>
        <View
          className="flex-row bg-[#f5f5f5] rounded-[20px] justify-between pl-3"
          style={{paddingVertical: Platform.OS === 'ios' ? 9 : 6}}>
          <TextInput
            ref={inputRef}
            multiline
            placeholder="댓글 남기기..."
            value={comment}
            onChangeText={setComment}
            maxLength={999}
            className="text-sm flex-1 p-0 m-0"
            style={{
              fontFamily: 'NotoSansKR-Regular',
              includeFontPadding: false,
            }}
            allowFontScaling={false}
            placeholderTextColor={'#929292'}
          />
          <Pressable
            style={[
              {
                position: 'absolute',
                right: 5,
                bottom: 3,
                backgroundColor: 'black',
                paddingHorizontal: 13,
                paddingVertical: 9,
                borderRadius: 20,
              },
              comment.trim().length === 0 && {backgroundColor: '#a1a1a1'},
            ]}
            onPress={under ? handleWriteReComment : handleWriteComment}>
            <ArrowSvg width={15} height={15} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default CommentInput;
