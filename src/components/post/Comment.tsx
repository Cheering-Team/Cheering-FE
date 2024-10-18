import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import ReComment from './ReComment';
import {useGetRecomments} from '../../apis/comment/useComments';
import CommentWriter from '../comment/CommentWriter';
import {Comment as CommentType} from '../../apis/comment/types';

interface Props {
  comment: CommentType;
  setUnder: any;
  setTo: any;
  inputRef: any;
}

const Comment = (props: Props) => {
  const {comment, setUnder, setTo, inputRef} = props;
  const navigation = useNavigation();

  const [isReCommentOpen, setIsReCommentOpen] = useState(false);

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
        <CommentWriter comment={comment} type="comment" />
        <CustomText style={{color: '#282828'}}>{comment.content}</CustomText>
        <Pressable
          onPress={() => {
            setUnder(comment.id);
            setTo({id: comment.writer.id, name: comment.writer.name});
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
    </View>
  );
};

export default Comment;
