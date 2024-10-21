import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../constants/dimension';
import WriteHeader from '../../components/post/write/WriteHeader';
import TagList from '../../components/post/write/TagList';
import WriteFooter from '../../components/post/write/WriteFooter';
import TagModal from '../../components/post/write/TagModal';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from '../../navigations/CommunityStackNavigator';
import {RouteProp} from '@react-navigation/native';
import {TagType} from '../../apis/post/types';
import {useEditPost, useWritePost} from '../../apis/post/usePosts';
import {showBottomToast} from '../../utils/toast';
import {AxiosProgressEvent} from 'axios';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CustomText from 'components/common/CustomText';
import {Results as ImageSelectType} from '@baronha/react-native-multiple-image-picker';
import PostImage from 'components/post/PostImage';

export type PostWriteScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'PostWrite'
>;

type PostWriteScreenRouteProp = RouteProp<CommunityStackParamList, 'PostWrite'>;

const PostWriteScreen = ({route}: {route: PostWriteScreenRouteProp}) => {
  const insets = useSafeAreaInsets();
  const {playerId, feed} = route.params;

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Record<TagType, boolean>>({
    photo: false,
    viewing: false,
    information: false,
  });

  const [content, setContent] = useState<string>('');
  const [imageData, setImageData] = useState<ImageSelectType[]>([]);

  const animatedProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  const {mutate: writePost, isPending: isWritePending} = useWritePost();
  const {mutate: editPost, isPending: isEditPending} = useEditPost();

  const handleDeleteImage = (path: string) => {
    const newImageData = [...imageData].filter(image => image.path !== path);
    setImageData(newImageData);
  };

  const handleProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      animatedProgress.value = withTiming(percentCompleted, {duration: 500});
    }
  };

  const handleWritePost = async () => {
    if (content.length === 0 && imageData.length === 0) {
      showBottomToast(insets.bottom + 20, '글 또는 사진을 넣어주세요');
      return;
    }
    if (content.length > 1990) {
      showBottomToast(insets.bottom + 20, '최대 2,000자까지 작성 가능합니다.');
      return;
    }

    const images = imageData.map(image => ({
      uri: image.path,
      name:
        Platform.OS === 'ios'
          ? image.fileName
          : image.path.substring(image.path.lastIndexOf('/') + 1),
      type: image.mime,
      width: image.width,
      height: image.height,
    }));

    const tags = Object.entries(selectedTag)
      .filter(([_, value]) => value)
      .map(([key]) => key as TagType);

    if (!feed) {
      writePost({
        communityId: playerId,
        content,
        tags,
        images,
        handleProgress,
      });
    } else {
      editPost({
        postId: feed.id,
        content,
        tags,
        images,
        handleProgress,
      });
    }
  };

  useEffect(() => {
    if (feed) {
      setContent(feed.content);

      feed.tags.map((tag: 'photo' | 'viewing' | 'information') =>
        setSelectedTag(prev => ({...prev, [tag]: true})),
      );

      setImageData(
        feed.images.map(image => ({
          uri: image.url,
          name: `${feed.id}-IMG.JPG`,
          type: 'image/jpeg',
        })),
      );
    }
  }, [feed]);

  return (
    <>
      {(isWritePending || isEditPending) && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 1000,
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <View
            className="justify-center items-center"
            style={{
              position: 'absolute',
              top: WINDOW_HEIGHT / 2,
              left: WINDOW_WIDTH / 2,
              backgroundColor: 'white',
              transform: [{translateX: -125}, {translateY: -50}],
              width: 250,
              height: 100,
              borderRadius: 10,
            }}>
            <CustomText className="text-gray-800 text-base mb-3">
              글을 작성중입니다
            </CustomText>
            <View className="w-[200] bg-slate-200 rounded-md overflow-hidden">
              <Animated.View
                className="h-[12] bg-slate-600"
                style={animatedStyle}
              />
            </View>
          </View>
        </View>
      )}
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {isTagOpen && (
            <Pressable
              style={[
                {
                  zIndex: 1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                {
                  width: WINDOW_WIDTH,
                  height: WINDOW_HEIGHT,
                },
              ]}
              onPressOut={() => {
                setIsTagOpen(false);
              }}
            />
          )}
          <WriteHeader
            handleWritePost={handleWritePost}
            isWritePending={isWritePending}
            isEditPending={isEditPending}
          />
          <ScrollView>
            <TagList selectedTag={selectedTag} setIsTagOpen={setIsTagOpen} />
            <TextInput
              placeholder="글을 작성해보세요"
              multiline
              placeholderTextColor={'#b4b4b4'}
              value={content}
              onChangeText={setContent}
              style={{
                fontSize: 18,
                paddingHorizontal: 12,
                textAlignVertical: 'top',
                marginBottom: 15,
              }}
            />
            <PostImage
              images={imageData}
              type="WRITE"
              handleDeleteImage={handleDeleteImage}
            />
          </ScrollView>

          <WriteFooter imageData={imageData} setImageData={setImageData} />
          {isTagOpen && (
            <TagModal
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default PostWriteScreen;
