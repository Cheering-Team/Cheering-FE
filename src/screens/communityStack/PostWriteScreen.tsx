import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import CloseSvg from '../../../assets/images/close-black.svg';
import CameraSvg from '../../../assets/images/plus-gray.svg';
import {TextInput} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {postPlayersPosts} from '../../apis/post';
import {useMutation} from '@tanstack/react-query';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CloseWhiteSvg from '../../../assets/images/x_white.svg';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

interface FilterType {
  photo: boolean;
  viewing: boolean;
  information: boolean;
}

interface FilterDataType {
  name: string;
  filter: 'photo' | 'viewing' | 'information';
}

const TagData: FilterDataType[] = [
  {name: '📸 직찍사', filter: 'photo'},
  {name: '👀 직관인증', filter: 'viewing'},
  {name: '🔎 정보', filter: 'information'},
];

interface SizeImage {
  uri: string;
  name: string | undefined;
  type: string;
  width?: number;
  height?: number;
}

const PostWriteScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const playerId = route.params.playerId;

  const [isImageInfo, setIsImageInfo] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<FilterType>({
    photo: false,
    viewing: false,
    information: false,
  });

  const [content, setContent] = useState<string>('');
  const [imageData, setImageData] = useState<SizeImage[]>([]);

  const mutation = useMutation({mutationFn: postPlayersPosts});

  const selectTag = (tag: 'photo' | 'viewing' | 'information') => {
    setSelectedTag(prev => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  const handleImageUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        forceJpg: true,
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

      setIsImageInfo(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

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
    const tags = Object.keys(selectedTag).filter(key => selectedTag[key]);

    const images = [];

    for (let image of imageData) {
      const resizerImage = await ImageResizer.createResizedImage(
        image.uri,
        image.width || 360,
        image.height || 360,
        'JPEG',
        50,
        0,
        null,
        false,
        {onlyScaleDown: true},
      );

      images.push({
        uri: resizerImage.uri,
        name: image.name,
        type: 'image/jpeg',
      });
    }

    const writeData = await mutation.mutateAsync({
      playerId,
      content,
      tags,
      images,
    });

    if (writeData.message === '게시글이 작성되었습니다.') {
      navigation.replace('Post', {
        postId: writeData.result.id,
        playerUser: writeData.result.playerUser,
      });
    }
  };

  const renderImage = ({item, drag, isActive}) => {
    return (
      <ScaleDecorator key={item.name}>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Image
            source={{uri: item.uri}}
            style={{
              width: 100,
              height: 130,
              borderRadius: 3,
              marginRight: 10,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 5,
              right: 15,
            }}>
            <Pressable
              style={{
                padding: 6,
                borderRadius: 20,
                backgroundColor: '#000000a1',
                marginLeft: 10,
              }}
              onPress={() => {
                setImageData(prev =>
                  prev.filter(image => image.uri !== item.uri),
                );
              }}>
              <CloseWhiteSvg width={9} height={9} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  useEffect(() => {
    let timer;
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
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              },
            ]}
            onPressOut={() => {
              setIsTagOpen(false);
            }}
          />
        )}
        {mutation.isPending && (
          <View
            style={[
              {
                zIndex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(240, 240, 240, 0.5)',
              },
              {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              },
            ]}>
            <View
              style={{
                width: 200,
                height: 100,
                backgroundColor: 'rgba(0, 0, 0, 0.763)',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomText
                fontWeight="500"
                style={{color: 'white', fontSize: 16, marginBottom: 15}}>
                글을 등록하고 있어요
              </CustomText>
              <ActivityIndicator color={'white'} />
            </View>
          </View>
        )}
        {/* 헤더 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
            paddingRight: 17,
            paddingLeft: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e1e1e1',
          }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <CloseSvg width={30} height={30} />
          </Pressable>
          <Pressable
            onPress={() => {
              handleWritePost();
            }}>
            <CustomText
              fontWeight="500"
              style={{fontSize: 19, color: '#58a04b'}}>
              등록
            </CustomText>
          </Pressable>
        </View>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={TagData}
          style={{padding: 12, flexGrow: 0}}
          renderItem={({item}) => {
            if (selectedTag[item.filter] === true) {
              return (
                <Pressable
                  key={item.filter}
                  style={{
                    borderWidth: 1,
                    backgroundColor: '#3a3a3a',
                    borderColor: '#3a3a3a',
                    paddingVertical: 6,
                    paddingHorizontal: 15,
                    borderRadius: 20,
                    marginRight: 6,
                  }}
                  onPress={() => {
                    setIsTagOpen(true);
                  }}>
                  <CustomText fontWeight="500" style={{color: 'white'}}>
                    {item.name}
                  </CustomText>
                </Pressable>
              );
            }
            return null;
          }}
          ListHeaderComponent={
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: '#dcdcdc',
                paddingVertical: 6,
                paddingHorizontal: 15,
                borderRadius: 20,
                marginRight: 6,
              }}
              onPress={() => {
                setIsTagOpen(true);
              }}>
              {Object.values(selectedTag).every(v => v === false) ? (
                <CustomText>➕ 태그 추가</CustomText>
              ) : (
                <CustomText>➕</CustomText>
              )}
            </Pressable>
          }
        />
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
        {isImageInfo && (
          <Animated.View
            style={[
              {
                backgroundColor: '#58a04b',
                alignSelf: 'flex-start',
                marginLeft: 10,
                padding: 5,
                borderRadius: 5,
                marginBottom: 10,
                alignItems: 'center',
              },
              {opacity: fadeAnim},
            ]}>
            <CustomText style={{color: 'white'}}>
              사진을 길게 눌러 순서를 조정할 수 있어요
            </CustomText>
            <View
              style={{
                position: 'absolute',
                bottom: -4,
                borderRadius: 2,
                width: 10,
                height: 10,
                backgroundColor: '#58a04b',
                transform: [{rotate: '45deg'}],
              }}></View>
          </Animated.View>
        )}

        {/* 하단 바 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingTop: 12,
            marginBottom: 10,
            borderTopWidth: 1,
            backgroundColor: 'white',
            borderColor: '#e1e1e1',
          }}>
          <DraggableFlatList
            data={imageData}
            horizontal={true}
            onDragEnd={({data}) => setImageData(data)}
            keyExtractor={item => item.uri}
            showsHorizontalScrollIndicator={false}
            renderItem={renderImage}
            containerStyle={{width: '100%'}}
            ListFooterComponent={
              <Pressable
                style={{
                  width: 100,
                  height: 130,
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: '#d0d0d0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleImageUpload}>
                <CameraSvg width={18} height={18} />
                <CustomText style={{color: '#858585', marginTop: 8}}>
                  사진 추가
                </CustomText>
              </Pressable>
            }
          />
        </View>
        {/* 태그 선택 */}
        {isTagOpen && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              position: 'absolute',
              top: 45,
              zIndex: 2,
              paddingTop: 12,
              paddingHorizontal: 12,
              backgroundColor: 'white',
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: '#e1e1e1',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            {TagData.map(tag => (
              <Pressable
                key={tag.filter}
                style={[
                  {
                    borderWidth: 1,
                    borderColor: '#dcdcdc',
                    paddingVertical: 6,
                    paddingHorizontal: 15,
                    borderRadius: 20,
                    marginRight: 6,
                    marginBottom: 10,
                  },
                  selectedTag[tag.filter] && {
                    backgroundColor: '#3a3a3a',
                    borderColor: '#3a3a3a',
                  },
                ]}
                onPress={() => {
                  selectTag(tag.filter);
                }}>
                <CustomText
                  fontWeight="500"
                  style={[selectedTag[tag.filter] && {color: 'white'}]}>
                  {tag.name}
                </CustomText>
              </Pressable>
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostWriteScreen;
