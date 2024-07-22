import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  PanResponder,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getComments, postComments, postReComments} from '../../../apis/post';
import Comment from './Comment';
import CustomText from '../../common/CustomText';
import ArrowUpSvg from '../../../../assets/images/arrow_up.svg';
import Avatar from '../../common/Avatar';
import Toast from 'react-native-toast-message';
import CloseWhiteSvg from '../../../../assets/images/x_white.svg';

interface CommentModalProps {
  postId: number;
  isModalOpen: any;
  setIsModalOpen: any;
}

const CommentModal = (props: CommentModalProps) => {
  const {postId, isModalOpen, setIsModalOpen} = props;

  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-1, 0, 1],
  });

  const [modalKey, setModalKey] = useState(0);

  const [componentHeight, _] = useState(
    new Animated.Value(screenHeight * 0.55),
  );

  const [resetTarget, setResetTaget] = useState(0);

  const commentInputRef = useRef<TextInput>(null);
  const [commentContent, setCommentContent] = useState<string>('');
  const [toComment, setToComment] = useState<{
    id: number;
    name: string;
    image: string;
  } | null>(null);
  const [reIdx, setReIdx] = useState<number | null>(null);
  const [underCommentId, setUnderCommentId] = useState<number | null>(null);

  const {data: commentsData, refetch} = useQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: getComments,
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

  const resetBottomSheet = Animated.timing(panY, {
    toValue: resetTarget,
    duration: 350,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 350,
    useNativeDriver: true,
  });

  const panResponders = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
          if (gestureState.dy > 0) {
            panY.setValue(gestureState.dy + resetTarget);
          }
        },
        onPanResponderRelease: (event, gestureState) => {
          if (gestureState.dy > 0 && gestureState.vy > 1.3) {
            closeModal();
          } else {
            resetBottomSheet.start();
          }
        },
      }),
    [resetTarget],
  );

  const closeModal = () => {
    setToComment(null);
    setCommentContent('');
    closeBottomSheet.start(() => {
      setIsModalOpen(false);
    });
  };

  const keyboardDidShow = useCallback(
    e => {
      Animated.timing(componentHeight, {
        toValue: screenHeight - e.endCoordinates.height - insets.top - 85,
        duration: e.duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
      Animated.timing(panY, {
        toValue: -e.endCoordinates.height + insets.bottom,
        duration: e.duration,
        easing: Easing.out(Easing.linear),
        useNativeDriver: true,
      }).start(() => {
        setResetTaget(-e.endCoordinates.height);
      });
    },
    [componentHeight, screenHeight, insets.top, insets.bottom, panY],
  );

  const keyboardDidHide = useCallback(
    e => {
      setResetTaget(0);
      Animated.timing(componentHeight, {
        toValue: screenHeight * 0.55,
        duration: e.duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    },
    [componentHeight, screenHeight],
  );

  useEffect(() => {
    if (isModalOpen) {
      setModalKey(prevKey => prevKey + 1);
      setIsModalOpen(true);
      resetBottomSheet.start(() => {
        refetch();
      });
    }
  }, [isModalOpen, refetch]);

  useEffect(() => {
    if (resetTarget === 0 && isModalOpen) {
      resetBottomSheet.start();
      // setCommentListHeight(screenHeight * 0.55);
    }
  }, [resetTarget]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardDidShow, keyboardDidHide]);

  return (
    <Modal
      animationType="fade"
      visible={isModalOpen}
      transparent={true}
      onRequestClose={closeModal}>
      {isModalOpen && (
        <Pressable
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
          onPressOut={closeModal}
        />
      )}

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
          },
          {transform: [{translateY}]},
        ]}>
        <View
          style={{
            height: 30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            width: '100%',
          }}
          {...panResponders.panHandlers}>
          <View
            style={{
              backgroundColor: '#a2a2a2',
              width: 50,
              height: 6,
              marginTop: 13,
              borderRadius: 6,
            }}
          />
        </View>
        <Animated.FlatList
          key={modalKey}
          data={commentsData?.result.comments}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 40,
            paddingHorizontal: 15,
          }}
          renderItem={({item}) => (
            <Comment
              comment={item}
              setCommentContent={setCommentContent}
              setToComment={setToComment}
              setUnderCommentId={setUnderCommentId}
              reIdx={reIdx}
              setReIdx={setReIdx}
            />
          )}
          style={{
            height: componentHeight,
            width: '100%',
            flex: 1,
          }}
          ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 50}}>
              <CustomText
                fontWeight="600"
                style={{fontSize: 23, marginBottom: 5}}>
                아직 댓글이 없어요
              </CustomText>
              <CustomText style={{color: '#5b5b5b'}}>
                가장 먼저 댓글을 작성해보세요
              </CustomText>
            </View>
          }
        />
        {toComment && (
          <View
            style={{
              position: 'absolute',
              bottom: 55 + insets.bottom,
              backgroundColor: '#58a04b',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              paddingLeft: 17,
              paddingRight: 14,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
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
          <Avatar size={30} />
          <View
            style={{
              flex: 1,
              backgroundColor: '#f3f3f3',
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 4,
              paddingBottom: 5,
              marginLeft: 7,
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
      </Animated.View>
    </Modal>
  );
};

export default CommentModal;
