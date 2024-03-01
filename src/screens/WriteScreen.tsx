import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import {RouteProp} from '@react-navigation/native';
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
import CloseButtonSvg from '../../assets/images/x.svg';
import CustomText from '../components/CustomText';

import ImageSvg from '../../assets/images/image.svg';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {postCommunitiesPosts} from '../apis/post';

interface SizeImage {
  uri: string;
  name: string | undefined;
  type: string;
  width?: number;
  height?: number;
}

type CommunityScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Write'
>;

type CommunityScreenRouteProp = RouteProp<HomeStackParamList, 'Write'>;

const WriteScreen = ({
  navigation,
  route,
}: {
  navigation: CommunityScreenNavigationProp;
  route: CommunityScreenRouteProp;
}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <CloseButtonSvg width={30} height={30} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={() => PostTo()}>
          <CustomText fontWeight="500" style={{fontSize: 18, color: '#58a04b'}}>
            저장
          </CustomText>
        </Pressable>
      ),
      // 나중에 이전 페이지에서 이름 받아와야함
      headerTitle: `To. 이강인`,
      headerTitleStyle: {
        fontFamily: 'NotoSansKR-SemiBold',
      },
    });
  });

  const [content, setContent] = React.useState('');
  const [imageData, setImageData] = React.useState<SizeImage[]>([]);

  const {width: screenWidth} = Dimensions.get('window');
  const bottomHeight = useSafeAreaInsets().bottom;

  const PostTo = async () => {
    const formData = new FormData();

    if (content === '') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '내용을 입력해주세요',
      });
      return;
    }
    formData.append('content', content);

    imageData.map(image => {
      delete image.width;
      delete image.height;
      formData.append('files', image);
    });

    const response = await postCommunitiesPosts(
      {id: route.params.communityId},
      formData,
    );

    if (response.message === 'create post success') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 30,
        bottomOffset: 30,
        text1: '작성이 완료되었습니다',
      });

      navigation.navigate('Community', {communityId: route.params.communityId});
    }
  };

  const handleImageUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
      });

      const imageObj = images.map(image => ({
        uri: image.path,
        name: image.filename,
        type: image.mime,
        width: image.width,
        height: image.height,
      }));

      const newImages = [...imageData, ...imageObj];
      setImageData(newImages);
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={bottomHeight + 63}>
        <ScrollView>
          <TextInput
            key={'contentInput'}
            placeholder="내용을 작성해주세요"
            multiline
            placeholderTextColor="#989898"
            onChangeText={setContent}
            value={content}
            style={{
              flex: 0,
              paddingHorizontal: 20,
              paddingTop: 10,
              textAlignVertical: 'top',
              fontFamily: 'NotoSansKR-Regular',
              fontSize: 18,
              includeFontPadding: false,
            }}
          />
          {imageData.length !== 0 && (
            <View style={{padding: 10}}>
              {imageData.map(image => (
                <Image
                  key={image.name}
                  source={{uri: image.uri}}
                  style={{
                    width: '100%',
                    height:
                      (image.height || 0) *
                      ((screenWidth - 20) / (image.width || 1)),
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </ScrollView>
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderTopColor: '#e0e0e0',
            borderTopWidth: 1,
            backgroundColor: 'white',
          }}>
          <Pressable onPress={handleImageUpload}>
            <ImageSvg width={24} height={24} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WriteScreen;
