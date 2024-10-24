import React, {Dispatch, FC, RefObject, SetStateAction, useState} from 'react';
import {
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../common/CustomText';
import CloseSvg from '../../../assets/images/x_white.svg';
import ArrowSvg from '../../../assets/images/arrow_up.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IdName} from '../../../apis/types';
import {
  useWriteComment,
  useWriteReComment,
} from '../../../apis/comment/useComments';
import {hideToast, showBottomToast, showTopToast} from '../../../utils/toast';
import {Fan} from 'apis/user/types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {queryClient} from '../../../../App';
import {commentKeys} from 'apis/comment/queries';
import {postKeys} from 'apis/post/queries';

interface CommentInputProps {
  postId: number;
  writer: Fan;
  to: IdName | null;
  setTo: Dispatch<SetStateAction<IdName | null>>;
  under: number | null;
  setUnder: Dispatch<SetStateAction<number | null>>;
  inputRef: RefObject<TextInput>;
}

const CommentInput: FC<CommentInputProps> = props => {
  const {postId, writer, to, setTo, under, setUnder, inputRef} = props;

  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [comment, setComment] = useState('');

  const {mutateAsync: writeComment} = useWriteComment(postId, writer);
  const {mutateAsync: writeReComment} = useWriteReComment(to, writer);

  const handleWriteComment = async () => {
    if (comment.trim().length === 0) {
      return;
    }
    setComment('');
    try {
      await writeComment({
        postId,
        content: comment,
      });
    } catch (error: any) {
      if (error.code === 2004) {
        showTopToast(insets.top + 20, '부적절한 단어가 포함되어 있습니다');
      }
      if (error.code === 404) {
        showTopToast(insets.top + 20, '삭제된 글입니다');
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
        navigation.goBack();
      }
    }
  };

  const handleWriteReComment = async () => {
    if (comment.trim().length === 0 || !to || !under) {
      return;
    }
    setComment('');
    try {
      await writeReComment({
        postId,
        commentId: under,
        content: comment,
        toId: to.id,
      });
    } catch (error: any) {
      if (error.code === 2004) {
        showTopToast(insets.top + 20, '부적절한 단어가 포함되어 있습니다');
      }
      if (error.message === '존재하지 않는 게시글') {
        showTopToast(insets.top + 20, '삭제된 글입니다');
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
        navigation.goBack();
      }
      if (error.message === '존재하지 않는 댓글') {
        showTopToast(insets.top + 20, '삭제된 댓글입니다');
        queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      }
    }
    setTo(null);
    setUnder(null);
  };

  return (
    <>
      {to && (
        <Pressable
          className="bg-gray-800 py-1 pl-5 pr-4 rounded-t-[15px] flex-row justify-between items-center"
          onPress={() => {
            setTo(null);
            setUnder(null);
          }}>
          <CustomText
            fontWeight="500"
            style={{
              color: 'white',
              fontSize: 13,
            }}>{`${to.name}님에게 답글 남기기`}</CustomText>
          <View style={{padding: 5}}>
            <CloseSvg width={10} height={10} />
          </View>
        </Pressable>
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
            className="text-sm flex-1 p-0 m-0 mr-[50]"
            style={{
              fontFamily: 'NotoSansKR-Regular',
              includeFontPadding: false,
            }}
            allowFontScaling={false}
            placeholderTextColor={'#929292'}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            disabled={comment.trim().length === 0}
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
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CommentInput;
