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
import CustomText from '../../CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {getComments} from '../../../apis/post';
import Avatar from '../../Avatar';
import {formatDate} from '../../../utils/format';

interface CommentModalProps {
  postId: number;
  setToComment: any;
  setUnderCommentId: any;
  setCommentContent: any;
}

const CommentModal = (props: CommentModalProps) => {
  const {postId, setToComment, setCommentContent, setUnderCommentId} = props;

  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const {data: commentsData, refetch} = useQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: getComments,
    enabled: false,
  });

  const openModal = () => {
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
              댓글 100개 모두 보기
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
          data={commentsData?.result.comments}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 40}}
          renderItem={({item}) => (
            <View
              style={{paddingHorizontal: 15, paddingVertical: 10}}
              key={item.id}>
              <View style={{flexDirection: 'row'}}>
                <Avatar
                  uri={item.writer.image}
                  size={36}
                  style={{marginTop: 2}}
                />
                <View style={{marginLeft: 8}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CustomText
                      fontWeight="500"
                      style={{color: '#1b1b1b', fontSize: 12}}>
                      {item.writer.name}
                    </CustomText>
                    <CustomText
                      style={{
                        color: '#797979',
                        marginLeft: 6,
                        fontSize: 13,
                        paddingBottom: 2,
                      }}>
                      {formatDate(item.createdAt)}
                    </CustomText>
                  </View>
                  <CustomText
                    fontWeight="300"
                    style={{marginTop: 1, fontSize: 14}}>
                    {item.content}
                  </CustomText>
                  <Pressable
                    onPress={() => {
                      setToComment(item.writer);
                      setUnderCommentId(item.id);
                    }}>
                    <CustomText
                      fontWeight="500"
                      style={{marginTop: 4, fontSize: 12, color: '#888888'}}>
                      답글 달기
                    </CustomText>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          style={{
            height: Dimensions.get('window').height * 0.6,
            width: '100%',
          }}
        />
      </Animated.View>
    </>
  );
};

export default CommentModal;
