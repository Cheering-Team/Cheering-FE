import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import CustomText from '../../components/CustomText';
import CloseSvg from '../../../assets/images/close-black.svg';
import CameraSvg from '../../../assets/images/image.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

interface FilterType {
  photo: boolean;
  view: boolean;
  info: boolean;
}

interface FilterDataType {
  name: string;
  filter: 'photo' | 'view' | 'info';
}

const TagData: FilterDataType[] = [
  {name: '📸 직찍사', filter: 'photo'},
  {name: '👀 직관인증', filter: 'view'},
  {name: '🔎 정보', filter: 'info'},
];

interface SizeImage {
  uri: string;
  name: string | undefined;
  type: string;
  width?: number;
  height?: number;
}

const PostWriteScreen = ({navigation, route}) => {
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<FilterType>({
    photo: false,
    view: false,
    info: false,
  });
  const [imageData, setImageData] = React.useState<SizeImage[]>([]);

  const selectTag = (tag: 'photo' | 'view' | 'info') => {
    setSelectedTag(prev => ({
      ...prev,
      all: false,
      [tag]: !prev[tag],
    }));
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
          <Pressable>
            <CustomText
              fontWeight="500"
              style={{fontSize: 19, color: '#58a04b'}}>
              등록
            </CustomText>
          </Pressable>
        </View>

        <ScrollView
          style={{
            paddingVertical: 3,
            paddingHorizontal: 14,
            flexGrow: 1,
          }}>
          {/* 태그 목록 */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{flexGrow: 0}}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                width: '100%',
              }}
              onPress={() => {
                setIsTagOpen(true);
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#dcdcdc',
                  paddingVertical: 6,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  marginRight: 6,
                }}>
                {Object.values(selectedTag).every(v => v === false) ? (
                  <CustomText>➕ 태그 추가</CustomText>
                ) : (
                  <CustomText>➕</CustomText>
                )}
              </View>

              {TagData.map(tag => {
                if (selectedTag[tag.filter] === true) {
                  return (
                    <View
                      key={tag.filter}
                      style={{
                        borderWidth: 1,
                        backgroundColor: '#3a3a3a',
                        borderColor: '#3a3a3a',
                        paddingVertical: 6,
                        paddingHorizontal: 15,
                        borderRadius: 20,
                        marginRight: 6,
                      }}>
                      <CustomText fontWeight="500" style={{color: 'white'}}>
                        {tag.name}
                      </CustomText>
                    </View>
                  );
                }
              })}
            </Pressable>
          </ScrollView>
          {/* 글 작성 */}
          <TextInput
            placeholder="글을 작성해보세요"
            multiline
            placeholderTextColor={'#b4b4b4'}
            style={{
              fontSize: 18,
            }}
          />
          {/* 이미지 */}
          {imageData.length !== 0 && (
            <View
              style={{
                paddingVertical: 10,
              }}>
              {imageData.map(image => (
                <Image
                  key={image.name}
                  source={{uri: image.uri}}
                  style={{
                    width: '100%',
                    height:
                      (image.height || 0) *
                      ((Dimensions.get('window').width - 20) /
                        (image.width || 1)),
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </ScrollView>
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
          <Pressable onPress={handleImageUpload}>
            <CameraSvg width={23} height={23} />
          </Pressable>
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
