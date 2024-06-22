import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
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
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getPostById, postPostsLikes} from '../../apis/post';
import PostWriter from '../../components/category/post/PostWriter';
import ImageView from 'react-native-image-viewing';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PostScreen = ({navigation, route}) => {
  const {postId} = route.params;

  const commentInputRef = useRef<TextInput>(null);
  const {width: screenWidth} = Dimensions.get('window');

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [commentContent, setCommentContent] = useState<string>('');

  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['post', postId],
    queryFn: getPostById,
  });

  const mutation = useMutation({
    mutationFn: postPostsLikes,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['post', postId]});
    },
  });

  const toggleLike = async () => {
    await mutation.mutateAsync({postId});
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        <ScrollView style={{flex: 1}}>
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
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: '#e0e0e0',
            borderTopWidth: 1,
            padding: 6,
          }}>
          <Pressable
            onPress={toggleLike}
            style={{
              alignItems: 'center',
              marginLeft: 7,
              marginRight: 15,
            }}>
            {data.result.post.isLike ? (
              <HeartFillSvg width={21} height={21} />
            ) : (
              <HeartSvg width={21} height={21} />
            )}
            <CustomText style={{fontSize: 11, marginTop: 1, color: '#3a3a3a'}}>
              {data.result.post.likeCount}
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
              style={{
                backgroundColor: '#58a04b',
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 23,
                marginRight: 8,
              }}>
              <ArrowUpSvg width={16} height={16} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* 이미지 뷰어 */}
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
                {data.result.post.images.length}
              </CustomText>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default PostScreen;
