import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getComments} from '../../../apis/post';
import Comment from './Comment';
import CustomText from '../../common/CustomText';

interface CommentModalProps {
  commentCount: number;
  postId: number;
  setToComment: any;
  setUnderCommentId: any;
  setCommentContent: any;
  reIdx: number | null;
  setReIdx: any;
}

const CommentModal = (props: CommentModalProps) => {
  const {
    commentCount,
    postId,
    setToComment,
    setCommentContent,
    setUnderCommentId,
    reIdx,
    setReIdx,
  } = props;

  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  const [modalKey, setModalKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const {data: commentsData, refetch} = useQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: getComments,
  });

  const openModal = () => {
    setModalKey(prevKey => prevKey + 1);
    setIsModalOpen(true);
    Animated.timing(translateY, {
      toValue: isKeyboardOpen
        ? -(Dimensions.get('window').height - insets.bottom - insets.top - 70)
        : -Dimensions.get('window').height * 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      refetch();
    });
  };

  const closeModal = () => {
    setToComment(null);
    setCommentContent('');
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpen(false);
    });
  };

  const keyboardDidShow = useCallback(
    e => {
      setIsKeyboardOpen(true);
      Animated.timing(translateY, {
        toValue: isModalOpen
          ? -(Dimensions.get('window').height - insets.bottom - insets.top - 70)
          : -e.endCoordinates.height + insets.bottom,
        duration: e.duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
    [translateY, isModalOpen, insets],
  );

  const keyboardDidHide = useCallback(
    e => {
      setIsKeyboardOpen(false);
      Animated.timing(translateY, {
        toValue: isModalOpen ? -Dimensions.get('window').height * 0.6 : 0,
        duration: e.duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
    [translateY, isModalOpen],
  );

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
  }, [keyboardDidShow, keyboardDidHide, translateY]);

  return (
    <>
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
            width: '100%',
            bottom: -Dimensions.get('window').height * 0.6 + 55 + insets.bottom,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
          },
          {transform: [{translateY}]},
        ]}>
        {!isModalOpen ? (
          <Pressable
            style={{
              height: 35,
              backgroundColor: '#58a04b',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            onPress={openModal}>
            <CustomText fontWeight="600" style={{color: 'white', fontSize: 16}}>
              {`댓글 ${commentCount}개 모두 보기`}
            </CustomText>
          </Pressable>
        ) : (
          <View
            style={{
              backgroundColor: '#a2a2a2',
              width: 50,
              height: 6,
              marginTop: 10,
              borderRadius: 6,
            }}
          />
        )}
        <FlatList
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
            height: Dimensions.get('window').height * 0.6,
            width: '100%',
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
      </Animated.View>
    </>
  );
};

export default CommentModal;
