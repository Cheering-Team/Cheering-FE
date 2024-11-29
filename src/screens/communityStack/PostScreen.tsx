import React, {useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Pressable,
  RefreshControl,
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
import PostHeader from '../../components/post/PostHeader';
import InteractBar from '../../components/post/InteractBar';
import PostImage from '../../components/post/PostImage';
import {useGetComments} from '../../apis/comment/useComments';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {useGetPostById} from 'apis/post/usePosts';
import CommentSkeleton from 'components/skeleton/CommentSkeleton';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NotFound from 'components/notfound';
import {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Vote from 'components/post/Vote';
import {useGetVote} from 'apis/vote/useVotes';

type PostScreenNavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'Post'
>;
type PostScreenRouteProp = RouteProp<CommunityStackParamList, 'Post'>;

interface PostScreenProps {
  navigation: PostScreenNavigationProp;
  route: PostScreenRouteProp;
}

const PostScreen = ({navigation, route}: PostScreenProps) => {
  const {postId} = route.params;
  const insets = useSafeAreaInsets();

  const commentInputRef = useRef<TextInput>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [under, setUnder] = useState<number | null>(null);
  const [to, setTo] = useState<IdName | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: post,
    isLoading: postIsLoading,
    refetch: refetchPost,
    isError,
    error,
  } = useGetPostById(postId);
  const {
    data: comments,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetComments(postId, !!post && !postIsLoading && !isError);
  const {data: vote} = useGetVote(postId);

  const loadComment = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
    refetchPost();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const hasAndroidPermission = async () => {
    const getCheckPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };
    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  };

  const viewRef = useRef(null);

  const captureView = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    try {
      const uri = await captureRef(viewRef, {
        format: 'png', // 이미지 포맷 (png, jpg 가능)
        quality: 0.8, // 품질 (0~1)
      });
      CameraRoll.saveAsset(uri, {type: 'photo'});
    } catch (error) {
      console.error('Error capturing view:', error);
    }
  };

  if (postIsLoading) {
    return null;
  }

  if (isError && error.message === '존재하지 않는 게시글') {
    return <NotFound type="POST" />;
  }

  if (post) {
    return (
      <View style={{flex: 1, paddingTop: insets.top}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={-insets.bottom}>
          <PostHeader
            community={post.community}
            refetchPost={refetchPost}
            refetch={refetch}
          />
          <FlatList
            data={
              isLoading ? [] : comments?.pages.flatMap(page => page.comments)
            }
            renderItem={({item}) => (
              <Comment
                comment={item}
                setUnder={setUnder}
                setTo={setTo}
                inputRef={commentInputRef}
                postId={postId}
              />
            )}
            onEndReached={loadComment}
            onEndReachedThreshold={1}
            contentContainerStyle={{paddingBottom: 70}}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            ListHeaderComponent={
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingTop: 10,
                    paddingHorizontal: 15,
                  }}>
                  {post.tags.map(tag => (
                    <View
                      key={tag}
                      style={{
                        height: 35,
                        borderWidth: 1,
                        borderColor: '#e1e1e1',
                        paddingHorizontal: 15,
                        borderRadius: 12,
                        marginRight: 6,
                        justifyContent: 'center',
                      }}>
                      <CustomText fontWeight="500" style={{fontSize: 15}}>
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
                        fanId: post.writer.id,
                      });
                    }}>
                    <Avatar
                      uri={post.writer.image}
                      size={33}
                      style={{marginRight: 10}}
                    />
                  </Pressable>

                  <PostWriter
                    bottomSheetModalRef={bottomSheetModalRef}
                    post={post}
                    isWriter={post.user.id === post.writer.id}
                    type="post"
                  />
                </View>
                {/* 본문 */}
                <CustomText
                  numberOfLines={999}
                  style={{
                    marginTop: 5,
                    color: '#282828',
                    marginRight: 25,
                    lineHeight: 24,
                    fontSize: 17,
                    paddingHorizontal: 15,
                    marginBottom: 10,
                  }}>
                  {post.content}
                </CustomText>
                <View
                  ref={viewRef}
                  className="h-10 bg-yellow-100 justify-center items-center">
                  <CustomText className="text-lg">hello</CustomText>
                </View>
                <Pressable
                  className="m-5 p-5 bg-gray-100 items-center"
                  onPress={captureView}>
                  <CustomText>캡처</CustomText>
                </Pressable>
                {/* 이미지 */}
                <PostImage images={post.images} type="POST" />
                {vote && <Vote vote={vote} post={post} />}
                <InteractBar post={post} type="post" />
                {/* 댓글 */}
                <CustomText
                  fontWeight="600"
                  style={{
                    fontSize: 18,
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    marginBottom: 10,
                  }}>
                  댓글
                </CustomText>
              </>
            }
            ListEmptyComponent={
              comments ? <ListEmpty type="comment" /> : <CommentSkeleton />
            }
          />
          <CommentInput
            postId={postId}
            writer={post.user}
            to={to}
            setTo={setTo}
            under={under}
            setUnder={setUnder}
            inputRef={commentInputRef}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
};

export default PostScreen;
