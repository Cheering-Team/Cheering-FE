import React, {useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import BackSvg from '../../assets/images/chevron-left.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PostHeader from '../components/WriterHeader';
import CustomText from '../components/CustomText';

import HeartSvg from '../../assets/images/heart.svg';
import HeartFillSvg from '../../assets/images/heart_fill.svg';
import ArrowUpSvg from '../../assets/images/arrow_up.svg';

import {
  getComments,
  getCommunitiesPosts,
  getPostsLike,
  getRecomments,
  postComments,
  postRecomments,
} from '../apis/post';
import {PostType, Writer} from '../components/Post';
import Toast from 'react-native-toast-message';
import Avatar from '../components/Avatar';
import CloseSvg from '../../assets/images/x_white.svg';
import formatDate from '../utils/formatDate';
import EditSvg from '../../assets/images/three_dots.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import {RouteProp} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  reCommentCount: number;
  writer: Writer;
  isOpen: boolean;
  recomments: Omit<Comment, 'reCommentCount' | 'isOpen' | 'recomments'>[];
}

type PostScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Post'
>;

type PostScreenRouteProp = RouteProp<HomeStackParamList, 'Post'>;

const PostScreen = ({
  navigation,
  route,
}: {
  navigation: PostScreenNavigationProp;
  route: PostScreenRouteProp;
}) => {
  const statusBarHeight = useSafeAreaInsets().top;
  const {width: screenWidth} = Dimensions.get('window');

  const commentInputRef = React.useRef<TextInput>(null);

  const [postData, setPostData] = React.useState<PostType | null>(null);
  const [commentContent, setCommentContent] = React.useState<string>('');
  const [commentsData, setCommentsData] = React.useState<Comment[]>([]);
  const [recomment, setRecomment] = React.useState<{
    id: number;
    name: string;
    profileImage: string | null;
    index: number;
  } | null>(null);

  const [isImageOpen, setIsImageOpen] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={[
            {
              height: 50 + statusBarHeight,
              paddingTop: statusBarHeight,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 5,
              backgroundColor: 'white',
            },
          ]}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: 'absolute',
              left: 5,
              paddingTop: statusBarHeight - 5,
            }}>
            <BackSvg width={35} height={35} />
          </Pressable>
          <CustomText fontWeight="500" style={{fontSize: 18}}>
            {route.params.type}. 이강인
          </CustomText>
        </View>
      ),
    });
  });

  const getPost = useCallback(async () => {
    const response = await getCommunitiesPosts({
      communityId: route.params.communityId,
      postId: route.params.postId,
    });

    setPostData(response.data);
  }, [route.params.communityId, route.params.postId]);

  React.useEffect(() => {
    getPost();
  }, [getPost]);

  const getPostComments = useCallback(async () => {
    const response = await getComments({
      communityId: route.params.communityId,
      postId: route.params.postId,
    });

    if (response.message === 'get comment success') {
      setCommentsData(
        response.data.map((comment: any) => ({...comment, isOpen: false})),
      );
    }
  }, [route.params.communityId, route.params.postId]);

  React.useEffect(() => {
    getPostComments();
  }, [getPostComments]);

  const submitComment = async () => {
    if (commentContent.length === 0) {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 30,
        bottomOffset: 30,
        text1: '댓글을 입력해주세요',
      });
      return;
    }

    if (recomment === null) {
      const response = await postComments(
        {
          communityId: route.params.communityId,
          postId: route.params.postId,
        },
        {content: commentContent},
      );

      if (response.message === 'create comment success') {
        setCommentContent('');
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: 30,
          bottomOffset: 30,
          text1: '댓글이 작성되었습니다',
        });
        Keyboard.dismiss();
        getPostComments();
        getPost();
      }
    } else {
      const response = await postRecomments(
        {
          communityId: route.params.communityId,
          postId: route.params.postId,
          commentId: recomment.id,
        },
        {content: commentContent},
      );

      if (response.message === 'create re-comment success') {
        setCommentContent('');
        setRecomment(null);
        Toast.show({
          type: 'default',
          position: 'top',
          visibilityTime: 3000,
          topOffset: 30,
          bottomOffset: 30,
          text1: '답글이 작성되었습니다',
        });
        Keyboard.dismiss();
        console.log(recomment.id, recomment.index);
        getRecomment(recomment.id, recomment.index);
      }
    }
  };

  const getRecomment = async (commentId: number, index: number) => {
    const response = await getRecomments({
      communityId: route.params.communityId,
      postId: route.params.postId,
      commentId,
    });

    if (response.message === 'get re-comments-success') {
      setCommentsData(prev => {
        const newComment = [...prev];

        newComment[index] = {
          ...newComment[index],
          isOpen: true,
          recomments: response.data,
          reCommentCount: newComment[index].reCommentCount + 1,
        };

        return newComment;
      });
    }
  };

  const postLike = async () => {
    const response = await getPostsLike({
      communityId: route.params.communityId,
      postId: route.params.postId,
    });

    if (response.message === 'like success' && postData) {
      setPostData({
        ...postData,
        likeStatus: 'TRUE',
        likeCount: postData.likeCount + 1,
      });

      return;
    }
    if (response.message === 'like cancel success' && postData) {
      setPostData({
        ...postData,
        likeStatus: 'FALSE',
        likeCount: postData.likeCount - 1,
      });
      return;
    }
  };

  if (postData) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={48 + statusBarHeight}>
          <FlatList
            ListHeaderComponent={
              <>
                <View
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#f1f1f1',
                    paddingBottom: 25,
                  }}>
                  <PostHeader
                    writer={postData.writer}
                    createdAt={postData.createdAt}
                  />
                  <CustomText
                    fontWeight="400"
                    style={{
                      marginTop: 17,
                      marginLeft: 3,
                      fontSize: 16,
                    }}>
                    {postData.content}
                  </CustomText>
                  {postData.image.length !== 0 && (
                    <View>
                      {postData.image.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setImageIndex(index);
                            setIsImageOpen(true);
                          }}>
                          <Image
                            source={{uri: image.url}}
                            style={{
                              width: '100%',
                              height:
                                (image.height || 0) *
                                ((screenWidth - 20) / (image.width || 1)),
                              borderRadius: 10,
                              marginVertical: 5,
                            }}
                            resizeMode="cover"
                          />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 3,
                    marginVertical: 10,
                  }}>
                  <CustomText
                    fontWeight="700"
                    style={{color: '#58a04b', marginRight: 2, fontSize: 16}}>
                    {postData.commentCount}
                  </CustomText>
                  <CustomText fontWeight="400" style={{fontSize: 16}}>
                    개의 댓글
                  </CustomText>
                </View>
              </>
            }
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            style={{
              flex: 1,
              paddingHorizontal: 7,
              paddingTop: 19,
              paddingBottom: 20,
              marginHorizontal: 10,
            }}
            data={commentsData}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row', paddingVertical: 7, flex: 1}}>
                <Avatar
                  size={35}
                  uri={item.writer.profileImage}
                  style={{marginTop: 3}}
                />
                <View style={{marginLeft: 10, flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <CustomText fontWeight="600">{item.writer.name}</CustomText>
                    <CustomText
                      style={{color: 'gray', marginLeft: 10, flex: 1}}>
                      {formatDate(item.createdAt)}
                    </CustomText>
                    <EditSvg width={17} height={17} />
                  </View>

                  <CustomText>{item.content}</CustomText>
                  {item.reCommentCount === 0 ? (
                    <>
                      <Pressable
                        onPress={() => {
                          setRecomment({
                            id: item.id,
                            name: item.writer.name,
                            profileImage: item.writer.profileImage,
                            index: index,
                          });
                          commentInputRef.current?.focus();
                        }}>
                        <CustomText
                          fontWeight="700"
                          style={{
                            marginTop: 5,
                            fontSize: 12.5,
                            color: '#3f7636',
                          }}>
                          답글 달기
                        </CustomText>
                      </Pressable>
                    </>
                  ) : item.isOpen ? (
                    <>
                      <Pressable
                        onPress={() => {
                          setRecomment({
                            id: item.id,
                            name: item.writer.name,
                            profileImage: item.writer.profileImage,
                            index: index,
                          });
                          commentInputRef.current?.focus();
                        }}>
                        <CustomText
                          fontWeight="700"
                          style={{
                            marginTop: 5,
                            fontSize: 12.5,
                            color: '#3f7636',
                          }}>
                          답글 달기
                        </CustomText>
                      </Pressable>
                      {item.recomments.map(recomment => (
                        <View
                          key={recomment.id}
                          style={{
                            flexDirection: 'row',
                            paddingVertical: 5,
                            flex: 1,
                          }}>
                          <Avatar
                            size={30}
                            uri={recomment.writer.profileImage}
                            style={{marginTop: 3}}
                          />
                          <View style={{marginLeft: 10, flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignItems: 'center',
                              }}>
                              <CustomText
                                fontWeight="600"
                                style={{fontSize: 13}}>
                                {recomment.writer.name}
                              </CustomText>
                              <CustomText
                                style={{
                                  color: 'gray',
                                  marginLeft: 10,
                                  flex: 1,
                                  fontSize: 13,
                                }}>
                                {formatDate(recomment.createdAt)}
                              </CustomText>
                              <EditSvg width={15} height={15} />
                            </View>

                            <CustomText style={{fontSize: 13}}>
                              {recomment.content}
                            </CustomText>
                          </View>
                        </View>
                      ))}
                    </>
                  ) : (
                    <>
                      <Pressable
                        onPress={() => {
                          getRecomment(item.id, index);
                          setRecomment({
                            id: item.id,
                            name: item.writer.name,
                            profileImage: item.writer.profileImage,
                            index: index,
                          });
                        }}>
                        <CustomText
                          fontWeight="700"
                          style={{
                            marginTop: 5,
                            fontSize: 12.5,
                            color: '#3f7636',
                          }}>
                          + {item.reCommentCount}개의 답글
                        </CustomText>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            )}
          />
          {recomment !== null && (
            <View
              style={{
                height: 40,
                backgroundColor: '#58a04b',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Avatar size={20} uri={recomment.profileImage} />
                <CustomText
                  fontWeight="500"
                  style={{marginLeft: 10, color: 'white'}}>
                  {recomment.name} 님에게 답글 남기는 중...
                </CustomText>
              </View>
              <Pressable
                onPress={() => {
                  setRecomment(null);
                  Keyboard.dismiss();
                }}>
                <CloseSvg width={17} height={17} />
              </Pressable>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderTopColor: '#e0e0e0',
              borderTopWidth: 1,
              padding: 8,
            }}>
            <Pressable
              onPress={postLike}
              style={{
                alignItems: 'center',
                marginLeft: 7,
                marginRight: 15,
              }}>
              {postData.likeStatus === 'TRUE' ? (
                <HeartFillSvg width={23} height={23} />
              ) : (
                <HeartSvg width={23} height={23} />
              )}

              <CustomText
                style={{fontSize: 12, marginTop: 1, color: '#595959'}}>
                {postData.likeCount}
              </CustomText>
            </Pressable>
            <View
              style={{
                flex: 1,
                backgroundColor: '#f3f3f3',
                borderRadius: 30,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                autoCapitalize="none"
                ref={commentInputRef}
                placeholder="댓글을 입력해주세요"
                placeholderTextColor={'#747474'}
                value={commentContent}
                onChangeText={setCommentContent}
                style={{
                  flex: 1,
                  height: Platform.OS === 'ios' ? 45 : 50,
                  paddingVertical: 0,
                  paddingBottom: 2,
                  paddingHorizontal: 17,
                  fontFamily: 'NotoSansKR-Regular',
                  includeFontPadding: false,
                  color: 'black',
                }}
              />
              <Pressable
                style={{
                  backgroundColor: '#58a04b',
                  paddingVertical: 7,
                  paddingHorizontal: 13,
                  borderRadius: 23,
                  marginRight: 8,
                }}
                onPress={submitComment}>
                <ArrowUpSvg width={20} height={20} />
              </Pressable>
            </View>
          </View>
          <ImageView
            images={postData.image.map(item => ({uri: item.url}))}
            imageIndex={imageIndex}
            visible={isImageOpen}
            onRequestClose={() => setIsImageOpen(false)}
            FooterComponent={props => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingBottom: useSafeAreaInsets().bottom + 100,
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
                    {postData.image.length}
                  </CustomText>
                </View>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
};

export default PostScreen;
