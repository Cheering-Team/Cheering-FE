import React from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CommentWriter from '../comment/CommentWriter';
import {ReComment as ReCommentType} from '../../apis/comment/types';

interface Props {
  commentId: number;
  reComment: ReCommentType;
  setUnder: any;
  setTo: any;
  inputRef: any;
}

const ReComment = (props: Props) => {
  const {commentId, reComment, setUnder, setTo, inputRef} = props;
  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: 10,
        flexDirection: 'row',
      }}>
      <Pressable
        style={{height: 33}}
        onPress={() => {
          navigation.navigate('Profile', {
            playerUserId: reComment.writer.id,
          });
        }}>
        <Avatar uri={reComment.writer.image} size={33} />
      </Pressable>

      <View style={{marginLeft: 10, flex: 1}}>
        <CommentWriter comment={reComment} type="reComment" />
        <CustomText style={{color: '#282828'}}>{reComment.content}</CustomText>
        <Pressable
          onPress={() => {
            setUnder(commentId);
            setTo({id: reComment.writer.id, name: reComment.writer.nickname});
            inputRef.current.focus();
          }}>
          <CustomText
            fontWeight="500"
            style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
            답글 달기
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default ReComment;
