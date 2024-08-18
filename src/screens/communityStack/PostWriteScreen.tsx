import React, {useEffect, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {postPlayersPosts, updatePost} from '../../apis/post';
import {useMutation} from '@tanstack/react-query';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../constants/dimension';
import WriteLoading from '../../components/post/\bwrite/WriteLoading';
import Toast from 'react-native-toast-message';
import WriteHeader from '../../components/post/\bwrite/WriteHeader';
import TagList from '../../components/post/\bwrite/TagList';
import ImageEditInfo from '../../components/post/\bwrite/ImageEditInfo';
import WriteFooter from '../../components/post/\bwrite/WriteFooter';
import TagModal from '../../components/post/\bwrite/TagModal';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from '../../navigations/CommunityStackNavigator';
import {RouteProp} from '@react-navigation/native';

export interface FilterType {
  photo: boolean;
  viewing: boolean;
  information: boolean;
}

export interface SizeImage {
  uri: string;
  name: string | undefined;
  type: string;
}

export type PostWriteScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'PostWrite'
>;

type PostWriteScreenRouteProp = RouteProp<CommunityStackParamList, 'PostWrite'>;

const PostWriteScreen = ({
  navigation,
  route,
}: {
  navigation: PostWriteScreenNavigationProp;
  route: PostWriteScreenRouteProp;
}) => {
  const insets = useSafeAreaInsets();
  const {playerId, feed} = route.params;

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<FilterType>({
    photo: false,
    viewing: false,
    information: false,
  });

  const [content, setContent] = useState<string>('');
  const [imageData, setImageData] = useState<SizeImage[]>([]);

  const [isImageInfo, setIsImageInfo] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const writeMutation = useMutation({mutationFn: postPlayersPosts});
  const editMutation = useMutation({mutationFn: updatePost});

  const handleWritePost = async () => {
    if (content.length === 0) {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '내용을 입력해주세요.',
      });

      return;
    }

    if (content.length > 1990) {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '최대 2,000자까지 작성 가능합니다.',
      });

      return;
    }

    const tags = Object.keys(selectedTag).filter(
      key => selectedTag[key as keyof FilterType],
    );

    if (!feed) {
      const writeData = await writeMutation.mutateAsync({
        playerId,
        content,
        tags,
        images: imageData,
      });

      if (writeData.message === '게시글이 작성되었습니다.') {
        navigation.replace('Post', {
          postId: writeData.result.id,
          playerUser: writeData.result.playerUser,
        });
      }
    } else {
      const editData = await editMutation.mutateAsync({
        postId: feed.id,
        content,
        tags,
        images: imageData,
      });

      if (editData.message === '게시글을 수정하였습니다.') {
        navigation.replace('Post', {
          postId: feed.id,
          playerUser: feed.playerUser,
        });
      }
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isImageInfo) {
      timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsImageInfo(false);
        });
      }, 3000); // 3초 후
    }

    return () => clearTimeout(timer); // 타이머 정리
  }, [fadeAnim, isImageInfo]);

  return (
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
        {(writeMutation.isPending || editMutation.isPending) && (
          <WriteLoading />
        )}
        <WriteHeader handleWritePost={handleWritePost} />
        <TagList selectedTag={selectedTag} setIsTagOpen={setIsTagOpen} />
        <TextInput
          placeholder="글을 작성해보세요"
          multiline
          placeholderTextColor={'#b4b4b4'}
          value={content}
          onChangeText={setContent}
          style={{
            fontSize: 18,
            flex: 1,
            paddingHorizontal: 12,
          }}
        />
        {isImageInfo && <ImageEditInfo fadeAnim={fadeAnim} />}
        <WriteFooter
          imageData={imageData}
          setImageData={setImageData}
          setIsImageInfo={setIsImageInfo}
          fadeAnim={fadeAnim}
        />
        {isTagOpen && (
          <TagModal selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostWriteScreen;
