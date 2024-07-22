import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import ThreeDotSvg from '../../../assets/images/three-dots-black.svg';
import HeartSvg from '../../../assets/images/heart.svg';
import HeartFillSvg from '../../../assets/images/heart_fill.svg';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getPostById, postPostsLikes} from '../../apis/post';
import PostWriter from '../../components/category/post/PostWriter';
import ImageView from 'react-native-image-viewing';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import CommentModal from '../../components/category/post/CommentModal';
import Toast from 'react-native-toast-message';
import CustomText from '../../components/common/CustomText';
import Avatar from '../../components/common/Avatar';

const PostScreen = ({navigation, route}) => {
  const {postId} = route.params;
  const insets = useSafeAreaInsets();

  const {width: screenWidth} = Dimensions.get('window');

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['post', postId],
    queryFn: getPostById,
  });

  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 200);
  const translateYInteract = diffClamp.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 70],
    easing: Easing.in(Easing.ease),
  });

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

  if (isLoading) {
    return <></>;
  }

  return (
    <View style={{flex: 1, paddingTop: insets.top}}>
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
        <ScrollView
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
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
              playerUserId={data.result.post.writer.id}
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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <Animated.View
          style={[
            {
              width: '100%',
              position: 'absolute',
              bottom: insets.bottom,
              padding: 10,
            },
            {transform: [{translateY: translateYInteract}]},
          ]}>
          <Pressable
            onPress={toggleLike}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: 88,
                backgroundColor: pressed ? '#dedede' : '#f8f8f8',
                padding: 7,
                marginBottom: 10,
                borderRadius: 20,
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 2.84,
              },
            ]}>
            {likeStatus ? (
              <HeartFillSvg width={17} height={17} />
            ) : (
              <HeartSvg width={17} height={17} />
            )}
            <CustomText>{likeCount}</CustomText>
          </Pressable>
          <Pressable
            onPress={() => setIsModalOpen(true)}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#dedede' : '#f8f8f8',
                padding: 15,
                borderRadius: 18,
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 2.84,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <CustomText fontWeight="500" style={{fontSize: 15}}>
                댓글{' '}
              </CustomText>
              <CustomText
                style={{
                  color: '#6a6a6a',
                }}>{`${data.result.post.commentCount}개`}</CustomText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar size={30} />
              <View
                style={{
                  marginLeft: 9,
                  backgroundColor: '#eeeeee',
                  flex: 1,
                  borderRadius: 15,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}>
                <CustomText style={{fontSize: 13, color: '#8b8b8b'}}>
                  댓글 추가...
                </CustomText>
              </View>
            </View>
          </Pressable>
        </Animated.View>

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
