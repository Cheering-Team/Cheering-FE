import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import CustomText from '../../components/CustomText';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import ThreeDotSvg from '../../../assets/images/three-dots-black.svg';
import HeartSvg from '../../../assets/images/heart.svg';
import HeartFillSvg from '../../../assets/images/heart_fill.svg';
import ArrowUpSvg from '../../../assets/images/arrow_up.svg';
import CloseWhiteSvg from '../../../assets/images/x_white.svg';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  getPostById,
  postComments,
  postPostsLikes,
  postReComments,
} from '../../apis/post';
import PostWriter from '../../components/category/post/PostWriter';
import ImageView from 'react-native-image-viewing';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import CommentModal from '../../components/category/post/CommentModal';
import Toast from 'react-native-toast-message';

const PostScreen = ({navigation, route}) => {
  const {postId} = route.params;
  const insets = useSafeAreaInsets();

  const commentInputRef = useRef<TextInput>(null);
  const {width: screenWidth} = Dimensions.get('window');

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [reIdx, setReIdx] = useState<number | null>(null);

  const [loading, setLoading] = useState([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [commentContent, setCommentContent] = useState<string>('');
  const [underCommentId, setUnderCommentId] = useState<number | null>(null);
  const [toComment, setToComment] = useState<{
    id: number;
    name: string;
    image: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['post', postId],
    queryFn: getPostById,
  });

  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (!isLoading) {
      setLikeStatus(data.result.post.isLike);
      setLikeCount(data.result.post.likeCount);
    }
  }, [data, isLoading]);

  const likeMutation = useMutation({
    mutationFn: postPostsLikes,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['post', postId]});
    },
  });

  const commentMutation = useMutation({
    mutationFn: postComments,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
      queryClient.invalidateQueries({queryKey: ['post', postId]});
    },
  });

  const reCommentMutation = useMutation({
    mutationFn: postReComments,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', underCommentId, 'reComments'],
      });
      queryClient.invalidateQueries({queryKey: ['post', postId, 'comments']});
      setReIdx(underCommentId);
    },
  });

  useEffect(() => {
    if (!isLoading && !hasLoadedOnce) {
      setLoading(data.result.post.images.map(() => true));
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasLoadedOnce, setLoading, data]);

  const handleLoadStart = index => {
    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });
  };

  const handleLoadEnd = index => {
    setLoading(prevLoading => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const toggleLike = async () => {
    setLikeCount(prev => (likeStatus ? prev - 1 : prev + 1));
    setLikeStatus(prev => !prev);

    const response = await likeMutation.mutateAsync({postId});

    if (response.code !== 200) {
      setLikeCount(prev => (likeStatus ? prev - 1 : prev + 1));
      setLikeStatus(prev => !prev);

      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '일시적인 오류입니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const writeComment = async () => {
    if (commentContent === '') {
      return;
    }

    const data = await commentMutation.mutateAsync({
      postId,
      content: commentContent,
    });

    if (data.message === '댓글이 작성되었습니다.') {
      setCommentContent('');
      return;
    } else {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '잠시 후 다시 시도해 주세요.',
      });
    }
  };

  const writeReComment = async () => {
    if (commentContent === '') {
      return;
    }

    if (toComment && underCommentId) {
      const data = await reCommentMutation.mutateAsync({
        commentId: underCommentId,
        content: commentContent,
        toId: toComment.id,
      });

      if (data.message === '답글이 작성되었습니다.') {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          bottomOffset: 30,
          text1: '댓글을 작성하였습니다.',
        });

        setCommentContent('');
        setToComment(null);
        setUnderCommentId(null);

        return;
      } else {
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          bottomOffset: 30,
          text1: '잠시 후 다시 시도해 주세요.',
        });
      }
    }
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <View style={{flex: 1, paddingTop: insets.top}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-insets.bottom}>
        {/* 헤더 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
            paddingRight: 17,
            paddingLeft: 10,
          }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <ChevronLeftSvg width={33} height={33} />
          </Pressable>
          <View style={{flexDirection: 'row'}}>
            <CustomText
              fontWeight="500"
              style={{
                fontSize: 18,
                paddingBottom: 2,
              }}>{`${data.result.player.koreanName} / `}</CustomText>
            <CustomText
              fontWeight="500"
              style={{fontSize: 18, paddingBottom: 2}}>
              {data.result.player.englishName}
            </CustomText>
          </View>
          <Pressable>
            <ThreeDotSvg width={19} height={19} />
          </Pressable>
        </View>
        {/* 본문 */}
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 70}}>
          {/* 태그 */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingTop: 10,
              paddingHorizontal: 15,
            }}>
            {data.result.post.tags.map(tag => (
              <View
                key={tag}
                style={{
                  borderWidth: 1,
                  borderColor: '#e1e1e1',
                  paddingVertical: 6,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  marginRight: 6,
                }}>
                <CustomText fontWeight="500">
                  {tag === 'photo'
                    ? '📸 직찍사'
                    : tag === 'viewing'
                    ? '👀 직관인증'
                    : '🔎 정보'}
                </CustomText>
              </View>
            ))}
          </View>
          {/* 작성자 */}
          <View style={{paddingHorizontal: 15, marginTop: 15}}>
            <PostWriter
              writer={data.result.post.writer}
              createdAt={data.result.post.createdAt}
            />
            <CustomText
              style={{
                paddingTop: 13,
                paddingHorizontal: 1,
                fontSize: 17,
                marginBottom: 10,
              }}>
              {data.result.post.content}
            </CustomText>
            {data.result.post.images.length !== 0 &&
              data.result.post.images.map((image, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setImageIndex(index);
                    setIsImageOpen(true);
                  }}>
                  <FastImage
                    source={{uri: image.url}}
                    onLoadStart={() => handleLoadStart(index)}
                    onLoadEnd={() => handleLoadEnd(index)}
                    style={{
                      width: '100%',
                      height:
                        (image.height || 0) *
                        ((screenWidth - 20) / (image.width || 1)),
                      borderRadius: 10,
                      marginVertical: 5,
                    }}
                    resizeMode={FastImage.resizeMode.cover}>
                    {loading[index] && (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          zIndex: 1,
                          borderRadius: 10,
                          backgroundColor: '#eaedf2',
                        }}
                      />
                    )}
                  </FastImage>
                </Pressable>
              ))}
          </View>
        </ScrollView>
        <CommentModal
          commentCount={data.result.post.commentCount}
          postId={postId}
          setToComment={setToComment}
          setCommentContent={setCommentContent}
          setUnderCommentId={setUnderCommentId}
          reIdx={reIdx}
          setReIdx={setReIdx}
        />

        {toComment && (
          <View
            style={{
              backgroundColor: '#58a04b',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              paddingLeft: 17,
              paddingRight: 14,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <CustomText
              fontWeight="500"
              style={{
                color: 'white',
              }}>{`${toComment.name} 님에게 답글 남기는 중`}</CustomText>
            <Pressable
              style={{padding: 3}}
              onPress={() => {
                setToComment(null);
                setCommentContent('');
              }}>
              <CloseWhiteSvg width={11} height={11} />
            </Pressable>
          </View>
        )}
        <View
          style={{
            height: 55 + insets.bottom,
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: '#e0e0e0',
            backgroundColor: 'white',
            borderTopWidth: 1,
            padding: 6,
            paddingBottom: insets.bottom + 6,
          }}>
          <Pressable
            onPress={toggleLike}
            style={{
              alignItems: 'center',
              marginLeft: 7,
              marginRight: 15,
            }}>
            {likeStatus ? (
              <HeartFillSvg width={21} height={21} />
            ) : (
              <HeartSvg width={21} height={21} />
            )}
            <CustomText style={{fontSize: 11, marginTop: 1, color: '#3a3a3a'}}>
              {likeCount}
            </CustomText>
          </Pressable>
          <View
            style={{
              flex: 1,
              backgroundColor: '#f3f3f3',
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 4,
              paddingBottom: 5,
            }}>
            <TextInput
              autoCapitalize="none"
              multiline
              ref={commentInputRef}
              placeholder="댓글을 입력해주세요"
              placeholderTextColor={'#747474'}
              value={commentContent}
              onChangeText={setCommentContent}
              style={{
                flex: 1,
                height: 30,
                paddingHorizontal: 17,
                fontFamily: 'NotoSansKR-Regular',
                includeFontPadding: false,
                color: 'black',
              }}
            />
            <Pressable
              disabled={
                commentMutation.isPending || reCommentMutation.isPending
              }
              style={{
                backgroundColor:
                  commentMutation.isPending || reCommentMutation.isPending
                    ? '#d7d7d7'
                    : '#58a04b',
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 23,
                marginRight: 8,
              }}
              onPress={underCommentId ? writeReComment : writeComment}>
              <ArrowUpSvg width={16} height={16} />
            </Pressable>
          </View>
        </View>

        <ImageView
          images={data.result.post.images.map(item => ({uri: item.url}))}
          imageIndex={imageIndex}
          visible={isImageOpen}
          onRequestClose={() => setIsImageOpen(false)}
          FooterComponent={props => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingBottom: insets.bottom + 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#ffffff16',
                  borderRadius: 18,
                  paddingHorizontal: 16,
                }}>
                <CustomText
                  style={{color: 'white', fontSize: 18, marginRight: 6}}
                  fontWeight="500">
                  {props.imageIndex + 1}
                </CustomText>
                <CustomText
                  style={{color: 'darkgray', fontSize: 17}}
                  fontWeight="600">
                  /
                </CustomText>
                <CustomText
                  style={{color: 'white', fontSize: 18, marginLeft: 6}}
                  fontWeight="500">
                  {data.result.post.images.length}
                </CustomText>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostScreen;
