import React, {Dispatch, RefObject, SetStateAction, useRef} from 'react';
import {Pressable, TextInput, TouchableOpacity, View} from 'react-native';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CommentWriter from '../comment/CommentWriter';
import {ReComment as ReCommentType} from '../../apis/comment/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {IdName} from 'apis/types';

interface Props {
  commentId: number;
  reComment: ReCommentType;
  setUnder: Dispatch<SetStateAction<number | null>>;
  setTo: Dispatch<SetStateAction<IdName | null>>;
  inputRef: RefObject<TextInput>;
  postId: number;
}

const ReComment = (props: Props) => {
  const {commentId, reComment, setUnder, setTo, inputRef, postId} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <Pressable
      style={[
        {
          marginTop: 5,
          paddingTop: 5,
          paddingBottom: 8,
          flexDirection: 'row',
          borderRadius: 5,
          paddingHorizontal: 10,
        },
        reComment.status === 'temp' && {
          backgroundColor: '#e2e8f0',
          borderRadius: 5,
        },
      ]}
      onLongPress={() => bottomSheetModalRef.current?.present()}>
      <Pressable
        style={{height: 33}}
        onPress={() => {
          if (reComment.writer.type !== 'ADMIN')
            navigation.navigate('Profile', {
              fanId: reComment.writer.id,
            });
        }}>
        <Avatar uri={reComment.writer.image} size={33} />
      </Pressable>

      <View style={{marginLeft: 10, flex: 1}}>
        <CommentWriter
          bottomSheetModalRef={bottomSheetModalRef}
          comment={reComment}
          type="reComment"
          postId={postId}
          under={commentId}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText
            fontWeight="500"
            style={{color: '#939393', fontSize: 14.5}}>
            {`@${reComment.to.name} `}
          </CustomText>
          <CustomText className="text-[14.5px] leading-[20px]">
            {reComment.content}
          </CustomText>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setUnder(commentId);
            setTo({id: reComment.writer.id, name: reComment.writer.name});
            inputRef.current?.focus();
          }}>
          <CustomText
            fontWeight="500"
            style={{marginTop: 8, fontSize: 13, color: '#888888'}}>
            답글 달기
          </CustomText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default ReComment;
