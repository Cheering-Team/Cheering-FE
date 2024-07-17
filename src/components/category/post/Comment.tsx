import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {formatDate} from '../../../utils/format';
import {useQuery} from '@tanstack/react-query';
import {getReComments} from '../../../apis/post';
import CustomText from '../../common/CustomText';
import Avatar from '../../common/Avatar';

interface CommentProps {
  comment: any;
  setCommentContent: any;
  setToComment: any;
  setUnderCommentId: any;
  reIdx: number | null;
  setReIdx: any;
}

const Comment = (props: CommentProps) => {
  const {
    comment,
    setCommentContent,
    setToComment,
    setUnderCommentId,
    reIdx,
    setReIdx,
  } = props;

  const [isReCommentOpen, setIsReCommentOpen] = useState(false);

  const {
    data: reCommentsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['comments', comment.id, 'reComments'],
    queryFn: getReComments,
    enabled: false,
  });

  useEffect(() => {
    if (isReCommentOpen) {
      refetch();
    }
  }, [isReCommentOpen, refetch]);

  useEffect(() => {
    if (reIdx === comment.id) {
      refetch();
      setIsReCommentOpen(true);
      setReIdx(null);
    }
  }, [comment.id, reIdx, refetch, setReIdx]);

  return (
    <View style={{paddingVertical: 10}} key={comment.id}>
      <View style={{flexDirection: 'row'}}>
        <Avatar uri={comment.writer.image} size={36} style={{marginTop: 2}} />
        <View style={{marginLeft: 8, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CustomText
              fontWeight="500"
              style={{color: '#1b1b1b', fontSize: 12}}>
              {comment.writer.name}
            </CustomText>
            <CustomText
              style={{
                color: '#797979',
                marginLeft: 6,
                fontSize: 13,
                paddingBottom: 2,
              }}>
              {formatDate(comment.createdAt)}
            </CustomText>
          </View>
          <CustomText fontWeight="300" style={{marginTop: 1, fontSize: 14}}>
            {comment.content}
          </CustomText>
          <Pressable
            onPress={() => {
              setCommentContent('');
              setToComment(comment.writer);
              setUnderCommentId(comment.id);
            }}>
            <CustomText
              fontWeight="500"
              style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
              답글 달기
            </CustomText>
          </Pressable>
          {isLoading && <ActivityIndicator style={{padding: 10}} />}
          {isReCommentOpen &&
            reCommentsData?.result.reComments.map(reComment => (
              <View
                key={reComment.id}
                style={{flexDirection: 'row', marginTop: 19}}>
                <Avatar
                  uri={reComment.writer.image}
                  size={34}
                  style={{marginTop: 2}}
                />
                <View style={{marginLeft: 8}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      setCommentContent('');
                      setToComment(reComment.writer);
                      setUnderCommentId(comment.id);
                    }}>
                    <CustomText
                      fontWeight="500"
                      style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
                      답글 달기
                    </CustomText>
                  </Pressable>
                </View>
              </View>
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
    </View>
  );
};

export default Comment;
