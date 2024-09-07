import React, {useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import PostWriter from '../../components/post/PostWriter';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import Avatar from '../../components/common/Avatar';
import Comment from '../../components/post/Comment';
import CommentInput from '../../components/comment/CommentInput';
import {IdName} from '../../apis/types';
import {useGetPostById} from '../../apis/post/usePosts';
import PostHeader from '../../components/post/PostHeader';
import InteractBar from '../../components/post/InteractBar';
import PostImage from '../../components/post/PostImage';
import {useGetComments} from '../../apis/comment/useComments';
import {useNavigation} from '@react-navigation/native';

const PostScreen = ({route}) => {
  const {postId} = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const commentInputRef = useRef<TextInput>(null);

  const [under, setUnder] = useState<number | null>(null);
  const [to, setTo] = useState<IdName | null>(null);

  const {data: postData, isLoading: postIsLoading} = useGetPostById(postId);

  const {data, isLoading, hasNextPage, fetchNextPage} = useGetComments(postId);

  const loadComment = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (postIsLoading || !postData) {
    return null;
  }

  return (
    <View style={{flex: 1, paddingTop: insets.top}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-insets.bottom}>
        <PostHeader player={postData.result.player} />
        <FlatList
          data={
            isLoading ? [] : data?.pages.flatMap(page => page.result.comments)
          }
          renderItem={({item}) => (
            <Comment
              comment={item}
              setUnder={setUnder}
              setTo={setTo}
              inputRef={commentInputRef}
            />
          )}
          onEndReached={loadComment}
          onEndReachedThreshold={1}
          contentContainerStyle={{paddingBottom: 70}}
          ListHeaderComponent={
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingTop: 10,
                  paddingHorizontal: 15,
                }}>
                {postData.result.tags.map(tag => (
                  <View
                    key={tag}
                    style={{
                      borderWidth: 1,
                      borderColor: '#e1e1e1',
                      paddingVertical: 4,
                      paddingHorizontal: 15,
                      borderRadius: 12,
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  marginTop: 15,
                }}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Profile', {
                      playerUserId: postData.result.writer.id,
                    });
                  }}>
                  <Avatar
                    uri={postData.result.writer.image}
                    size={33}
                    style={{marginRight: 10}}
                  />
                </Pressable>

                <PostWriter
                  feed={postData.result}
                  isWriter={
                    postData.result.playerUser.id === postData.result.writer.id
                  }
                />
              </View>
              {/* 본문 */}
              <CustomText
                style={{
                  marginTop: 5,
                  color: '#282828',
                  marginRight: 25,
                  lineHeight: 24,
                  fontSize: 15,
                  paddingHorizontal: 15,
                  marginBottom: 10,
                }}>
                {postData.result.content}
              </CustomText>
              {/* 이미지 */}
              <PostImage images={postData.result.images} />
              <InteractBar post={postData.result} type="post" />
              {/* 댓글 */}
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 16,
                  paddingHorizontal: 15,
                  paddingTop: 10,
                  marginBottom: 10,
                }}>
                댓글
              </CustomText>
            </>
          }
        />
        <CommentInput
          postId={postId}
          to={to}
          setTo={setTo}
          under={under}
          setUnder={setUnder}
          inputRef={commentInputRef}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostScreen;
